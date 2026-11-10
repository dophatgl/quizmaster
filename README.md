# QuizMaster - Multiple Choice App

A high-performance multiple-choice testing application with a native Rust backend and vanilla HTML/CSS/JS frontend powered by Tauri v2.

## Question Bank & Customization

The question bank has been refactored into human-readable, easily customizable JSON format:
- **[questions.json](file:///questions.json)**: The central questions database.
- **[questions.schema.json](file:///questions.schema.json)**: JSON schema with autocompletion and instant validation in VS Code/editors.
- **[QUESTIONS_GUIDE.md](file:///QUESTIONS_GUIDE.md)**: Full guide with examples for adding and updating questions.

### Question Updating Highlights
- **Human-Friendly Fields**: `correct` accepts 0-based indices (`0`, `1`, `2`, `3`), letter options (`"A"`, `"B"`, `"C"`, `"D"`), or exact option text.
- **Optional Attributes**: Auto-generates IDs if omitted, with sensible defaults for category and difficulty.
- **App UI Integration**: Import via file picker, drag-and-drop `.json` files, replace or merge banks, and one-click sync from `questions.json`.
- **Dual Support**: Works seamlessly both in native Tauri (Rust) and in standalone browser previews.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
