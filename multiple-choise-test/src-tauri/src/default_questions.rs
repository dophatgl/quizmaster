use crate::models::{parse_questions_from_json, Question};
use std::fs;
use std::path::Path;

/// Compile-time bundled default questions from data/questions.json
const EMBEDDED_DEFAULT_QUESTIONS_JSON: &str = include_str!("../data/questions.json");

/// Returns the default set of questions.
/// Proactively checks candidate local JSON file paths on disk so users can update questions
/// without recompiling, falling back to compile-time embedded questions.
pub fn get_default_questions() -> Vec<Question> {
    // Check candidate local paths on disk
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

    for candidate in candidates {
        let path = Path::new(candidate);
        if path.exists() {
            if let Ok(content) = fs::read_to_string(path) {
                if let Ok(qs) = parse_questions_from_json(&content) {
                    if !qs.is_empty() {
                        return qs;
                    }
                }
            }
        }
    }

    // Fall back to bundled embedded JSON
    parse_questions_from_json(EMBEDDED_DEFAULT_QUESTIONS_JSON).unwrap_or_else(|e| {
        eprintln!("Warning: Failed to parse embedded default questions: {}", e);
        Vec::new()
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_embedded_default_questions_validity() {
        let questions = get_default_questions();
        assert_eq!(questions.len(), 20, "Should load all 20 default questions");
        assert!(questions.iter().any(|q| q.category == "web"));
        assert!(questions.iter().any(|q| q.category == "cs"));
        assert!(questions.iter().any(|q| q.category == "science"));
        assert!(questions.iter().any(|q| q.category == "history"));

        for (idx, q) in questions.iter().enumerate() {
            assert!(!q.question.is_empty(), "Question #{} prompt must not be empty", idx + 1);
            assert!(q.options.len() >= 2, "Question #{} must have at least 2 options", idx + 1);
            assert!(q.correct < q.options.len(), "Question #{} correct index out of range", idx + 1);
        }
    }
}
