mod commands;
mod default_questions;
mod models;
mod state;

use state::AppState;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .unwrap_or_else(|_| std::env::current_dir().unwrap_or_default().join("data"));

            let app_state = AppState::new(app_data_dir);
            app.manage(app_state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_stats,
            commands::get_all_questions,
            commands::filter_questions,
            commands::start_quiz,
            commands::submit_quiz,
            commands::add_question,
            commands::update_question,
            commands::delete_question,
            commands::get_history,
            commands::get_history_entry,
            commands::clear_history,
            commands::delete_history_entry,
            commands::export_questions,
            commands::import_questions,
            commands::reload_questions_from_file,
            commands::reset_default_questions,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
