# QuizMaster - Question Data Guide (JSON Format)

This guide explains how to easily create, edit, customize, and manage multiple-choice questions in **QuizMaster**.

---

## 1. Quick Start: Where is the Question Data?

The primary question bank is stored in clean JSON format at:
- `questions.json` (project root)
- `src/data/questions.json` (web frontend copy)
- `src-tauri/data/questions.json` (native Rust fallback)

You can open `questions.json` in any text editor (VS Code, Cursor, Notepad, etc.) and update it directly!

---

## 2. Question Data Format & Schema

Each question is a JSON object with the following properties:

```json
{
  "id": "science-1",
  "category": "science",
  "difficulty": "easy",
  "question": "What is the approximate speed of light in a vacuum?",
  "code": null,
  "options": [
    "300,000 km/s",
    "150,000 km/s",
    "30,000 km/s",
    "1,080,000 km/s"
  ],
  "correct": "A",
  "explanation": "The speed of light in a vacuum is approximately 300,000 km/s (299,792,458 m/s)."
}
```

### Supported Fields:

| Field | Type | Required? | Description & Allowed Values |
| :--- | :--- | :---: | :--- |
| **`question`** | `string` | **Yes** | The main question statement or prompt. |
| **`options`** | `array` | **Yes** | Array of choices (minimum 2, typically 4). |
| **`correct`** | `number` / `string` | **Yes** | **Super flexible!** Specify either:<br>• 0-based index: `0`, `1`, `2`, `3`<br>• Letter: `"A"`, `"B"`, `"C"`, `"D"`<br>• Option text: `"300,000 km/s"` |
| **`id`** | `string` | *Optional* | Unique identifier (e.g. `"web-1"`, `"cs-2"`). Automatically generated if omitted. |
| **`category`** | `string` | *Optional* | `"web"`, `"cs"`, `"science"`, `"history"`, or `"custom"` (Default: `"custom"`). |
| **`difficulty`** | `string` | *Optional* | `"easy"`, `"medium"`, or `"hard"` (Default: `"medium"`). |
| **`code`** | `string` / `null` | *Optional* | Code snippet displayed in a highlighted block above options. Omit or set `null` if none. |
| **`explanation`**| `string` / `null` | *Optional* | Helpful solution note shown during practice mode or exam review. |

---

## 3. Super Flexible: Two Supported Root Layouts

You can organize questions in either format:

### Format A: Simple Array (Standard)
```json
[
  {
    "category": "science",
    "question": "What is the chemical symbol for water?",
    "options": ["H2O", "CO2", "NaCl", "O2"],
    "correct": "A"
  }
]
```

### Format B: Wrapped Object with Schema Validation
```json
{
  "$schema": "./questions.schema.json",
  "questions": [
    {
      "category": "science",
      "question": "What is the chemical symbol for water?",
      "options": ["H2O", "CO2", "NaCl", "O2"],
      "correct": "A"
    }
  ]
}
```

> [!TIP]
> **VS Code Autocomplete & Validation:**
> If you open `questions.json` in VS Code, it uses `questions.schema.json` to provide auto-complete for categories, difficulties, and instant error highlighting if options are missing or invalid!

---

## 4. Easy Updating via the QuizMaster UI

You do not need to manually touch code to update questions! In the running QuizMaster app:

1. **Question Bank Tab**:
   - Click **Add New Question** to create questions visually through a form.
   - Click **Edit** on any existing question to modify text, options, or explanations.
   - Click **Delete** to remove a question.

2. **Import / Export Modal**:
   - **📁 Open JSON File**: Pick any `.json` file from your computer to load instantly.
   - **Drag & Drop**: Simply drag a `.json` file from your desktop and drop it onto the text area.
   - **Replace All Questions**: Replaces the active question bank with the imported file.
   - **Append Questions**: Merges the new questions into your bank without removing existing ones.
   - **🔄 Sync questions.json**: One-click sync from the project's `questions.json` file.
   - **💾 Download JSON**: Exports your current questions bank as a clean, formatted `.json` file backup.

---

## 5. Adding Questions with Code Snippets

For coding and technical quizzes, format multiline code inside the `"code"` property:

```json
{
  "category": "web",
  "difficulty": "medium",
  "question": "What is the output of the following JavaScript snippet?",
  "code": "const arr = [1, 2, 3];\narr.length = 0;\nconsole.log(arr[0]);",
  "options": ["1", "undefined", "null", "ReferenceError"],
  "correct": "B",
  "explanation": "Setting array length to 0 empties the array; accessing index 0 returns undefined."
}
```
