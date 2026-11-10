use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Question {
    pub id: String,
    pub category: String,
    pub difficulty: String,
    pub question: String,
    #[serde(default)]
    pub code: Option<String>,
    pub options: Vec<String>,
    pub correct: usize,
    #[serde(default)]
    pub explanation: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum QuestionCollectionInput {
    List(Vec<RawQuestion>),
    Wrapped { questions: Vec<RawQuestion> },
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RawQuestion {
    #[serde(default)]
    id: Option<String>,
    #[serde(default = "default_category")]
    category: String,
    #[serde(default = "default_difficulty")]
    difficulty: String,
    question: String,
    #[serde(default)]
    code: Option<String>,
    #[serde(default)]
    options: Vec<String>,
    correct: serde_json::Value,
    #[serde(default)]
    explanation: Option<String>,
}

fn default_category() -> String {
    "custom".to_string()
}

fn default_difficulty() -> String {
    "medium".to_string()
}

/// Stable identity for a question's content, ignoring option order.
/// Used to prevent duplicate rows when the same questions are imported twice
/// or saved with different generated IDs.
pub fn question_fingerprint(q: &Question) -> String {
    let prompt = q.question.split_whitespace().collect::<Vec<_>>().join(" ").to_lowercase();
    let mut options: Vec<String> = q
        .options
        .iter()
        .enumerate()
        .map(|(idx, opt)| {
            let normalized = opt.split_whitespace().collect::<Vec<_>>().join(" ").to_lowercase();
            format!("{}:{}", if idx == q.correct { 1 } else { 0 }, normalized)
        })
        .collect();
    options.sort();
    format!("{}|{}", prompt, options.join("\u{1f}"))
}

impl RawQuestion {
    fn into_question(self, index: usize) -> Result<Question, String> {
        let question_text = self.question.trim().to_string();
        if question_text.is_empty() {
            return Err(format!("Question #{}: question prompt cannot be empty.", index + 1));
        }

        if self.options.len() < 2 {
            return Err(format!(
                "Question #{} ('{}'): must have at least 2 options, found {}.",
                index + 1,
                truncate_str(&question_text, 30),
                self.options.len()
            ));
        }

        let correct_index = match &self.correct {
            serde_json::Value::Number(num) => {
                if let Some(val) = num.as_u64() {
                    val as usize
                } else {
                    return Err(format!(
                        "Question #{}: 'correct' must be a non-negative integer or option letter.",
                        index + 1
                    ));
                }
            }
            serde_json::Value::String(s) => {
                let trimmed = s.trim();
                if let Ok(num) = trimmed.parse::<usize>() {
                    num
                } else if trimmed.len() == 1 {
                    let ch = trimmed.chars().next().unwrap().to_ascii_uppercase();
                    if ('A'..='Z').contains(&ch) {
                        (ch as usize) - ('A' as usize)
                    } else {
                        return Err(format!(
                            "Question #{}: invalid option letter '{}'. Expected A, B, C, etc.",
                            index + 1,
                            trimmed
                        ));
                    }
                } else if let Some(pos) = self.options.iter().position(|opt| opt.trim().eq_ignore_ascii_case(trimmed)) {
                    pos
                } else {
                    return Err(format!(
                        "Question #{}: correct answer '{}' does not match any option or valid index.",
                        index + 1,
                        trimmed
                    ));
                }
            }
            _ => {
                return Err(format!(
                    "Question #{}: 'correct' must be an integer index (0, 1, 2) or option letter ('A', 'B', 'C').",
                    index + 1
                ));
            }
        };

        if correct_index >= self.options.len() {
            return Err(format!(
                "Question #{}: correct index {} is out of range for {} options.",
                index + 1,
                correct_index,
                self.options.len()
            ));
        }

        let id = match self.id {
            Some(s) if !s.trim().is_empty() => s.trim().to_string(),
            _ => format!("q-{}-{}", index + 1, fastrand::u16(..)),
        };

        Ok(Question {
            id,
            category: self.category.to_lowercase(),
            difficulty: self.difficulty.to_lowercase(),
            question: question_text,
            code: self.code.filter(|c| !c.trim().is_empty()),
            options: self.options,
            correct: correct_index,
            explanation: self.explanation.filter(|e| !e.trim().is_empty()),
        })
    }
}

pub fn parse_questions_from_json(json_str: &str) -> Result<Vec<Question>, String> {
    let parsed: QuestionCollectionInput = serde_json::from_str(json_str)
        .map_err(|e| format!("Invalid JSON syntax or structure: {}", e))?;

    let raw_list = match parsed {
        QuestionCollectionInput::List(list) => list,
        QuestionCollectionInput::Wrapped { questions } => questions,
    };

    if raw_list.is_empty() {
        return Err("Question list in JSON is empty.".to_string());
    }

    let mut questions = Vec::with_capacity(raw_list.len());
    let mut seen_fingerprints = HashSet::new();
    let mut seen_ids = HashSet::new();

    for (idx, raw) in raw_list.into_iter().enumerate() {
        let mut question = raw.into_question(idx)?;
        let fingerprint = question_fingerprint(&question);

        // Drop exact duplicate content (same prompt, choices, and correct answer).
        if seen_fingerprints.contains(&fingerprint) {
            continue;
        }

        // Keep different questions even when the source file reuses an ID.
        if seen_ids.contains(&question.id) {
            question.id = format!("{}-{}", question.id, fastrand::u16(..));
        }

        seen_fingerprints.insert(fingerprint);
        seen_ids.insert(question.id.clone());
        questions.push(question);
    }

    if questions.is_empty() {
        return Err("Question list contains no unique questions.".to_string());
    }

    Ok(questions)
}

fn truncate_str(s: &str, max_len: usize) -> &str {
    if s.len() <= max_len {
        s
    } else {
        match s.char_indices().nth(max_len) {
            Some((idx, _)) => &s[..idx],
            None => s,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QuizConfig {
    pub category: String,
    pub difficulty: String,
    pub count: usize,
    pub mode: String,
    pub timer: String,
    pub shuffle_questions: bool,
    pub shuffle_options: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActiveQuizQuestion {
    pub id: String,
    pub category: String,
    pub difficulty: String,
    pub question: String,
    pub code: Option<String>,
    pub options: Vec<String>,
    pub correct: usize,
    pub explanation: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QuizSubmission {
    pub questions: Vec<ActiveQuizQuestion>,
    pub user_answers: HashMap<usize, usize>,
    pub flagged: Vec<usize>,
    pub total_duration_secs: u64,
    pub category: String,
    pub mode: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QuestionBreakdown {
    pub index: usize,
    pub id: String,
    pub category: String,
    pub difficulty: String,
    pub question: String,
    pub code: Option<String>,
    pub options: Vec<String>,
    pub correct: usize,
    pub user_pick: Option<usize>,
    pub is_correct: bool,
    pub is_skipped: bool,
    pub is_flagged: bool,
    pub explanation: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QuizResult {
    pub id: String,
    pub timestamp: u64,
    pub category: String,
    pub mode: String,
    pub total_questions: usize,
    pub correct_count: usize,
    pub wrong_count: usize,
    pub skipped_count: usize,
    pub flagged_count: usize,
    pub accuracy: u32,
    pub duration_secs: u64,
    pub breakdowns: Vec<QuestionBreakdown>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HistoryEntry {
    pub id: String,
    pub timestamp: u64,
    pub category: String,
    pub mode: String,
    pub total_questions: usize,
    pub correct_count: usize,
    pub wrong_count: usize,
    pub skipped_count: usize,
    pub accuracy: u32,
    pub duration_secs: u64,
    #[serde(default)]
    pub breakdowns: Vec<QuestionBreakdown>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StatsSummary {
    pub total_questions: usize,
    pub count_all: usize,
    pub count_web: usize,
    pub count_cs: usize,
    pub count_science: usize,
    pub count_history: usize,
    pub count_custom: usize,
    pub total_attempts: usize,
    pub avg_accuracy: u32,
    pub best_score: u32,
    pub total_time_mins: u64,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_questions_from_json_standard_array() {
        let json = r#"[
            {
                "id": "test-1",
                "category": "science",
                "difficulty": "easy",
                "question": "What is H2O?",
                "options": ["Water", "Oxygen", "Hydrogen"],
                "correct": 0,
                "explanation": "H2O is water"
            }
        ]"#;

        let res = parse_questions_from_json(json).expect("Should parse standard array");
        assert_eq!(res.len(), 1);
        assert_eq!(res[0].id, "test-1");
        assert_eq!(res[0].correct, 0);
    }

    #[test]
    fn test_parse_questions_from_json_wrapped_and_letters() {
        let json = r#"{
            "questions": [
                {
                    "question": "Which planet is known as the Red Planet?",
                    "options": ["Venus", "Mars", "Jupiter", "Saturn"],
                    "correct": "B"
                },
                {
                    "question": "Capital of France?",
                    "options": ["Berlin", "Madrid", "Paris", "Rome"],
                    "correct": "Paris"
                }
            ]
        }"#;

        let res = parse_questions_from_json(json).expect("Should parse wrapped format");
        assert_eq!(res.len(), 2);
        assert_eq!(res[0].correct, 1); // 'B' -> 1
        assert_eq!(res[0].category, "custom"); // default category
        assert_eq!(res[0].difficulty, "medium"); // default difficulty
        assert!(!res[0].id.is_empty()); // auto-generated ID

        assert_eq!(res[1].correct, 2); // 'Paris' matches options[2]
    }

    #[test]
    fn test_parse_questions_validation_errors() {
        // Empty question
        let json_empty_prompt = r#"[{"question": "", "options": ["A", "B"], "correct": 0}]"#;
        assert!(parse_questions_from_json(json_empty_prompt).is_err());

        // Insufficient options
        let json_one_option = r#"[{"question": "Valid?", "options": ["A"], "correct": 0}]"#;
        assert!(parse_questions_from_json(json_one_option).is_err());

        // Out of bounds correct
        let json_oob = r#"[{"question": "Valid?", "options": ["A", "B"], "correct": 5}]"#;
        assert!(parse_questions_from_json(json_oob).is_err());
    }

    #[test]
    fn test_parse_questions_drops_duplicate_content() {
        let json = r#"[
            {
                "id": "a",
                "question": "What is 2 + 2?",
                "options": ["3", "4", "5"],
                "correct": 1
            },
            {
                "id": "b",
                "question": "  what is 2 + 2? ",
                "options": ["5", "4", "3"],
                "correct": 1
            },
            {
                "id": "c",
                "question": "What is 3 + 3?",
                "options": ["5", "6"],
                "correct": 1
            }
        ]"#;

        let res = parse_questions_from_json(json).expect("Should parse unique questions");
        assert_eq!(res.len(), 2);
        assert_eq!(res[0].id, "a");
        assert_eq!(res[1].id, "c");
    }

    #[test]
    fn test_question_fingerprint_ignores_option_order() {
        let left = Question {
            id: "1".to_string(),
            category: "custom".to_string(),
            difficulty: "easy".to_string(),
            question: "Pick one".to_string(),
            code: None,
            options: vec!["A".to_string(), "B".to_string()],
            correct: 0,
            explanation: None,
        };
        let right = Question {
            id: "2".to_string(),
            category: "science".to_string(),
            difficulty: "hard".to_string(),
            question: " pick one ".to_string(),
            code: None,
            options: vec!["B".to_string(), "A".to_string()],
            correct: 1,
            explanation: None,
        };

        assert_eq!(question_fingerprint(&left), question_fingerprint(&right));
    }
}
