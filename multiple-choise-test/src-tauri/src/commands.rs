use std::time::{SystemTime, UNIX_EPOCH};
use tauri::State;

use crate::default_questions::get_default_questions;
use crate::models::{
    parse_questions_from_json, question_fingerprint, ActiveQuizQuestion, HistoryEntry, Question,
    QuestionBreakdown, QuizConfig, QuizResult, QuizSubmission, StatsSummary,
};
use crate::state::AppState;

fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

#[tauri::command]
pub fn get_stats(state: State<'_, AppState>) -> Result<StatsSummary, String> {
    let questions = state.questions.lock().map_err(|e| e.to_string())?;
    let history = state.history.lock().map_err(|e| e.to_string())?;

    let total_questions = questions.len();
    let count_web = questions.iter().filter(|q| q.category == "web").count();
    let count_cs = questions.iter().filter(|q| q.category == "cs").count();
    let count_science = questions.iter().filter(|q| q.category == "science").count();
    let count_history = questions.iter().filter(|q| q.category == "history").count();
    let count_custom = questions.iter().filter(|q| q.category == "custom").count();

    let total_attempts = history.len();
    let (avg_accuracy, best_score, total_time_mins) = if total_attempts > 0 {
        let sum_accuracy: u32 = history.iter().map(|h| h.accuracy).sum();
        let avg = sum_accuracy / (total_attempts as u32);
        let best = history.iter().map(|h| h.accuracy).max().unwrap_or(0);
        let total_secs: u64 = history.iter().map(|h| h.duration_secs).sum();
        (avg, best, total_secs / 60)
    } else {
        (0, 0, 0)
    };

    Ok(StatsSummary {
        total_questions,
        count_all: total_questions,
        count_web,
        count_cs,
        count_science,
        count_history,
        count_custom,
        total_attempts,
        avg_accuracy,
        best_score,
        total_time_mins,
    })
}

#[tauri::command]
pub fn get_all_questions(state: State<'_, AppState>) -> Result<Vec<Question>, String> {
    let questions = state.questions.lock().map_err(|e| e.to_string())?;
    Ok(questions.clone())
}

#[tauri::command]
pub fn filter_questions(
    state: State<'_, AppState>,
    category: String,
    difficulty: String,
    search: String,
) -> Result<Vec<Question>, String> {
    let questions = state.questions.lock().map_err(|e| e.to_string())?;
    let search_lower = search.to_lowercase();

    let filtered: Vec<Question> = questions
        .iter()
        .filter(|q| {
            let match_cat = category == "all" || q.category == category;
            let match_diff = difficulty == "all" || q.difficulty == difficulty;
            let match_search = search_lower.is_empty()
                || q.question.to_lowercase().contains(&search_lower)
                || q.explanation
                    .as_ref()
                    .map(|exp| exp.to_lowercase().contains(&search_lower))
                    .unwrap_or(false)
                || q.options
                    .iter()
                    .any(|opt| opt.to_lowercase().contains(&search_lower));

            match_cat && match_diff && match_search
        })
        .cloned()
        .collect();

    Ok(filtered)
}

#[tauri::command]
pub fn start_quiz(
    state: State<'_, AppState>,
    config: QuizConfig,
) -> Result<Vec<ActiveQuizQuestion>, String> {
    let questions = state.questions.lock().map_err(|e| e.to_string())?;

    let mut eligible: Vec<Question> = questions
        .iter()
        .filter(|q| {
            let match_cat = config.category == "all" || q.category == config.category;
            let match_diff = config.difficulty == "all" || q.difficulty == config.difficulty;
            match_cat && match_diff
        })
        .cloned()
        .collect();

    if eligible.is_empty() {
        return Err("No questions match the selected category and difficulty.".to_string());
    }

    if config.shuffle_questions {
        fastrand::shuffle(&mut eligible);
    }

    if config.count > 0 && config.count < eligible.len() {
        eligible.truncate(config.count);
    }

    let active_questions = eligible
        .into_iter()
        .map(|q| {
            let mut indexed_options: Vec<(usize, String)> =
                q.options.into_iter().enumerate().collect();

            if config.shuffle_options {
                fastrand::shuffle(&mut indexed_options);
            }

            let new_correct = indexed_options
                .iter()
                .position(|(orig_idx, _)| *orig_idx == q.correct)
                .unwrap_or(0);

            let options = indexed_options.into_iter().map(|(_, opt)| opt).collect();

            ActiveQuizQuestion {
                id: q.id,
                category: q.category,
                difficulty: q.difficulty,
                question: q.question,
                code: q.code,
                options,
                correct: new_correct,
                explanation: q.explanation,
            }
        })
        .collect();

    Ok(active_questions)
}

#[tauri::command]
pub fn submit_quiz(
    state: State<'_, AppState>,
    submission: QuizSubmission,
) -> Result<QuizResult, String> {
    let total_questions = submission.questions.len();
    if total_questions == 0 {
        return Err("Cannot submit an empty quiz.".to_string());
    }

    let mut correct_count = 0;
    let mut wrong_count = 0;
    let mut skipped_count = 0;
    let flagged_set: std::collections::HashSet<usize> =
        submission.flagged.iter().copied().collect();

    let mut breakdowns = Vec::with_capacity(total_questions);

    for (idx, q) in submission.questions.into_iter().enumerate() {
        let user_pick = submission.user_answers.get(&idx).copied();
        let is_answered = user_pick.is_some();
        let is_correct = user_pick == Some(q.correct);
        let is_skipped = !is_answered;
        let is_flagged = flagged_set.contains(&idx);

        if is_skipped {
            skipped_count += 1;
        } else if is_correct {
            correct_count += 1;
        } else {
            wrong_count += 1;
        }

        breakdowns.push(QuestionBreakdown {
            index: idx,
            id: q.id,
            category: q.category,
            difficulty: q.difficulty,
            question: q.question,
            code: q.code,
            options: q.options,
            correct: q.correct,
            user_pick,
            is_correct,
            is_skipped,
            is_flagged,
            explanation: q.explanation,
        });
    }

    let accuracy = ((correct_count as f64 / total_questions as f64) * 100.0).round() as u32;
    let timestamp = current_timestamp();
    let result_id = format!("res-{}", timestamp);

    let history_entry = HistoryEntry {
        id: result_id.clone(),
        timestamp,
        category: submission.category.clone(),
        mode: submission.mode.clone(),
        total_questions,
        correct_count,
        wrong_count,
        skipped_count,
        accuracy,
        duration_secs: submission.total_duration_secs,
        breakdowns: breakdowns.clone(),
    };

    {
        let mut history = state.history.lock().map_err(|e| e.to_string())?;
        history.insert(0, history_entry);
    }
    let _ = state.save_history();

    Ok(QuizResult {
        id: result_id,
        timestamp,
        category: submission.category,
        mode: submission.mode,
        total_questions,
        correct_count,
        wrong_count,
        skipped_count,
        flagged_count: submission.flagged.len(),
        accuracy,
        duration_secs: submission.total_duration_secs,
        breakdowns,
    })
}

#[tauri::command]
pub fn add_question(
    state: State<'_, AppState>,
    mut question: Question,
) -> Result<Question, String> {
    if question.question.trim().is_empty() {
        return Err("Question prompt cannot be empty.".to_string());
    }
    if question.options.len() < 2 {
        return Err("A question must have at least 2 options.".to_string());
    }
    if question.correct >= question.options.len() {
        return Err("Valid correct option index required.".to_string());
    }

    if question.id.trim().is_empty() {
        question.id = format!("q-{}-{}", current_timestamp(), fastrand::u16(..));
    }

    {
        let mut questions = state.questions.lock().map_err(|e| e.to_string())?;

        let fingerprint = question_fingerprint(&question);
        if questions
            .iter()
            .any(|q| question_fingerprint(q) == fingerprint)
        {
            return Err("An identical question already exists.".to_string());
        }

        // Avoid overwriting an unrelated question when the supplied ID collides.
        while questions.iter().any(|q| q.id == question.id) {
            question.id = format!("q-{}-{}", current_timestamp(), fastrand::u16(..));
        }

        questions.insert(0, question.clone());
    }
    state.save_questions()?;

    Ok(question)
}

#[tauri::command]
pub fn update_question(
    state: State<'_, AppState>,
    question: Question,
) -> Result<Question, String> {
    if question.question.trim().is_empty() {
        return Err("Question prompt cannot be empty.".to_string());
    }
    if question.options.len() < 2 {
        return Err("A question must have at least 2 options.".to_string());
    }
    if question.correct >= question.options.len() {
        return Err("Valid correct option index required.".to_string());
    }

    {
        let mut questions = state.questions.lock().map_err(|e| e.to_string())?;
        if let Some(pos) = questions.iter().position(|q| q.id == question.id) {
            let fingerprint = question_fingerprint(&question);
            let duplicate = questions
                .iter()
                .enumerate()
                .any(|(idx, q)| idx != pos && question_fingerprint(q) == fingerprint);

            if duplicate {
                return Err("Another question with identical content already exists.".to_string());
            }

            questions[pos] = question.clone();
        } else {
            return Err("Question not found.".to_string());
        }
    }
    state.save_questions()?;

    Ok(question)
}

#[tauri::command]
pub fn delete_question(state: State<'_, AppState>, id: String) -> Result<bool, String> {
    {
        let mut questions = state.questions.lock().map_err(|e| e.to_string())?;
        let orig_len = questions.len();
        questions.retain(|q| q.id != id);
        if questions.len() == orig_len {
            return Err("Question not found.".to_string());
        }
    }
    state.save_questions()?;
    Ok(true)
}

#[tauri::command]
pub fn get_history(state: State<'_, AppState>) -> Result<Vec<HistoryEntry>, String> {
    let history = state.history.lock().map_err(|e| e.to_string())?;
    Ok(history.clone())
}

#[tauri::command]
pub fn get_history_entry(state: State<'_, AppState>, id: String) -> Result<HistoryEntry, String> {
    let history = state.history.lock().map_err(|e| e.to_string())?;
    history
        .iter()
        .find(|e| e.id == id)
        .cloned()
        .ok_or_else(|| format!("No history entry found with id '{}'", id))
}

#[tauri::command]
pub fn clear_history(state: State<'_, AppState>) -> Result<bool, String> {
    {
        let mut history = state.history.lock().map_err(|e| e.to_string())?;
        history.clear();
    }
    state.save_history()?;
    Ok(true)
}

#[tauri::command]
pub fn delete_history_entry(state: State<'_, AppState>, id: String) -> Result<bool, String> {
    {
        let mut history = state.history.lock().map_err(|e| e.to_string())?;
        let before = history.len();
        history.retain(|entry| entry.id != id);
        if history.len() == before {
            return Err(format!("No history entry found with id '{}'", id));
        }
    }
    state.save_history()?;
    Ok(true)
}

#[tauri::command]
pub fn export_questions(state: State<'_, AppState>) -> Result<String, String> {
    let questions = state.questions.lock().map_err(|e| e.to_string())?;
    serde_json::to_string_pretty(&*questions).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn import_questions(
    state: State<'_, AppState>,
    json_str: String,
    mode: Option<String>,
) -> Result<usize, String> {
    let incoming = parse_questions_from_json(&json_str)?;
    let import_mode = mode.as_deref().unwrap_or("append");

    let changed = {
        let mut questions = state.questions.lock().map_err(|e| e.to_string())?;
        match import_mode {
            "replace" | "overwrite" => {
                let count = incoming.len();
                *questions = incoming;
                count
            }
            "upsert" => {
                let mut changed = 0usize;
                for item in incoming {
                    let fingerprint = question_fingerprint(&item);

                    if let Some(pos) = questions.iter().position(|q| q.id == item.id) {
                        // Refuse content that would collide with a different existing question.
                        let duplicate = questions.iter().enumerate().any(|(idx, q)| {
                            idx != pos && question_fingerprint(q) == fingerprint
                        });
                        if duplicate {
                            continue;
                        }
                        questions[pos] = item;
                        changed += 1;
                    } else if let Some(pos) = questions
                        .iter()
                        .position(|q| question_fingerprint(q) == fingerprint)
                    {
                        // Same content under a different ID: update it in place and
                        // keep the existing ID so references remain stable.
                        let mut updated = item;
                        updated.id = questions[pos].id.clone();
                        questions[pos] = updated;
                        changed += 1;
                    } else {
                        questions.push(item);
                        changed += 1;
                    }
                }
                changed
            }
            _ => {
                // "append": skip questions whose content already exists.
                let mut added = 0usize;
                for mut item in incoming {
                    let fingerprint = question_fingerprint(&item);
                    if questions
                        .iter()
                        .any(|q| question_fingerprint(q) == fingerprint)
                    {
                        continue;
                    }

                    while questions.iter().any(|q| q.id == item.id) {
                        item.id = format!("q-{}-{}", current_timestamp(), fastrand::u16(..));
                    }

                    questions.push(item);
                    added += 1;
                }
                added
            }
        }
    };
    state.save_questions()?;

    Ok(changed)
}

#[tauri::command]
pub fn reload_questions_from_file(
    state: State<'_, AppState>,
    file_path: Option<String>,
) -> Result<usize, String> {
    let content = if let Some(path_str) = file_path {
        std::fs::read_to_string(&path_str)
            .map_err(|e| format!("Could not read file '{}': {}", path_str, e))?
    } else {
        let candidates = [
            "questions.json",
            "../questions.json",
            "../../questions.json",
            "data/questions.json",
            "../data/questions.json",
            "src/data/questions.json",
            "../src/data/questions.json",
            "../../src/data/questions.json",
        ];
        let mut found = None;
        for c in candidates {
            if std::path::Path::new(c).exists() {
                if let Ok(c_str) = std::fs::read_to_string(c) {
                    found = Some(c_str);
                    break;
                }
            }
        }
        found.ok_or_else(|| "No questions.json found in candidate paths.".to_string())?
    };

    let incoming = parse_questions_from_json(&content)?;
    let count = incoming.len();
    {
        let mut questions = state.questions.lock().map_err(|e| e.to_string())?;
        *questions = incoming;
    }
    state.save_questions()?;
    Ok(count)
}

#[tauri::command]
pub fn reset_default_questions(state: State<'_, AppState>) -> Result<usize, String> {
    let defaults = get_default_questions();
    let count = defaults.len();
    {
        let mut questions = state.questions.lock().map_err(|e| e.to_string())?;
        *questions = defaults;
    }
    state.save_questions()?;
    Ok(count)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    fn setup_test_state() -> (AppState, std::path::PathBuf) {
        let temp_dir = std::env::temp_dir().join(format!("quiz_cmd_test_{}", fastrand::u32(..)));
        let state = AppState::new(temp_dir.clone());
        (state, temp_dir)
    }

    #[test]
    fn test_question_crud() {
        let (state, temp_dir) = setup_test_state();

        let new_q = Question {
            id: "test-q1".to_string(),
            category: "custom".to_string(),
            difficulty: "easy".to_string(),
            question: "Is Rust memory-safe?".to_string(),
            code: None,
            options: vec!["Yes".to_string(), "No".to_string()],
            correct: 0,
            explanation: Some("Rust enforces memory safety via ownership without a garbage collector.".to_string()),
        };

        // Add
        {
            let mut qs = state.questions.lock().unwrap();
            qs.insert(0, new_q.clone());
        }
        assert!(state.save_questions().is_ok());

        // Verify exists
        {
            let qs = state.questions.lock().unwrap();
            assert_eq!(qs[0].id, "test-q1");
            assert_eq!(qs[0].question, "Is Rust memory-safe?");
        }

        // Delete
        {
            let mut qs = state.questions.lock().unwrap();
            qs.retain(|q| q.id != "test-q1");
        }
        assert!(state.save_questions().is_ok());

        {
            let qs = state.questions.lock().unwrap();
            assert!(!qs.iter().any(|q| q.id == "test-q1"));
        }

        let _ = std::fs::remove_dir_all(temp_dir);
    }

    #[test]
    fn test_quiz_scoring_calculation() {
        let (_state, temp_dir) = setup_test_state();

        let active_qs = vec![
            ActiveQuizQuestion {
                id: "q1".to_string(),
                category: "cs".to_string(),
                difficulty: "easy".to_string(),
                question: "Q1".to_string(),
                code: None,
                options: vec!["A".to_string(), "B".to_string()],
                correct: 0,
                explanation: None,
            },
            ActiveQuizQuestion {
                id: "q2".to_string(),
                category: "cs".to_string(),
                difficulty: "easy".to_string(),
                question: "Q2".to_string(),
                code: None,
                options: vec!["A".to_string(), "B".to_string()],
                correct: 1,
                explanation: None,
            },
        ];

        let mut user_answers = HashMap::new();
        user_answers.insert(0, 0); // Correct
        user_answers.insert(1, 0); // Incorrect (correct was 1)

        let submission = QuizSubmission {
            questions: active_qs,
            user_answers,
            flagged: vec![1],
            total_duration_secs: 45,
            category: "cs".to_string(),
            mode: "exam".to_string(),
        };

        let total = submission.questions.len();
        let mut correct = 0;
        let mut wrong = 0;

        for (idx, q) in submission.questions.iter().enumerate() {
            let pick = submission.user_answers.get(&idx).copied();
            if pick == Some(q.correct) {
                correct += 1;
            } else {
                wrong += 1;
            }
        }

        let accuracy = ((correct as f64 / total as f64) * 100.0).round() as u32;

        assert_eq!(correct, 1);
        assert_eq!(wrong, 1);
        assert_eq!(accuracy, 50);

        let _ = std::fs::remove_dir_all(temp_dir);
    }

    #[test]
    fn test_import_modes_and_letters() {
        let (state, temp_dir) = setup_test_state();

        let json_import = r#"[
            {
                "id": "custom-1",
                "category": "science",
                "difficulty": "easy",
                "question": "What is boiling point of water?",
                "options": ["90C", "100C", "110C"],
                "correct": "B",
                "explanation": "Boils at 100C"
            }
        ]"#;

        // Test replace
        let imported = parse_questions_from_json(json_import).unwrap();
        {
            let mut qs = state.questions.lock().unwrap();
            *qs = imported;
        }
        assert!(state.save_questions().is_ok());

        {
            let qs = state.questions.lock().unwrap();
            assert_eq!(qs.len(), 1);
            assert_eq!(qs[0].id, "custom-1");
            assert_eq!(qs[0].correct, 1); // 'B' -> 1
        }

        let _ = std::fs::remove_dir_all(temp_dir);
    }

    #[test]
    fn test_import_append_skips_duplicate_content() {
        let (state, temp_dir) = setup_test_state();

        {
            let mut qs = state.questions.lock().unwrap();
            qs.clear();
            qs.push(Question {
                id: "existing".to_string(),
                category: "custom".to_string(),
                difficulty: "easy".to_string(),
                question: "What is 2 + 2?".to_string(),
                code: None,
                options: vec!["3".to_string(), "4".to_string()],
                correct: 1,
                explanation: None,
            });
        }

        let json_import = r#"[
            {
                "id": "dup",
                "question": "what is 2 + 2?",
                "options": ["4", "3"],
                "correct": 0
            },
            {
                "id": "new",
                "question": "What is 3 + 3?",
                "options": ["5", "6"],
                "correct": 1
            }
        ]"#;

        let incoming = parse_questions_from_json(json_import).unwrap();
        {
            let mut questions = state.questions.lock().unwrap();
            let mut added = 0usize;
            for mut item in incoming {
                let fingerprint = question_fingerprint(&item);
                if questions
                    .iter()
                    .any(|q| question_fingerprint(q) == fingerprint)
                {
                    continue;
                }
                while questions.iter().any(|q| q.id == item.id) {
                    item.id = format!("q-{}", fastrand::u16(..));
                }
                questions.push(item);
                added += 1;
            }
            assert_eq!(added, 1);
            assert_eq!(questions.len(), 2);
            assert!(questions.iter().any(|q| q.id == "new"));
            assert!(!questions.iter().any(|q| q.id == "dup"));
        }

        let _ = std::fs::remove_dir_all(temp_dir);
    }
}
