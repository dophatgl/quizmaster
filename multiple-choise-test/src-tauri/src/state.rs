use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

use crate::default_questions::get_default_questions;
use crate::models::{parse_questions_from_json, HistoryEntry, Question};

fn count_raw_questions(json_str: &str) -> Result<usize, ()> {
    let value: serde_json::Value = serde_json::from_str(json_str).map_err(|_| ())?;
    match value {
        serde_json::Value::Array(list) => Ok(list.len()),
        serde_json::Value::Object(map) => map
            .get("questions")
            .and_then(|v| v.as_array())
            .map(|list| list.len())
            .ok_or(()),
        _ => Err(()),
    }
}

pub struct AppState {
    pub questions: Mutex<Vec<Question>>,
    pub history: Mutex<Vec<HistoryEntry>>,
    pub storage_dir: PathBuf,
}

impl AppState {
    pub fn new(storage_dir: PathBuf) -> Self {
        if !storage_dir.exists() {
            let _ = fs::create_dir_all(&storage_dir);
        }

        let questions_path = storage_dir.join("questions.json");
        let questions = if questions_path.exists() {
            match fs::read_to_string(&questions_path) {
                Ok(content) => {
                    let parsed = parse_questions_from_json(&content)
                        .unwrap_or_else(|_| get_default_questions());

                    // Persist cleaned data when duplicate content was stripped on load.
                    if let Ok(raw_count) = count_raw_questions(&content) {
                        if raw_count > parsed.len() {
                            if let Ok(serialized) = serde_json::to_string_pretty(&parsed) {
                                let _ = fs::write(&questions_path, serialized);
                            }
                        }
                    }

                    parsed
                }
                Err(_) => get_default_questions(),
            }
        } else {
            let defaults = get_default_questions();
            if let Ok(serialized) = serde_json::to_string_pretty(&defaults) {
                let _ = fs::write(&questions_path, serialized);
            }
            defaults
        };

        let history_path = storage_dir.join("history.json");
        let history = if history_path.exists() {
            match fs::read_to_string(&history_path) {
                Ok(content) => serde_json::from_str::<Vec<HistoryEntry>>(&content)
                    .unwrap_or_default(),
                Err(_) => Vec::new(),
            }
        } else {
            Vec::new()
        };

        Self {
            questions: Mutex::new(questions),
            history: Mutex::new(history),
            storage_dir,
        }
    }

    pub fn save_questions(&self) -> Result<(), String> {
        let guard = self.questions.lock().map_err(|e| e.to_string())?;
        let json = serde_json::to_string_pretty(&*guard).map_err(|e| e.to_string())?;
        let path = self.storage_dir.join("questions.json");
        fs::write(path, json).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn save_history(&self) -> Result<(), String> {
        let guard = self.history.lock().map_err(|e| e.to_string())?;
        let json = serde_json::to_string_pretty(&*guard).map_err(|e| e.to_string())?;
        let path = self.storage_dir.join("history.json");
        fs::write(path, json).map_err(|e| e.to_string())?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_app_state_initialization() {
        let temp_dir = std::env::temp_dir().join(format!("quiz_test_{}", fastrand::u32(..)));
        let state = AppState::new(temp_dir.clone());

        {
            let questions = state.questions.lock().unwrap();
            assert!(!questions.is_empty(), "Should initialize with default questions");
            assert!(questions.iter().any(|q| q.category == "web"));
            assert!(questions.iter().any(|q| q.category == "cs"));
        }

        let _ = fs::remove_dir_all(temp_dir);
    }
}
