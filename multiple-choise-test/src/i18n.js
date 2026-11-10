/**
 * QuizMaster - Internationalization (i18n) Engine
 * Supports seamless runtime switching between languages with zero-reload DOM updates,
 * parameter interpolation, locale-aware date/number formatting, and local persistence.
 */

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", locale: "en-US" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", locale: "vi-VN" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", locale: "es-ES" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", locale: "fr-FR" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", locale: "ja-JP" }
];

const DEFAULT_LANG = "en";
const STORAGE_KEY = "quizmaster_lang";

const TRANSLATIONS = {
  en: {
    app: {
      title: "QuizMaster",
      brandTitle: "QuizMaster",
      brandSubtitle: "Multiple Choice Quiz Studio",
      backendRust: "🦀 Rust",
      backendRustTooltip: "Driven by Rust Backend",
      backendRustNative: "🦀 Rust Native",
      backendRustNativeTooltip: "Direct Rust IPC via Tauri 2",
      backendBrowser: "🌐 Browser",
      backendBrowserTooltip: "Running in browser preview mode",
      goToHub: "Go to Hub"
    },
    nav: {
      hub: "Quiz Hub",
      bank: "Question Bank",
      history: "History"
    },
    header: {
      shortcuts: "Keyboard Shortcuts (?)",
      toggleSound: "Toggle Sound Effects",
      toggleTheme: "Toggle Dark/Light Mode",
      language: "Select Language"
    },
    hub: {
      hero: {
        badge: "Interactive Assessment & Learning",
        title: "Sharpen Your Mind with Smart Quizzes",
        subtitle: "Practice with instant feedback, simulate timed exams, or customize your own questions library."
      },
      stats: {
        quizzesCompleted: "Quizzes Completed",
        avgAccuracy: "Avg. Accuracy",
        questionsInBank: "Questions in Bank"
      },
      card: {
        selectCategory: "1. Select Category",
        chooseTopic: "Choose a topic to test",
        quizSettings: "2. Quiz Settings",
        fineTune: "Fine-tune your session"
      },
      categories: {
        all: "All Topics (Mixed)",
        web: "Web & JavaScript",
        cs: "Computer Science",
        science: "Science & Tech",
        history: "History & Geography",
        custom: "Custom Questions",
        questionsCount: "{count} questions"
      },
      settings: {
        quizMode: "Quiz Mode",
        practice: "Practice",
        exam: "Exam",
        study: "Study",
        questionCount: "Question Count",
        countMax: "Max",
        timerLimit: "Timer Limit",
        difficultyLevel: "Difficulty Level",
        shuffleQuestions: "Shuffle Question Order",
        shuffleOptions: "Shuffle Answer Options",
        startQuiz: "Start Quiz Now"
      },
      modes: {
        practiceDesc: "⚡ <strong>Practice Mode:</strong> Instant feedback after each question with rationale & streak tracking.",
        examDesc: "⏱️ <strong>Exam Mode:</strong> Realistic test environment. Submit answers at the end for an in-depth score analysis.",
        studyDesc: "📖 <strong>Study Mode:</strong> Relaxed, untimed question explorer with instant answer reveal and solutions."
      },
      timer: {
        none: "Untimed (No Rush)",
        "20s": "20 seconds per question",
        "30s": "30 seconds per question",
        "5m": "5 minutes total test",
        "10m": "10 minutes total test",
        "15m": "15 minutes total test"
      },
      difficulty: {
        all: "All",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard"
      }
    },
    quiz: {
      questionCounter: "Question {current} of {total}",
      flag: "Flag",
      flagged: "Flagged",
      flagTooltip: "Flag for review (Press F)",
      paletteTooltip: "Question Palette",
      exitTooltip: "Exit Quiz",
      loading: "Loading question...",
      explanationTitle: "Explanation",
      explanationCorrect: "Correct! Solution Rationale:",
      explanationRationale: "Explanation & Rationale:",
      noExplanation: "No explanation provided.",
      previous: "Previous",
      clearSelection: "Clear Selection",
      next: "Next Question",
      submit: "Submit Quiz",
      shortcutsHint: "Shortcuts: <strong>1-4</strong> or <strong>A-D</strong> select • <strong>← / →</strong> navigate",
      timeExpiredQuestion: "Time expired for this question!",
      timeExpiredTest: "Total test time expired! Submitting..."
    },
    results: {
      badge: {
        masterful: "🏆 Masterful!",
        great: "🌟 Great Work!",
        good: "👍 Good Effort!",
        review: "📚 Needs Review"
      },
      heading: {
        masterful: "Outstanding Performance!",
        great: "Solid Understanding!",
        good: "Good Foundation!",
        review: "Keep Practicing!"
      },
      desc: {
        masterful: "You exhibited an exceptional grasp of the material. Keep up this brilliant standard!",
        great: "You passed with good command over key concepts. Check below to review the minor areas you missed.",
        good: "A decent attempt! Spend a few moments reviewing the explanations below to turn weak spots into strengths.",
        review: "Every mistake is a learning opportunity. Go over the step-by-step rationales below and try again!"
      },
      actions: {
        retake: "Retake Quiz",
        practiceMistakes: "Practice Mistakes ({count})",
        practiceMistakesLabel: "Practice Mistakes",
        backToHub: "Back to Hub",
        export: "Export",
        exportTooltip: "Export results as JSON"
      },
      metrics: {
        correct: "Correct Answers",
        wrong: "Incorrect Answers",
        skipped: "Skipped / Unanswered",
        timeSpent: "Time Elapsed",
        avgTime: "Avg / Question",
        flagged: "Flagged for Review"
      },
      review: {
        title: "Detailed Answer Breakdown",
        all: "All ({count})",
        correct: "Correct ({count})",
        wrong: "Incorrect ({count})",
        flagged: "Flagged ({count})",
        allLabel: "All",
        correctLabel: "Correct",
        wrongLabel: "Incorrect",
        flaggedLabel: "Flagged",
        questionLabel: "Question {number}",
        empty: "No questions match this filter.",
        statusCorrect: "✓ Correct",
        statusSkipped: "○ Skipped",
        statusWrong: "✕ Incorrect",
        statusFlagged: "🚩 Flagged",
        correctAnswer: "(Correct Answer)",
        yourAnswer: "(Your Answer)",
        explanationLabel: "Explanation:"
      }
    },
    bank: {
      title: "Question Bank Management",
      subtitle: "Browse existing questions, create your own custom assessments, or import via JSON.",
      importExport: "Import / Export",
      addNewQuestion: "Add New Question",
      searchPlaceholder: "Search questions or keywords...",
      allCategories: "All Categories",
      allDifficulties: "All Difficulties",
      showingCount: "Showing {filtered} of {total} questions",
      empty: "No questions match your criteria. Add one or change filters!",
      edit: "Edit",
      delete: "Delete",
      noteLabel: "Note:"
    },
    history: {
      title: "Your Assessment History",
      subtitle: "Review past test performances, score progressions, and completed attempts.",
      clear: "Clear History",
      totalAttempts: "Total Attempts",
      bestScore: "Best Score",
      overallAccuracy: "Overall Accuracy",
      totalTime: "Total Time Invested",
      recentSessions: "Recent Sessions",
      emptyTitle: "No quiz history yet",
      empty: "Complete a practice or exam session and your results will show up here.",
      emptyCta: "Go to Quiz Hub",
      correctRatio: "{correct} / {total} correct",
      deleteEntry: "Delete this entry"
    },
    modal: {
      palette: {
        title: "Question Navigator",
        current: "Current",
        answered: "Answered",
        flagged: "Flagged",
        unanswered: "Unanswered",
        stats: "{answered} of {total} answered",
        submit: "Submit Test"
      },
      confirm: {
        title: "Finish & Submit Quiz?",
        allAnswered: "You have answered all questions. Ready to view your score breakdown?",
        unansweredWarning: "⚠️ You have <strong>{count} unanswered questions</strong> out of {total}.<br><br>Do you want to finalize your submission?",
        continue: "Continue Quiz",
        submit: "Submit Now"
      },
      editor: {
        addTitle: "Add New Question",
        editTitle: "Edit Question",
        category: "Category",
        newCategory: "+ New category...",
        newCategoryPlaceholder: "Enter a category name",
        categoryRequired: "Please enter a category name.",
        difficulty: "Difficulty",
        prompt: "Question Prompt",
        promptPlaceholder: "Enter your question statement...",
        code: "Optional Code Snippet",
        codePlaceholder: "// Code block (optional)...",
        choices: "Answer Choices (Select the radio button for the correct option)",
        correctAnswer: "Correct Answer",
        optionA: "Option A",
        optionB: "Option B",
        optionC: "Option C",
        optionD: "Option D",
        explanation: "Explanation / Solution Note",
        explanationPlaceholder: "Explain why the correct answer is right...",
        cancel: "Cancel",
        save: "Save Question"
      },
      io: {
        title: "Import / Export Question Bank",
        desc: "Backup, edit, or sync your questions in JSON format. Drag & drop a <code>.json</code> file or use the actions below.",
        openFile: "📁 Open JSON File",
        openFileTooltip: "Select a .json file from your computer",
        syncFile: "🔄 Sync questions.json",
        syncTooltip: "Sync questions from project questions.json",
        download: "💾 Download JSON",
        downloadTooltip: "Save current questions as a JSON file",
        copy: "📋 Copy JSON",
        copyTooltip: "Copy JSON data to clipboard",
        restoreDefaults: "Restore Defaults",
        restoreTooltip: "Reset bank to default questions",
        dataLabel: "JSON Data (Edit directly or drop file)",
        loadSample: "Load Sample Template",
        placeholder: "Paste questions JSON here, or drag and drop a .json file...",
        close: "Close",
        replaceAll: "Replace All Questions",
        replaceAllTooltip: "Replace entire question bank with this JSON",
        append: "Append Questions",
        appendTooltip: "Add questions from this JSON to current bank",
        statusCurrentLoaded: "Current question bank loaded. You can edit directly, drag & drop a .json file, or open a file.",
        statusPasteFirst: "Please paste or load JSON question data first.",
        statusFileLoaded: "Loaded file '{filename}' ({size} KB). Choose 'Replace' or 'Append' to apply.",
        statusSampleLoaded: "Sample template loaded. Edit the questions, then click 'Replace All Questions' or 'Append Questions'.",
        statusFileDropped: "Dropped file '{filename}' loaded. Choose 'Replace' or 'Append' to apply."
      },
      shortcuts: {
        title: "Keyboard Shortcuts",
        selectOption: "Select Option A, B, C, or D",
        next: "Next Question",
        prev: "Previous Question",
        flag: "Flag / Unflag Question",
        palette: "Open Question Navigator / Palette",
        esc: "Close active modal",
        help: "Toggle Shortcuts Help",
        gotIt: "Got it!"
      }
    },
    toasts: {
      noQuestionsFound: "No questions found matching criteria.",
      failedToStart: "Failed to start quiz: {error}",
      cannotClearPractice: "Cannot clear answer once revealed in practice mode.",
      unflagged: "Unflagged Question {number}",
      flagged: "Flagged Question {number} for review",
      errorSubmitting: "Error submitting quiz: {error}",
      errorLoadingQuestions: "Error loading questions: {error}",
      formIncomplete: "Please complete the question prompt and all 4 options.",
      questionUpdated: "Question updated in Rust backend!",
      questionSaved: "Question saved in Rust backend!",
      failedToSave: "Failed to save question: {error}",
      questionRemoved: "Question removed from Rust backend.",
      errorDeleting: "Error deleting question: {error}",
      failedToExport: "Failed to export questions: {error}",
      importSuccess: "Successfully {action} {count} questions!",
      importNoNewQuestions: "No new questions were added. All imported questions already exist in the bank.",
      actionReplaced: "replaced",
      actionAppended: "appended",
      invalidJson: "Invalid JSON schema or parsing error.",
      fileLoaded: "Loaded '{filename}'!",
      failedToReadFile: "Failed to read selected file.",
      syncedSuccess: "Synced {count} questions from questions.json!",
      syncFailed: "Sync failed: {error}",
      jsonCopied: "JSON copied to clipboard!",
      downloadInitiated: "Download initiated!",
      restoredDefaults: "Restored {count} default questions.",
      errorResetting: "Error resetting defaults: {error}",
      errorLoadingHistory: "Error loading history: {error}",
      errorClearingHistory: "Error clearing history: {error}",
      historyCleared: "History cleared.",
      historyEntryDeleted: "Entry deleted.",
      resultsExported: "Results exported to JSON!",
      importFailed: "Import failed: {error}",
    },
    dialogs: {
      confirmDeleteQuestion: "Are you sure you want to remove this question?",
      confirmClearHistory: "Clear all quiz performance history from Rust backend?",
      confirmQuitQuiz: "Are you sure you want to exit the current quiz? Your progress will be lost.",
      confirmResetDefaults: "Reset question bank to default sample set in Rust backend?",
    },
    common: {
      confirm: "Confirm",
      cancel: "Cancel",
      categoryLabels: {
        all: "All Topics",
        web: "Web & JavaScript",
        cs: "Computer Science",
        science: "Science & Tech",
        history: "History & Geography",
        custom: "Custom Bank"
      },
      difficultyLabels: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard"
      },
      modes: {
        practice: "Practice",
        exam: "Exam",
        study: "Study"
      },
      time: {
        minutesSeconds: "{mins}m {secs}s",
        minutesOnly: "{mins}m",
        secondsOnly: "{secs}s"
      }
    }
  },

  vi: {
    app: {
      title: "QuizMaster",
      brandTitle: "QuizMaster",
      brandSubtitle: "Studio Trắc Nghiệm Thông Minh",
      backendRust: "🦀 Rust",
      backendRustTooltip: "Xử lý bởi Backend Rust tốc độ cao",
      backendRustNative: "🦀 Rust Native",
      backendRustNativeTooltip: "Giao tiếp IPC trực tiếp với Rust qua Tauri 2",
      backendBrowser: "🌐 Trình duyệt",
      backendBrowserTooltip: "Đang chạy ở chế độ xem trước trên trình duyệt",
      goToHub: "Về Trang chủ"
    },
    nav: {
      hub: "Trung tâm Thi",
      bank: "Ngân hàng Câu hỏi",
      history: "Lịch sử Làm bài"
    },
    header: {
      shortcuts: "Phím tắt Bàn phím (?)",
      toggleSound: "Bật/Tắt Hiệu ứng Âm thanh",
      toggleTheme: "Chuyển Giao diện Sáng/Tối",
      language: "Chọn Ngôn ngữ"
    },
    hub: {
      hero: {
        badge: "Đánh giá & Học tập Tương tác",
        title: "Rèn Luyện Tư Duy Với Bài Trắc Nghiệm Thông Minh",
        subtitle: "Luyện tập với phản hồi tức thì, thi thử có bấm giờ hoặc tùy chỉnh ngân hàng câu hỏi của riêng bạn."
      },
      stats: {
        quizzesCompleted: "Bài thi Đã hoàn thành",
        avgAccuracy: "Độ chính xác Trung bình",
        questionsInBank: "Câu hỏi Trong ngân hàng"
      },
      card: {
        selectCategory: "1. Chọn Chủ đề",
        chooseTopic: "Chọn chủ đề bạn muốn thử sức",
        quizSettings: "2. Cài đặt Bài thi",
        fineTune: "Tùy chỉnh thông số bài làm"
      },
      categories: {
        all: "Tất cả Chủ đề (Tổng hợp)",
        web: "Lập trình Web & JS",
        cs: "Khoa học Máy tính",
        science: "Khoa học & Công nghệ",
        history: "Lịch sử & Địa lý",
        custom: "Câu hỏi Tùy chỉnh",
        questionsCount: "{count} câu hỏi"
      },
      settings: {
        quizMode: "Chế độ Thi",
        practice: "Luyện tập",
        exam: "Thi thử",
        study: "Học tập",
        questionCount: "Số lượng Câu hỏi",
        countMax: "Tất cả",
        timerLimit: "Thời gian Làm bài",
        difficultyLevel: "Mức độ Khó",
        shuffleQuestions: "Xáo trộn Thứ tự Câu hỏi",
        shuffleOptions: "Xáo trộn Các Lựa chọn",
        startQuiz: "Bắt đầu Làm bài"
      },
      modes: {
        practiceDesc: "⚡ <strong>Chế độ Luyện tập:</strong> Phản hồi kết quả ngay sau mỗi câu kèm lời giải chi tiết và theo dõi chuỗi đúng.",
        examDesc: "⏱️ <strong>Chế độ Thi thử:</strong> Môi trường thi nghiêm túc. Nộp bài khi hoàn thành để nhận báo cáo điểm số chi tiết.",
        studyDesc: "📖 <strong>Chế độ Học tập:</strong> Thong thả khám phá kiến thức, không giới hạn thời gian, hiển thị sẵn đáp án và phân tích."
      },
      timer: {
        none: "Không giới hạn (Thong thả)",
        "20s": "20 giây mỗi câu",
        "30s": "30 giây mỗi câu",
        "5m": "5 phút toàn bài",
        "10m": "10 phút toàn bài",
        "15m": "15 phút toàn bài"
      },
      difficulty: {
        all: "Tất cả",
        easy: "Dễ",
        medium: "Trung bình",
        hard: "Khó"
      }
    },
    quiz: {
      questionCounter: "Câu hỏi {current} / {total}",
      flag: "Đánh dấu",
      flagged: "Đã đánh dấu",
      flagTooltip: "Đánh dấu để xem lại (Nhấn F)",
      paletteTooltip: "Bảng điều hướng câu hỏi",
      exitTooltip: "Thoát bài thi",
      loading: "Đang tải câu hỏi...",
      explanationTitle: "Lời giải thích",
      explanationCorrect: "Chính xác! Lời giải chi tiết:",
      explanationRationale: "Giải thích & Phân tích:",
      noExplanation: "Chưa có lời giải thích cho câu hỏi này.",
      previous: "Câu trước",
      clearSelection: "Bỏ chọn",
      next: "Câu tiếp theo",
      submit: "Nộp bài thi",
      shortcutsHint: "Phím tắt: <strong>1-4</strong> hoặc <strong>A-D</strong> chọn • <strong>← / →</strong> chuyển câu",
      timeExpiredQuestion: "Đã hết thời gian cho câu hỏi này!",
      timeExpiredTest: "Đã hết tổng thời gian làm bài! Đang tự động nộp bài..."
    },
    results: {
      badge: {
        masterful: "🏆 Xuất sắc!",
        great: "🌟 Làm rất tốt!",
        good: "👍 Khá tốt!",
        review: "📚 Cần ôn tập lại"
      },
      heading: {
        masterful: "Thành tích Vượt trội!",
        great: "Nắm vững Kiến thức!",
        good: "Nền tảng Tương đối Tốt!",
        review: "Hãy Tiếp tục Rèn Luyện!"
      },
      desc: {
        masterful: "Bạn đã thể hiện sự am hiểu tuyệt vời đối với chủ đề này. Hãy duy trì phong độ đỉnh cao này nhé!",
        great: "Bạn đã vượt qua bài thi với khả năng làm chủ kiến thức tốt. Hãy xem lại các câu chưa đúng bên dưới.",
        good: "Một nỗ lực rất đáng khen! Hãy dành vài phút xem lại lời giải chi tiết bên dưới để cải thiện các điểm yếu.",
        review: "Mỗi sai sót là một cơ hội để tiến bộ. Hãy đọc kỹ phân tích từng câu bên dưới và thử sức lại nhé!"
      },
      actions: {
        retake: "Làm lại bài thi",
        practiceMistakes: "Luyện lại câu sai ({count})",
        practiceMistakesLabel: "Luyện lại câu sai",
        backToHub: "Về Trang chủ",
        export: "Xuất kết quả",
        exportTooltip: "Xuất kết quả bài làm ra tệp JSON"
      },
      metrics: {
        correct: "Câu trả lời Đúng",
        wrong: "Câu trả lời Sai",
        skipped: "Bỏ qua / Chưa làm",
        timeSpent: "Thời gian Làm bài",
        avgTime: "Trung bình / Câu",
        flagged: "Đánh dấu Xem lại"
      },
      review: {
        title: "Chi tiết Từng Câu Trả Lời",
        all: "Tất cả ({count})",
        correct: "Đúng ({count})",
        wrong: "Sai ({count})",
        flagged: "Đánh dấu ({count})",
        allLabel: "Tất cả",
        correctLabel: "Đúng",
        wrongLabel: "Sai",
        flaggedLabel: "Đánh dấu",
        questionLabel: "Câu hỏi {number}",
        empty: "Không có câu hỏi nào khớp với bộ lọc này.",
        statusCorrect: "✓ Đúng",
        statusSkipped: "○ Bỏ qua",
        statusWrong: "✕ Sai",
        statusFlagged: "🚩 Đã đánh dấu",
        correctAnswer: "(Đáp án Đúng)",
        yourAnswer: "(Lựa chọn Của Bạn)",
        explanationLabel: "Lời giải thích:"
      }
    },
    bank: {
      title: "Quản lý Ngân hàng Câu hỏi",
      subtitle: "Xem danh sách câu hỏi hiện có, tạo câu hỏi tùy chỉnh hoặc nhập ngân hàng câu hỏi qua JSON.",
      importExport: "Nhập / Xuất",
      addNewQuestion: "Thêm Câu hỏi Mới",
      searchPlaceholder: "Tìm kiếm câu hỏi hoặc từ khóa...",
      allCategories: "Tất cả Chủ đề",
      allDifficulties: "Tất cả Mức độ",
      showingCount: "Hiển thị {filtered} / {total} câu hỏi",
      empty: "Không tìm thấy câu hỏi nào phù hợp. Hãy thêm câu mới hoặc đổi bộ lọc!",
      edit: "Sửa",
      delete: "Xóa",
      noteLabel: "Ghi chú:"
    },
    history: {
      title: "Lịch sử Làm bài của Bạn",
      subtitle: "Xem lại kết quả các bài thi trước, tiến trình điểm số và các lần làm bài.",
      clear: "Xóa Lịch sử",
      totalAttempts: "Tổng số Lần thi",
      bestScore: "Điểm Cao nhất",
      overallAccuracy: "Độ chính xác Trung bình",
      totalTime: "Tổng Thời gian Học",
      recentSessions: "Các Bài thi Gần đây",
      emptyTitle: "Chưa có lịch sử làm bài",
      empty: "Hoàn thành một bài luyện tập hoặc thi thử và kết quả sẽ xuất hiện tại đây.",
      emptyCta: "Đến Quiz Hub",
      correctRatio: "{correct} / {total} đúng",
      deleteEntry: "Xóa mục này"
    },
    modal: {
      palette: {
        title: "Bảng Điều Hướng Câu Hỏi",
        current: "Đang làm",
        answered: "Đã chọn",
        flagged: "Đánh dấu",
        unanswered: "Chưa làm",
        stats: "Đã trả lời {answered} / {total} câu",
        submit: "Nộp bài thi"
      },
      confirm: {
        title: "Hoàn thành & Nộp Bài?",
        allAnswered: "Bạn đã trả lời đầy đủ các câu hỏi. Bạn đã sẵn sàng xem bảng phân tích điểm chưa?",
        unansweredWarning: "⚠️ Bạn còn <strong>{count} câu hỏi chưa trả lời</strong> trên tổng số {total}.<br><br>Bạn có chắc chắn muốn nộp bài ngay bây giờ không?",
        continue: "Tiếp tục làm bài",
        submit: "Nộp bài ngay"
      },
      editor: {
        addTitle: "Thêm Câu Hỏi Mới",
        editTitle: "Chỉnh Sửa Câu Hỏi",
        category: "Chủ đề",
        newCategory: "+ Danh mục mới...",
        newCategoryPlaceholder: "Nhập tên danh mục",
        categoryRequired: "Vui lòng nhập tên danh mục.",
        difficulty: "Mức độ khó",
        prompt: "Nội dung Câu hỏi",
        promptPlaceholder: "Nhập nội dung đề bài câu hỏi...",
        code: "Đoạn Mã Code (Tùy chọn)",
        codePlaceholder: "// Đoạn code hiển thị (nếu có)...",
        choices: "Các Lựa chọn Đáp án (Chọn nút radio tương ứng với đáp án đúng)",
        correctAnswer: "Đáp án đúng",
        optionA: "Lựa chọn A",
        optionB: "Lựa chọn B",
        optionC: "Lựa chọn C",
        optionD: "Lựa chọn D",
        explanation: "Lời Giải thích / Ghi chú",
        explanationPlaceholder: "Giải thích lý do tại sao đáp án này chính xác...",
        cancel: "Hủy bỏ",
        save: "Lưu Câu hỏi"
      },
      io: {
        title: "Nhập / Xuất Ngân Hàng Câu Hỏi",
        desc: "Sao lưu, chỉnh sửa hoặc đồng bộ câu hỏi theo định dạng JSON. Kéo thả tệp <code>.json</code> hoặc sử dụng các nút thao tác bên dưới.",
        openFile: "📁 Mở Tệp JSON",
        openFileTooltip: "Chọn tệp .json từ máy tính của bạn",
        syncFile: "🔄 Đồng bộ questions.json",
        syncTooltip: "Đồng bộ câu hỏi từ tệp questions.json trong dự án",
        download: "💾 Tải Tệp JSON",
        downloadTooltip: "Lưu các câu hỏi hiện tại về máy dưới dạng JSON",
        copy: "📋 Sao chép JSON",
        copyTooltip: "Sao chép dữ liệu JSON vào bộ nhớ đệm clipboard",
        restoreDefaults: "Khôi phục Mặc định",
        restoreTooltip: "Đặt lại ngân hàng về các câu hỏi mặc định ban đầu",
        dataLabel: "Dữ liệu JSON (Chỉnh sửa trực tiếp hoặc thả tệp)",
        loadSample: "Tải Mẫu Ví dụ",
        placeholder: "Dán mã JSON câu hỏi vào đây, hoặc kéo thả tệp .json vào ô này...",
        close: "Đóng",
        replaceAll: "Thay Thế Toàn Bộ",
        replaceAllTooltip: "Ghi đè toàn bộ ngân hàng câu hỏi bằng dữ liệu JSON này",
        append: "Thêm Vào Ngân Hàng",
        appendTooltip: "Thêm các câu hỏi từ JSON này vào ngân hàng hiện có",
        statusCurrentLoaded: "Đã tải ngân hàng câu hỏi hiện tại. Bạn có thể chỉnh sửa trực tiếp, kéo thả tệp .json hoặc mở tệp.",
        statusPasteFirst: "Vui lòng dán hoặc tải dữ liệu câu hỏi JSON trước.",
        statusFileLoaded: "Đã tải tệp '{filename}' ({size} KB). Chọn 'Thay thế' hoặc 'Thêm vào' để áp dụng.",
        statusSampleLoaded: "Đã tải mẫu ví dụ. Chỉnh sửa câu hỏi, sau đó nhấn 'Thay Thế Toàn Bộ' hoặc 'Thêm Vào Ngân Hàng'.",
        statusFileDropped: "Đã tải tệp kéo thả '{filename}'. Chọn 'Thay thế' hoặc 'Thêm vào' để áp dụng."
      },
      shortcuts: {
        title: "Phím Tắt Bàn Phím",
        selectOption: "Chọn đáp án A, B, C, hoặc D",
        next: "Chuyển sang câu tiếp theo",
        prev: "Quay lại câu trước",
        flag: "Đánh dấu / Bỏ đánh dấu câu hỏi",
        palette: "Mở bảng điều hướng câu hỏi",
        esc: "Đóng cửa sổ modal đang mở",
        help: "Bật/Tắt hướng dẫn phím tắt",
        gotIt: "Đã hiểu!"
      }
    },
    toasts: {
      noQuestionsFound: "Không tìm thấy câu hỏi nào phù hợp với điều kiện lọc.",
      failedToStart: "Không thể bắt đầu bài thi: {error}",
      cannotClearPractice: "Không thể xóa câu trả lời khi đã mở lời giải trong chế độ luyện tập.",
      unflagged: "Đã bỏ đánh dấu Câu hỏi {number}",
      flagged: "Đã đánh dấu Câu hỏi {number} để xem lại",
      errorSubmitting: "Lỗi nộp bài thi: {error}",
      errorLoadingQuestions: "Lỗi tải câu hỏi: {error}",
      formIncomplete: "Vui lòng nhập đầy đủ nội dung câu hỏi và cả 4 lựa chọn.",
      questionUpdated: "Đã cập nhật câu hỏi vào backend Rust!",
      questionSaved: "Đã lưu câu hỏi mới vào backend Rust!",
      failedToSave: "Lỗi lưu câu hỏi: {error}",
      questionRemoved: "Đã xóa câu hỏi khỏi backend Rust.",
      errorDeleting: "Lỗi khi xóa câu hỏi: {error}",
      failedToExport: "Lỗi khi xuất câu hỏi: {error}",
      importSuccess: "Đã {action} thành công {count} câu hỏi!",
      importNoNewQuestions: "Không có câu hỏi mới nào được thêm. Tất cả câu hỏi nhập vào đã có trong ngân hàng.",
      actionReplaced: "thay thế",
      actionAppended: "thêm mới",
      invalidJson: "Định dạng JSON không hợp lệ hoặc lỗi phân tích cú pháp.",
      fileLoaded: "Đã tải xong tệp '{filename}'!",
      failedToReadFile: "Không thể đọc tệp đã chọn.",
      syncedSuccess: "Đã đồng bộ {count} câu hỏi từ questions.json!",
      syncFailed: "Đồng bộ thất bại: {error}",
      jsonCopied: "Đã sao chép JSON vào bộ nhớ đệm!",
      downloadInitiated: "Đang tải xuống tệp JSON!",
      restoredDefaults: "Đã khôi phục {count} câu hỏi mặc định.",
      errorResetting: "Lỗi khi khôi phục câu hỏi mặc định: {error}",
      errorLoadingHistory: "Lỗi tải lịch sử làm bài: {error}",
      errorClearingHistory: "Lỗi xóa lịch sử làm bài: {error}",
      historyCleared: "Đã xóa toàn bộ lịch sử làm bài.",
      historyEntryDeleted: "Đã xóa mục.",
      resultsExported: "Đã xuất kết quả ra tệp JSON!",
      importFailed: "Nhập dữ liệu thất bại: {error}",
    },
    dialogs: {
      confirmDeleteQuestion: "Bạn có chắc chắn muốn xóa câu hỏi này không?",
      confirmClearHistory: "Bạn có chắc chắn muốn xóa toàn bộ lịch sử làm bài khỏi backend Rust không?",
      confirmQuitQuiz: "Bạn có chắc chắn muốn thoát bài thi hiện tại? Tiến trình làm bài sẽ không được lưu.",
      confirmResetDefaults: "Đặt lại ngân hàng câu hỏi về bộ mẫu mặc định trong backend Rust?",
    },
    common: {
      confirm: "Xác nhận",
      cancel: "Hủy",
      categoryLabels: {
        all: "Tất cả Chủ đề",
        web: "Lập trình Web & JS",
        cs: "Khoa học Máy tính",
        science: "Khoa học & Công nghệ",
        history: "Lịch sử & Địa lý",
        custom: "Ngân hàng Tùy chỉnh"
      },
      difficultyLabels: {
        easy: "Dễ",
        medium: "Trung bình",
        hard: "Khó"
      },
      modes: {
        practice: "Luyện tập",
        exam: "Thi thử",
        study: "Học tập"
      },
      time: {
        minutesSeconds: "{mins} phút {secs} giây",
        minutesOnly: "{mins} phút",
        secondsOnly: "{secs} giây"
      }
    }
  },

  es: {
    app: {
      title: "QuizMaster",
      brandTitle: "QuizMaster",
      brandSubtitle: "Studio de Cuestionarios de Opción Múltiple",
      backendRust: "🦀 Rust",
      backendRustTooltip: "Impulsado por el Backend nativo de Rust",
      backendRustNative: "🦀 Rust Native",
      backendRustNativeTooltip: "IPC directo con Rust mediante Tauri 2",
      backendBrowser: "🌐 Navegador",
      backendBrowserTooltip: "Ejecutándose en modo de vista previa del navegador",
      goToHub: "Ir al Inicio"
    },
    nav: {
      hub: "Centro de Cuestionarios",
      bank: "Banco de Preguntas",
      history: "Historial"
    },
    header: {
      shortcuts: "Atajos de Teclado (?)",
      toggleSound: "Activar/Desactivar Sonido",
      toggleTheme: "Modo Oscuro / Claro",
      language: "Seleccionar Idioma"
    },
    hub: {
      hero: {
        badge: "Evaluación y Aprendizaje Interactivo",
        title: "Agudiza tu Mente con Cuestionarios Inteligentes",
        subtitle: "Practica con retroalimentación inmediata, simula exámenes con límite de tiempo o personaliza tu biblioteca de preguntas."
      },
      stats: {
        quizzesCompleted: "Cuestionarios Completados",
        avgAccuracy: "Precisión Media",
        questionsInBank: "Preguntas en el Banco"
      },
      card: {
        selectCategory: "1. Seleccionar Categoría",
        chooseTopic: "Elige un tema a evaluar",
        quizSettings: "2. Configuración del Cuestionario",
        fineTune: "Personaliza tu sesión"
      },
      categories: {
        all: "Todos los Temas (Mixto)",
        web: "Web y JavaScript",
        cs: "Ciencias de la Computación",
        science: "Ciencia y Tecnología",
        history: "Historia y Geografía",
        custom: "Preguntas Personalizadas",
        questionsCount: "{count} preguntas"
      },
      settings: {
        quizMode: "Modo de Cuestionario",
        practice: "Práctica",
        exam: "Examen",
        study: "Estudio",
        questionCount: "Cantidad de Preguntas",
        countMax: "Máx",
        timerLimit: "Límite de Tiempo",
        difficultyLevel: "Nivel de Dificultad",
        shuffleQuestions: "Mezclar Orden de Preguntas",
        shuffleOptions: "Mezclar Opciones de Respuesta",
        startQuiz: "Comenzar Cuestionario"
      },
      modes: {
        practiceDesc: "⚡ <strong>Modo Práctica:</strong> Retroalimentación instantánea tras cada pregunta con explicación y seguimiento de rachas.",
        examDesc: "⏱️ <strong>Modo Examen:</strong> Entorno de prueba realista. Entrega las respuestas al final para un análisis exhaustivo.",
        studyDesc: "📖 <strong>Modo Estudio:</strong> Explorador de preguntas relajado y sin límite de tiempo, con respuestas y soluciones inmediatas."
      },
      timer: {
        none: "Sin límite de tiempo (Sin prisa)",
        "20s": "20 segundos por pregunta",
        "30s": "30 segundos por pregunta",
        "5m": "5 minutos en total",
        "10m": "10 minutos en total",
        "15m": "15 minutos en total"
      },
      difficulty: {
        all: "Todas",
        easy: "Fácil",
        medium: "Media",
        hard: "Difícil"
      }
    },
    quiz: {
      questionCounter: "Pregunta {current} de {total}",
      flag: "Marcar",
      flagged: "Marcada",
      flagTooltip: "Marcar para revisar (Pulsa F)",
      paletteTooltip: "Paleta de Preguntas",
      exitTooltip: "Salir del Cuestionario",
      loading: "Cargando pregunta...",
      explanationTitle: "Explicación",
      explanationCorrect: "¡Correcto! Justificación de la solución:",
      explanationRationale: "Explicación y Justificación:",
      noExplanation: "No se proporcionó ninguna explicación.",
      previous: "Anterior",
      clearSelection: "Borrar Selección",
      next: "Siguiente Pregunta",
      submit: "Entregar Cuestionario",
      shortcutsHint: "Atajos: <strong>1-4</strong> o <strong>A-D</strong> seleccionar • <strong>← / →</strong> navegar",
      timeExpiredQuestion: "¡Se agotó el tiempo para esta pregunta!",
      timeExpiredTest: "¡Se agotó el tiempo total! Entregando..."
    },
    results: {
      badge: {
        masterful: "🏆 ¡Magistral!",
        great: "🌟 ¡Excelente Trabajo!",
        good: "👍 ¡Buen Esfuerzo!",
        review: "📚 Requiere Repaso"
      },
      heading: {
        masterful: "¡Rendimiento Sobresaliente!",
        great: "¡Sólida Comprensión!",
        good: "¡Buena Base!",
        review: "¡Sigue Practicando!"
      },
      desc: {
        masterful: "Demostraste un dominio excepcional del material. ¡Mantén este estándar brillante!",
        great: "Aprobaste con buen dominio de los conceptos clave. Revisa abajo las áreas menores a mejorar.",
        good: "¡Un intento notable! Dedica unos minutos a revisar las explicaciones para reforzar los puntos débiles.",
        review: "Cada error es una oportunidad de aprendizaje. Revisa las explicaciones detalladas y prueba de nuevo."
      },
      actions: {
        retake: "Repetir Cuestionario",
        practiceMistakes: "Practicar Errores ({count})",
        practiceMistakesLabel: "Practicar Errores",
        backToHub: "Volver al Inicio",
        export: "Exportar",
        exportTooltip: "Exportar resultados en formato JSON"
      },
      metrics: {
        correct: "Respuestas Correctas",
        wrong: "Respuestas Incorrectas",
        skipped: "Omitidas / Sin Responder",
        timeSpent: "Tiempo Transcurrido",
        avgTime: "Media / Pregunta",
        flagged: "Marcadas para Revisión"
      },
      review: {
        title: "Desglose Detallado de Respuestas",
        all: "Todas ({count})",
        correct: "Correctas ({count})",
        wrong: "Incorrectas ({count})",
        flagged: "Marcadas ({count})",
        allLabel: "Todas",
        correctLabel: "Correctas",
        wrongLabel: "Incorrectas",
        flaggedLabel: "Marcadas",
        questionLabel: "Pregunta {number}",
        empty: "Ninguna pregunta coincide con este filtro.",
        statusCorrect: "✓ Correcta",
        statusSkipped: "○ Omitida",
        statusWrong: "✕ Incorrecta",
        statusFlagged: "🚩 Marcada",
        correctAnswer: "(Respuesta Correcta)",
        yourAnswer: "(Tu Respuesta)",
        explanationLabel: "Explicación:"
      }
    },
    bank: {
      title: "Gestión del Banco de Preguntas",
      subtitle: "Explora las preguntas existentes, crea tus propias evaluaciones o importa mediante JSON.",
      importExport: "Importar / Exportar",
      addNewQuestion: "Añadir Nueva Pregunta",
      searchPlaceholder: "Buscar preguntas o palabras clave...",
      allCategories: "Todas las Categorías",
      allDifficulties: "Todas las Dificultades",
      showingCount: "Mostrando {filtered} de {total} preguntas",
      empty: "Ninguna pregunta coincide con tu criterio. ¡Añade una o cambia los filtros!",
      edit: "Editar",
      delete: "Eliminar",
      noteLabel: "Nota:"
    },
    history: {
      title: "Tu Historial de Evaluaciones",
      subtitle: "Revisa el rendimiento en pruebas anteriores, progresión de puntuación e intentos completados.",
      clear: "Borrar Historial",
      totalAttempts: "Intentos Totales",
      bestScore: "Mejor Puntuación",
      overallAccuracy: "Precisión General",
      totalTime: "Tiempo Total Invertido",
      recentSessions: "Sesiones Recientes",
      emptyTitle: "Aún no hay historial",
      empty: "Completa una sesión de práctica o examen y tus resultados aparecerán aquí.",
      emptyCta: "Ir al Quiz Hub",
      correctRatio: "{correct} / {total} correctas",
      deleteEntry: "Eliminar esta entrada"
    },
    modal: {
      palette: {
        title: "Navegador de Preguntas",
        current: "Actual",
        answered: "Respondida",
        flagged: "Marcada",
        unanswered: "Sin Responder",
        stats: "{answered} de {total} respondidas",
        submit: "Entregar Prueba"
      },
      confirm: {
        title: "¿Terminar y Entregar el Cuestionario?",
        allAnswered: "Has respondido todas las preguntas. ¿Listo para ver el desglose de tu puntuación?",
        unansweredWarning: "⚠️ Tienes <strong>{count} preguntas sin responder</strong> de {total}.<br><br>¿Seguro que deseas entregar la prueba ahora?",
        continue: "Continuar Cuestionario",
        submit: "Entregar Ahora"
      },
      editor: {
        addTitle: "Añadir Nueva Pregunta",
        editTitle: "Editar Pregunta",
        category: "Categoría",
        newCategory: "+ Nueva categoría...",
        newCategoryPlaceholder: "Escribe un nombre de categoría",
        categoryRequired: "Introduce un nombre de categoría.",
        difficulty: "Dificultad",
        prompt: "Enunciado de la Pregunta",
        promptPlaceholder: "Escribe el enunciado de la pregunta...",
        code: "Fragmento de Código Opcional",
        codePlaceholder: "// Bloque de código (opcional)...",
        choices: "Opciones de Respuesta (Selecciona el botón de radio para la opción correcta)",
        correctAnswer: "Respuesta correcta",
        optionA: "Opción A",
        optionB: "Opción B",
        optionC: "Opción C",
        optionD: "Opción D",
        explanation: "Explicación / Nota de Solución",
        explanationPlaceholder: "Explica por qué la respuesta correcta es la indicada...",
        cancel: "Cancelar",
        save: "Guardar Pregunta"
      },
      io: {
        title: "Importar / Exportar Banco de Preguntas",
        desc: "Respalda, edita o sincroniza tus preguntas en formato JSON. Arrastra un archivo <code>.json</code> o usa las acciones siguientes.",
        openFile: "📁 Abrir Archivo JSON",
        openFileTooltip: "Selecciona un archivo .json de tu ordenador",
        syncFile: "🔄 Sincronizar questions.json",
        syncTooltip: "Sincroniza las preguntas desde questions.json del proyecto",
        download: "💾 Descargar JSON",
        downloadTooltip: "Guarda las preguntas actuales como archivo JSON",
        copy: "📋 Copiar JSON",
        copyTooltip: "Copia los datos JSON al portapapeles",
        restoreDefaults: "Restablecer Valores Predeterminados",
        restoreTooltip: "Restablece el banco a las preguntas originales",
        dataLabel: "Datos JSON (Edita directamente o suelta un archivo)",
        loadSample: "Cargar Plantilla de Ejemplo",
        placeholder: "Pega el JSON de preguntas aquí o arrastra un archivo .json...",
        close: "Cerrar",
        replaceAll: "Reemplazar Todas las Preguntas",
        replaceAllTooltip: "Reemplaza el banco completo con este JSON",
        append: "Añadir Preguntas",
        appendTooltip: "Añade las preguntas de este JSON al banco actual",
        statusCurrentLoaded: "Banco de preguntas actual cargado. Puedes editar directamente, arrastrar y soltar un archivo .json o abrir un archivo.",
        statusPasteFirst: "Primero pega o carga los datos JSON de las preguntas.",
        statusFileLoaded: "Archivo '{filename}' cargado ({size} KB). Elige 'Reemplazar' o 'Añadir' para aplicar.",
        statusSampleLoaded: "Plantilla de ejemplo cargada. Edita las preguntas y luego haz clic en 'Reemplazar Todas las Preguntas' o 'Añadir Preguntas'.",
        statusFileDropped: "Archivo arrastrado '{filename}' cargado. Elige 'Reemplazar' o 'Añadir' para aplicar."
      },
      shortcuts: {
        title: "Atajos de Teclado",
        selectOption: "Seleccionar Opción A, B, C o D",
        next: "Siguiente Pregunta",
        prev: "Pregunta Anterior",
        flag: "Marcar / Desmarcar Pregunta",
        palette: "Abrir Navegador / Paleta de Preguntas",
        esc: "Cerrar modal activo",
        help: "Mostrar/Ocultar Ayuda de Atajos",
        gotIt: "¡Entendido!"
      }
    },
    toasts: {
      noQuestionsFound: "No se encontraron preguntas que coincidan con el criterio.",
      failedToStart: "Error al iniciar el cuestionario: {error}",
      cannotClearPractice: "No se puede borrar la respuesta una vez revelada en el modo práctica.",
      unflagged: "Pregunta {number} desmarcada",
      flagged: "Pregunta {number} marcada para revisión",
      errorSubmitting: "Error al entregar el cuestionario: {error}",
      errorLoadingQuestions: "Error al cargar las preguntas: {error}",
      formIncomplete: "Por favor, completa el enunciado y las 4 opciones.",
      questionUpdated: "¡Pregunta actualizada en el backend de Rust!",
      questionSaved: "¡Pregunta guardada en el backend de Rust!",
      failedToSave: "Error al guardar la pregunta: {error}",
      questionRemoved: "Pregunta eliminada del backend de Rust.",
      errorDeleting: "Error al eliminar la pregunta: {error}",
      failedToExport: "Error al exportar preguntas: {error}",
      importSuccess: "¡Se {action} {count} preguntas con éxito!",
      importNoNewQuestions: "No se añadieron preguntas nuevas. Todas las preguntas importadas ya existen en el banco.",
      actionReplaced: "reemplazaron",
      actionAppended: "añadieron",
      invalidJson: "Esquema JSON no válido o error de sintaxis.",
      fileLoaded: "¡Archivo '{filename}' cargado!",
      failedToReadFile: "Error al leer el archivo seleccionado.",
      syncedSuccess: "¡Se sincronizaron {count} preguntas desde questions.json!",
      syncFailed: "Fallo en la sincronización: {error}",
      jsonCopied: "¡JSON copiado al portapapeles!",
      downloadInitiated: "¡Descarga iniciada!",
      restoredDefaults: "Se restauraron {count} preguntas predeterminadas.",
      errorResetting: "Error al restaurar valores predeterminados: {error}",
      errorLoadingHistory: "Error al cargar el historial: {error}",
      errorClearingHistory: "Error al borrar el historial: {error}",
      historyCleared: "Historial borrado.",
      historyEntryDeleted: "Entrada eliminada.",
      resultsExported: "¡Resultados exportados a JSON!",
      importFailed: "Error al importar: {error}",
    },
    dialogs: {
      confirmDeleteQuestion: "¿Estás seguro de que deseas eliminar esta pregunta?",
      confirmClearHistory: "¿Borrar todo el historial de rendimiento del backend de Rust?",
      confirmQuitQuiz: "¿Estás seguro de que deseas salir del cuestionario actual? Se perderá el progreso.",
      confirmResetDefaults: "¿Restablecer el banco de preguntas al conjunto de muestra predeterminado en el backend de Rust?",
    },
    common: {
      confirm: "Confirmar",
      cancel: "Cancelar",
      categoryLabels: {
        all: "Todos los Temas",
        web: "Web y JavaScript",
        cs: "Ciencias de la Computación",
        science: "Ciencia y Tecnología",
        history: "Historia y Geografía",
        custom: "Banco Personalizado"
      },
      difficultyLabels: {
        easy: "Fácil",
        medium: "Media",
        hard: "Difícil"
      },
      modes: {
        practice: "Práctica",
        exam: "Examen",
        study: "Estudio"
      },
      time: {
        minutesSeconds: "{mins}m {secs}s",
        minutesOnly: "{mins}m",
        secondsOnly: "{secs}s"
      }
    }
  },

  fr: {
    app: {
      title: "QuizMaster",
      brandTitle: "QuizMaster",
      brandSubtitle: "Studio de Quiz à Choix Multiples",
      backendRust: "🦀 Rust",
      backendRustTooltip: "Alimenté par un Backend natif Rust",
      backendRustNative: "🦀 Rust Native",
      backendRustNativeTooltip: "IPC Rust direct via Tauri 2",
      backendBrowser: "🌐 Navigateur",
      backendBrowserTooltip: "Exécution en mode aperçu dans le navigateur",
      goToHub: "Retour à l'Accueil"
    },
    nav: {
      hub: "Accueil Quiz",
      bank: "Banque de Questions",
      history: "Historique"
    },
    header: {
      shortcuts: "Raccourcis Clavier (?)",
      toggleSound: "Effets Sonores Activer/Désactiver",
      toggleTheme: "Basculer Thème Clair/Sombre",
      language: "Choisir la Langue"
    },
    hub: {
      hero: {
        badge: "Évaluation & Apprentissage Interactif",
        title: "Stimulez Votre Esprit avec des Quiz Intelligents",
        subtitle: "Entraînez-vous avec des retours instantanés, simulez des examens chronométrés ou personnalisez votre propre banque de questions."
      },
      stats: {
        quizzesCompleted: "Quiz Complétés",
        avgAccuracy: "Précision Moyenne",
        questionsInBank: "Questions en Banque"
      },
      card: {
        selectCategory: "1. Sélectionner la Catégorie",
        chooseTopic: "Choisissez un thème à tester",
        quizSettings: "2. Paramètres du Quiz",
        fineTune: "Ajustez votre session"
      },
      categories: {
        all: "Tous les Sujets (Mixte)",
        web: "Web & JavaScript",
        cs: "Informatique",
        science: "Sciences & Technologies",
        history: "Histoire & Géographie",
        custom: "Questions Personnalisées",
        questionsCount: "{count} questions"
      },
      settings: {
        quizMode: "Mode de Quiz",
        practice: "Pratique",
        exam: "Examen",
        study: "Étude",
        questionCount: "Nombre de Questions",
        countMax: "Max",
        timerLimit: "Limite de Temps",
        difficultyLevel: "Niveau de Difficulté",
        shuffleQuestions: "Mélanger l'Ordre des Questions",
        shuffleOptions: "Mélanger les Choix de Réponses",
        startQuiz: "Démarrer le Quiz"
      },
      modes: {
        practiceDesc: "⚡ <strong>Mode Pratique :</strong> Retour immédiat après chaque question avec explications et suivi des séries de réussite.",
        examDesc: "⏱️ <strong>Mode Examen :</strong> Conditions d'examen réalistes. Soumettez les réponses à la fin pour une analyse approfondie.",
        studyDesc: "📖 <strong>Mode Étude :</strong> Exploration détendue sans chronomètre, avec réponses et explications immédiates."
      },
      timer: {
        none: "Sans limite de temps (Sans stress)",
        "20s": "20 secondes par question",
        "30s": "30 secondes par question",
        "5m": "5 minutes au total",
        "10m": "10 minutes au total",
        "15m": "15 minutes au total"
      },
      difficulty: {
        all: "Tous",
        easy: "Facile",
        medium: "Moyen",
        hard: "Difficile"
      }
    },
    quiz: {
      questionCounter: "Question {current} sur {total}",
      flag: "Marquer",
      flagged: "Marqué",
      flagTooltip: "Marquer pour revoir (Touche F)",
      paletteTooltip: "Palette de Questions",
      exitTooltip: "Quitter le Quiz",
      loading: "Chargement de la question...",
      explanationTitle: "Explication",
      explanationCorrect: "Correct ! Explication de la solution :",
      explanationRationale: "Explication & Justification :",
      noExplanation: "Aucune explication fournie.",
      previous: "Précédent",
      clearSelection: "Effacer la Sélection",
      next: "Question Suivante",
      submit: "Soumettre le Quiz",
      shortcutsHint: "Raccourcis : <strong>1-4</strong> ou <strong>A-D</strong> sélectionner • <strong>← / →</strong> naviguer",
      timeExpiredQuestion: "Temps écoulé pour cette question !",
      timeExpiredTest: "Temps total d'examen écoulé ! Soumission en cours..."
    },
    results: {
      badge: {
        masterful: "🏆 Magistral !",
        great: "🌟 Excellent Travail !",
        good: "👍 Bon Effort !",
        review: "📚 À Revoir"
      },
      heading: {
        masterful: "Performance Remarquable !",
        great: "Solide Compréhension !",
        good: "Bonne Base !",
        review: "Continuez à Vous Entraîner !"
      },
      desc: {
        masterful: "Vous avez fait preuve d'une excellente maîtrise du sujet. Félicitations pour ce score brillant !",
        great: "Vous avez réussi avec une bonne maîtrise des concepts clés. Consultez ci-dessous les détails pour vous perfectionner.",
        good: "Une belle tentative ! Prenez quelques instants pour lire les explications ci-dessous et renforcer vos acquis.",
        review: "Chaque erreur est une opportunité d'apprentissage. Consultez les solutions détaillées et réessayez !"
      },
      actions: {
        retake: "Refaire le Quiz",
        practiceMistakes: "S'entraîner sur les Erreurs ({count})",
        practiceMistakesLabel: "S'entraîner sur les Erreurs",
        backToHub: "Retour à l'Accueil",
        export: "Exporter",
        exportTooltip: "Exporter les résultats au format JSON"
      },
      metrics: {
        correct: "Réponses Correctes",
        wrong: "Réponses Incorrectes",
        skipped: "Ignorées / Non Répondues",
        timeSpent: "Temps Écoulé",
        avgTime: "Moyenne / Question",
        flagged: "Marquées pour Relecture"
      },
      review: {
        title: "Détail des Réponses",
        all: "Toutes ({count})",
        correct: "Correctes ({count})",
        wrong: "Incorrectes ({count})",
        flagged: "Marquées ({count})",
        allLabel: "Toutes",
        correctLabel: "Correctes",
        wrongLabel: "Incorrectes",
        flaggedLabel: "Marquées",
        questionLabel: "Question {number}",
        empty: "Aucune question ne correspond à ce filtre.",
        statusCorrect: "✓ Correct",
        statusSkipped: "○ Ignorée",
        statusWrong: "✕ Incorrect",
        statusFlagged: "🚩 Marqué",
        correctAnswer: "(Bonne Réponse)",
        yourAnswer: "(Votre Réponse)",
        explanationLabel: "Explication :"
      }
    },
    bank: {
      title: "Gestion de la Banque de Questions",
      subtitle: "Explorez les questions existantes, créez vos propres tests ou importez via JSON.",
      importExport: "Importer / Exporter",
      addNewQuestion: "Ajouter une Question",
      searchPlaceholder: "Rechercher des questions ou mots-clés...",
      allCategories: "Toutes les Catégories",
      allDifficulties: "Toutes les Difficultés",
      showingCount: "Affichage de {filtered} sur {total} questions",
      empty: "Aucune question ne correspond à vos critères. Ajoutez-en une ou modifiez les filtres !",
      edit: "Modifier",
      delete: "Supprimer",
      noteLabel: "Note :"
    },
    history: {
      title: "Votre Historique de Tests",
      subtitle: "Consultez les résultats des sessions passées, l'évolution des scores et les tentatives réalisées.",
      clear: "Effacer l'Historique",
      totalAttempts: "Tentatives Totales",
      bestScore: "Meilleur Score",
      overallAccuracy: "Précision Globale",
      totalTime: "Temps Total Consacré",
      recentSessions: "Sessions Récentes",
      emptyTitle: "Aucun historique pour le moment",
      empty: "Terminez une session d'entraînement ou d'examen et vos résultats apparaîtront ici.",
      emptyCta: "Aller au Quiz Hub",
      correctRatio: "{correct} / {total} correctes",
      deleteEntry: "Supprimer cette entrée"
    },
    modal: {
      palette: {
        title: "Navigateur de Questions",
        current: "Actuelle",
        answered: "Répondue",
        flagged: "Marquée",
        unanswered: "Sans Réponse",
        stats: "{answered} sur {total} répondues",
        submit: "Soumettre le Test"
      },
      confirm: {
        title: "Terminer et Soumettre le Quiz ?",
        allAnswered: "Vous avez répondu à toutes les questions. Prêt à découvrir l'analyse de votre score ?",
        unansweredWarning: "⚠️ Vous avez <strong>{count} questions sans réponse</strong> sur {total}.<br><br>Voulez-vous vraiment finaliser votre soumission ?",
        continue: "Poursuivre le Quiz",
        submit: "Soumettre Maintenant"
      },
      editor: {
        addTitle: "Ajouter une Nouvelle Question",
        editTitle: "Modifier la Question",
        category: "Catégorie",
        newCategory: "+ Nouvelle catégorie...",
        newCategoryPlaceholder: "Saisissez un nom de catégorie",
        categoryRequired: "Veuillez saisir un nom de catégorie.",
        difficulty: "Difficulté",
        prompt: "Énoncé de la Question",
        promptPlaceholder: "Saisissez l'énoncé de votre question...",
        code: "Extrait de Code Optionnel",
        codePlaceholder: "// Bloc de code (optionnel)...",
        choices: "Choix de Réponses (Sélectionnez le bouton radio pour la bonne option)",
        correctAnswer: "Bonne réponse",
        optionA: "Option A",
        optionB: "Option B",
        optionC: "Option C",
        optionD: "Option D",
        explanation: "Explication / Note de Résolution",
        explanationPlaceholder: "Expliquez pourquoi la bonne réponse est correcte...",
        cancel: "Annuler",
        save: "Enregistrer la Question"
      },
      io: {
        title: "Importer / Exporter la Banque de Questions",
        desc: "Sauvegardez, modifiez ou synchronisez vos questions au format JSON. Glissez-déposez un fichier <code>.json</code> ou utilisez les boutons ci-dessous.",
        openFile: "📁 Ouvrir Fichier JSON",
        openFileTooltip: "Sélectionnez un fichier .json depuis votre ordinateur",
        syncFile: "🔄 Synchroniser questions.json",
        syncTooltip: "Synchronise les questions depuis questions.json du projet",
        download: "💾 Télécharger JSON",
        downloadTooltip: "Enregistrer les questions actuelles au format JSON",
        copy: "📋 Copier JSON",
        copyTooltip: "Copier les données JSON dans le presse-papiers",
        restoreDefaults: "Restaurer les Défauts",
        restoreTooltip: "Réinitialise la banque avec les questions par défaut",
        dataLabel: "Données JSON (Modifier directement ou déposer un fichier)",
        loadSample: "Charger un Modèle Exemple",
        placeholder: "Collez le JSON des questions ici, ou glissez-déposez un fichier .json...",
        close: "Fermer",
        replaceAll: "Remplacer Toutes les Questions",
        replaceAllTooltip: "Remplace l'ensemble de la banque avec ce JSON",
        append: "Ajouter les Questions",
        appendTooltip: "Ajoute les questions de ce JSON à la banque actuelle",
        statusCurrentLoaded: "Banque de questions actuelle chargée. Vous pouvez modifier directement, glisser-déposer un fichier .json ou ouvrir un fichier.",
        statusPasteFirst: "Veuillez d'abord coller ou charger les données JSON des questions.",
        statusFileLoaded: "Fichier '{filename}' chargé ({size} Ko). Choisissez 'Remplacer' ou 'Ajouter' pour appliquer.",
        statusSampleLoaded: "Modèle d'exemple chargé. Modifiez les questions, puis cliquez sur 'Remplacer Toutes les Questions' ou 'Ajouter les Questions'.",
        statusFileDropped: "Fichier déposé '{filename}' chargé. Choisissez 'Remplacer' ou 'Ajouter' pour appliquer."
      },
      shortcuts: {
        title: "Raccourcis Clavier",
        selectOption: "Sélectionner Option A, B, C ou D",
        next: "Question Suivante",
        prev: "Question Précédente",
        flag: "Marquer / Démarquer la Question",
        palette: "Ouvrir le Navigateur de Questions",
        esc: "Fermer la fenêtre modale active",
        help: "Afficher/Masquer l'Aide des Raccourcis",
        gotIt: "Compris !"
      }
    },
    toasts: {
      noQuestionsFound: "Aucune question ne correspond aux critères sélectionnés.",
      failedToStart: "Échec du démarrage du quiz : {error}",
      cannotClearPractice: "Impossible d'annuler la réponse une fois révélée en mode pratique.",
      unflagged: "Question {number} démarquée",
      flagged: "Question {number} marquée pour révision",
      errorSubmitting: "Erreur lors de la soumission du quiz : {error}",
      errorLoadingQuestions: "Erreur lors du chargement des questions : {error}",
      formIncomplete: "Veuillez renseigner l'énoncé et les 4 options.",
      questionUpdated: "Question mise à jour dans le backend Rust !",
      questionSaved: "Question enregistrée dans le backend Rust !",
      failedToSave: "Échec de l'enregistrement de la question : {error}",
      questionRemoved: "Question supprimée du backend Rust.",
      errorDeleting: "Erreur lors de la suppression de la question : {error}",
      failedToExport: "Échec de l'exportation des questions : {error}",
      importSuccess: "{count} questions ont été {action} avec succès !",
      importNoNewQuestions: "Aucune nouvelle question n'a été ajoutée. Toutes les questions importées existent déjà dans la banque.",
      actionReplaced: "remplacées",
      actionAppended: "ajoutées",
      invalidJson: "Schéma JSON invalide ou erreur d'analyse syntaxique.",
      fileLoaded: "Fichier '{filename}' chargé !",
      failedToReadFile: "Impossible de lire le fichier sélectionné.",
      syncedSuccess: "{count} questions synchronisées depuis questions.json !",
      syncFailed: "Échec de synchronisation : {error}",
      jsonCopied: "JSON copié dans le presse-papiers !",
      downloadInitiated: "Téléchargement lancé !",
      restoredDefaults: "{count} questions par défaut restaurées.",
      errorResetting: "Erreur lors de la réinitialisation par défaut : {error}",
      errorLoadingHistory: "Erreur de chargement de l'historique : {error}",
      errorClearingHistory: "Erreur lors de l'effacement de l'historique : {error}",
      historyCleared: "Historique effacé.",
      historyEntryDeleted: "Entrée supprimée.",
      resultsExported: "Résultats exportés au format JSON !",
      importFailed: "Échec de l'importation : {error}",
    },
    dialogs: {
      confirmDeleteQuestion: "Voulez-vous vraiment supprimer cette question ?",
      confirmClearHistory: "Effacer tout l'historique des tests du backend Rust ?",
      confirmQuitQuiz: "Voulez-vous vraiment quitter le quiz en cours ? Votre progression sera perdue.",
      confirmResetDefaults: "Réinitialiser la banque de questions au jeu d'exemples par défaut dans le backend Rust ?",
    },
    common: {
      confirm: "Confirmer",
      cancel: "Annuler",
      categoryLabels: {
        all: "Tous les Sujets",
        web: "Web & JavaScript",
        cs: "Informatique",
        science: "Sciences & Technologies",
        history: "Histoire & Géographie",
        custom: "Banque Personnalisée"
      },
      difficultyLabels: {
        easy: "Facile",
        medium: "Moyen",
        hard: "Difficile"
      },
      modes: {
        practice: "Pratique",
        exam: "Examen",
        study: "Étude"
      },
      time: {
        minutesSeconds: "{mins}m {secs}s",
        minutesOnly: "{mins}m",
        secondsOnly: "{secs}s"
      }
    }
  },

  ja: {
    app: {
      title: "QuizMaster",
      brandTitle: "QuizMaster",
      brandSubtitle: "選択式クイズスタジオ",
      backendRust: "🦀 Rust",
      backendRustTooltip: "高速なネイティブRustバックエンドで駆動",
      backendRustNative: "🦀 Rust Native",
      backendRustNativeTooltip: "Tauri 2経由のRust直接IPC",
      backendBrowser: "🌐 ブラウザ",
      backendBrowserTooltip: "ブラウザプレビューモードで実行中",
      goToHub: "ホームに戻る"
    },
    nav: {
      hub: "クイズハブ",
      bank: "問題バンク",
      history: "履歴"
    },
    header: {
      shortcuts: "キーボードショートカット (?)",
      toggleSound: "効果音のオン/オフ",
      toggleTheme: "ダーク/ライトテーマ切替",
      language: "言語選択"
    },
    hub: {
      hero: {
        badge: "インタラクティブ学習＆自己評価",
        title: "スマートクイズで思考力を磨こう",
        subtitle: "即時解説付きの練習、制限時間付き模擬試験、または独自の問題ライブラリを自由にカスタマイズ。"
      },
      stats: {
        quizzesCompleted: "完了したテスト",
        avgAccuracy: "平均正解率",
        questionsInBank: "登録問題数"
      },
      card: {
        selectCategory: "1. カテゴリを選択",
        chooseTopic: "挑戦したい分野を選んでください",
        quizSettings: "2. テスト設定",
        fineTune: "セッションのカスタマイズ"
      },
      categories: {
        all: "すべての分野（総合）",
        web: "Web & JavaScript",
        cs: "コンピュータサイエンス",
        science: "科学・テクノロジー",
        history: "歴史・地理",
        custom: "カスタム問題",
        questionsCount: "{count}問"
      },
      settings: {
        quizMode: "クイズモード",
        practice: "練習",
        exam: "模擬試験",
        study: "学習",
        questionCount: "問題数",
        countMax: "すべて",
        timerLimit: "制限時間",
        difficultyLevel: "難易度",
        shuffleQuestions: "問題順をシャッフル",
        shuffleOptions: "選択肢をシャッフル",
        startQuiz: "テストを開始する"
      },
      modes: {
        practiceDesc: "⚡ <strong>練習モード:</strong> 各問題解答後に即座に解説を表示し、連続正解数をカウントします。",
        examDesc: "⏱️ <strong>模擬試験モード:</strong> 本番同様の環境。全問終了後に詳細なスコア分析レポートを表示します。",
        studyDesc: "📖 <strong>学習モード:</strong> 時間無制限でじっくり学ぶモード。解答と解説をその場で確認できます。"
      },
      timer: {
        none: "時間無制限（じっくり）",
        "20s": "1問あたり20秒",
        "30s": "1問あたり30秒",
        "5m": "合計5分",
        "10m": "合計10分",
        "15m": "合計15分"
      },
      difficulty: {
        all: "すべて",
        easy: "初級",
        medium: "中級",
        hard: "上級"
      }
    },
    quiz: {
      questionCounter: "問題 {current} / {total}",
      flag: "マーク",
      flagged: "マーク済み",
      flagTooltip: "後で見直す（Fキー）",
      paletteTooltip: "問題一覧ナビ",
      exitTooltip: "テストを終了",
      loading: "問題を読み込み中...",
      explanationTitle: "解説",
      explanationCorrect: "正解です！解説・理由：",
      explanationRationale: "解説と考察：",
      noExplanation: "この問題の解説はありません。",
      previous: "前の問題",
      clearSelection: "選択解除",
      next: "次の問題",
      submit: "テストを提出",
      shortcutsHint: "ショートカット: <strong>1-4</strong> / <strong>A-D</strong> 選択 • <strong>← / →</strong> 移動",
      timeExpiredQuestion: "この問題の制限時間が終了しました！",
      timeExpiredTest: "テスト全体の制限時間が終了しました！提出中..."
    },
    results: {
      badge: {
        masterful: "🏆 完璧な成果！",
        great: "🌟 素晴らしい！",
        good: "👍 良好な結果！",
        review: "📚 要復習"
      },
      heading: {
        masterful: "傑出したパフォーマンス！",
        great: "しっかり理解できています！",
        good: "確かな基礎が身についています！",
        review: "この調子で練習を続けよう！"
      },
      desc: {
        masterful: "学習内容を完璧に把握しています。この素晴らしいレベルを維持しましょう！",
        great: "主要な概念をしっかり押さえて合格しました。間違えた箇所の解説を確認してみましょう。",
        good: "良い挑戦でした！下の詳細解説を確認して、苦手分野を得意分野に変えましょう。",
        review: "間違いはすべて成長のチャンスです。ステップごとの解説を確認して再挑戦してみましょう！"
      },
      actions: {
        retake: "もう一度受ける",
        practiceMistakes: "間違えた問題を再挑戦 ({count})",
        practiceMistakesLabel: "間違いを復習",
        backToHub: "ハブに戻る",
        export: "結果を出力",
        exportTooltip: "結果をJSON形式でエクスポート"
      },
      metrics: {
        correct: "正解数",
        wrong: "不正解数",
        skipped: "スキップ / 未解答",
        timeSpent: "所要時間",
        avgTime: "1問あたり平均",
        flagged: "見直しマーク数"
      },
      review: {
        title: "問題ごとの詳細結果",
        all: "すべて ({count})",
        correct: "正解 ({count})",
        wrong: "不正解 ({count})",
        flagged: "マーク済み ({count})",
        allLabel: "すべて",
        correctLabel: "正解",
        wrongLabel: "不正解",
        flaggedLabel: "マーク",
        questionLabel: "問題 {number}",
        empty: "条件に一致する問題はありません。",
        statusCorrect: "✓ 正解",
        statusSkipped: "○ スキップ",
        statusWrong: "✕ 不正解",
        statusFlagged: "🚩 マーク済み",
        correctAnswer: "(正解の選択肢)",
        yourAnswer: "(あなたの解答)",
        explanationLabel: "解説："
      }
    },
    bank: {
      title: "問題バンク管理",
      subtitle: "既存の問題の閲覧、カスタム問題の作成、JSONインポートが可能です。",
      importExport: "インポート / エクスポート",
      addNewQuestion: "新しい問題を追加",
      searchPlaceholder: "問題文やキーワードを検索...",
      allCategories: "すべてのカテゴリ",
      allDifficulties: "すべての難易度",
      showingCount: "{total}問中 {filtered}問を表示",
      empty: "該当する問題が見つかりません。問題を追加するか検索条件を変更してください。",
      edit: "編集",
      delete: "削除",
      noteLabel: "補足："
    },
    history: {
      title: "テスト受験履歴",
      subtitle: "過去のテスト結果、スコア推移、完了したセッションを確認できます。",
      clear: "履歴を消去",
      totalAttempts: "総受験回数",
      bestScore: "最高スコア",
      overallAccuracy: "総合正解率",
      totalTime: "総学習時間",
      recentSessions: "最近のセッション",
      emptyTitle: "履歴はまだありません",
      empty: "練習または試験セッションを完了すると、ここに結果が表示されます。",
      emptyCta: "Quiz Hubへ",
      correctRatio: "{total}問中 {correct}問正解",
      deleteEntry: "このエントリを削除"
    },
    modal: {
      palette: {
        title: "問題ナビゲーター",
        current: "現在",
        answered: "解答済み",
        flagged: "マーク済み",
        unanswered: "未解答",
        stats: "{total}問中 {answered}問解答済み",
        submit: "テストを提出"
      },
      confirm: {
        title: "テストを終了して提出しますか？",
        allAnswered: "すべての問題に解答しました。スコア分析を確認しますか？",
        unansweredWarning: "⚠️ {total}問中 <strong>{count}問の未解答問題</strong>があります。<br><br>本当に今すぐ提出しますか？",
        continue: "テストを続ける",
        submit: "今すぐ提出"
      },
      editor: {
        addTitle: "問題の新規作成",
        editTitle: "問題の編集",
        category: "カテゴリ",
        newCategory: "+ 新しいカテゴリ...",
        newCategoryPlaceholder: "カテゴリ名を入力",
        categoryRequired: "カテゴリ名を入力してください。",
        difficulty: "難易度",
        prompt: "問題文",
        promptPlaceholder: "問題文を入力してください...",
        code: "コードスニペット（任意）",
        codePlaceholder: "// コードブロック（任意）...",
        choices: "解答の選択肢（正解の選択肢のラジオボタンを選んでください）",
        correctAnswer: "正解",
        optionA: "選択肢 A",
        optionB: "選択肢 B",
        optionC: "選択肢 C",
        optionD: "選択肢 D",
        explanation: "解説・解答理由",
        explanationPlaceholder: "なぜこの選択肢が正解なのかを説明...",
        cancel: "キャンセル",
        save: "問題を保存"
      },
      io: {
        title: "問題バンクのインポート / エクスポート",
        desc: "JSON形式で問題のバックアップ、編集、同期ができます。<code>.json</code>ファイルをドラッグ＆ドロップするか、下のボタンをご利用ください。",
        openFile: "📁 JSONファイルを開く",
        openFileTooltip: "お使いのPCから.jsonファイルを選択",
        syncFile: "🔄 questions.jsonと同期",
        syncTooltip: "プロジェクトのquestions.jsonから同期",
        download: "💾 JSONをダウンロード",
        downloadTooltip: "現在の問題をJSONファイルとして保存",
        copy: "📋 JSONをコピー",
        copyTooltip: "JSONデータをクリップボードにコピー",
        restoreDefaults: "初期状態に戻す",
        restoreTooltip: "問題を初期のデフォルト問題にリセット",
        dataLabel: "JSONデータ（直接編集またはファイルドロップ）",
        loadSample: "サンプルテンプレート読込",
        placeholder: "ここにJSONを貼り付けるか、.jsonファイルをドロップしてください...",
        close: "閉じる",
        replaceAll: "すべての問題を置換",
        replaceAllTooltip: "問題バンク全体をこのJSONで上書き",
        append: "問題を追加（マージ）",
        appendTooltip: "このJSONの問題を現在のバンクに追加",
        statusCurrentLoaded: "現在の問題バンクを読み込みました。直接編集するか、.jsonファイルをドラッグ＆ドロップするか、ファイルを開いてください。",
        statusPasteFirst: "先にJSONの問題データを貼り付けるか読み込んでください。",
        statusFileLoaded: "ファイル '{filename}'（{size} KB）を読み込みました。「置換」または「追加」を選んで適用してください。",
        statusSampleLoaded: "サンプルテンプレートを読み込みました。問題を編集してから「すべての問題を置換」または「問題を追加」をクリックしてください。",
        statusFileDropped: "ドロップされたファイル '{filename}' を読み込みました。「置換」または「追加」を選んで適用してください。"
      },
      shortcuts: {
        title: "キーボードショートカット",
        selectOption: "選択肢 A, B, C, または D を選択",
        next: "次の問題へ移動",
        prev: "前の問題へ戻る",
        flag: "見直しマークのオン/オフ",
        palette: "問題一覧ナビを開く",
        esc: "開いているモーダルを閉じる",
        help: "ショートカット一覧の表示/非表示",
        gotIt: "了解！"
      }
    },
    toasts: {
      noQuestionsFound: "条件に一致する問題が見つかりませんでした。",
      failedToStart: "テストを開始できませんでした: {error}",
      cannotClearPractice: "練習モードで解説表示後は解答を取り消せません。",
      unflagged: "問題 {number} のマークを解除しました",
      flagged: "問題 {number} を見直し用にマークしました",
      errorSubmitting: "テスト提出エラー: {error}",
      errorLoadingQuestions: "問題読み込みエラー: {error}",
      formIncomplete: "問題文と4つの選択肢すべてを入力してください。",
      questionUpdated: "Rustバックエンドの問題を更新しました！",
      questionSaved: "Rustバックエンドに問題を保存しました！",
      failedToSave: "問題の保存に失敗しました: {error}",
      questionRemoved: "Rustバックエンドから問題を削除しました。",
      errorDeleting: "問題の削除中にエラーが発生しました: {error}",
      failedToExport: "問題のエクスポートに失敗しました: {error}",
      importSuccess: "{count}問の問題を正常に{action}しました！",
      importNoNewQuestions: "新しい問題は追加されませんでした。インポートした問題はすべて既にバンクに存在します。",
      actionReplaced: "置換",
      actionAppended: "追加",
      invalidJson: "無効なJSONスキーマまたは構文エラーです。",
      fileLoaded: "'{filename}' を読み込みました！",
      failedToReadFile: "選択されたファイルを読み込めませんでした。",
      syncedSuccess: "questions.jsonから {count}問を同期しました！",
      syncFailed: "同期に失敗しました: {error}",
      jsonCopied: "JSONをクリップボードにコピーしました！",
      downloadInitiated: "ダウンロードを開始しました！",
      restoredDefaults: "デフォルトの {count}問を復元しました。",
      errorResetting: "初期化エラー: {error}",
      errorLoadingHistory: "履歴読み込みエラー: {error}",
      errorClearingHistory: "履歴の消去中にエラーが発生しました: {error}",
      historyCleared: "履歴を消去しました。",
      historyEntryDeleted: "エントリを削除しました。",
      resultsExported: "結果をJSONでエクスポートしました！",
      importFailed: "インポートに失敗しました: {error}",
    },
    dialogs: {
      confirmDeleteQuestion: "この問題を削除してもよろしいですか？",
      confirmClearHistory: "Rustバックエンドのすべてのテスト履歴を消去しますか？",
      confirmQuitQuiz: "現在のテストを終了しますか？これまでの進捗は失われます。",
      confirmResetDefaults: "Rustバックエンドの問題バンクをデフォルトのサンプルセットにリセットしますか？",
    },
    common: {
      confirm: "確認",
      cancel: "キャンセル",
      categoryLabels: {
        all: "すべての分野",
        web: "Web & JavaScript",
        cs: "コンピュータサイエンス",
        science: "科学・テクノロジー",
        history: "歴史・地理",
        custom: "カスタムバンク"
      },
      difficultyLabels: {
        easy: "初級",
        medium: "中級",
        hard: "上級"
      },
      modes: {
        practice: "練習",
        exam: "模擬試験",
        study: "学習"
      },
      time: {
        minutesSeconds: "{mins}分 {secs}秒",
        minutesOnly: "{mins}分",
        secondsOnly: "{secs}秒"
      }
    }
  }
};

let currentLang = DEFAULT_LANG;

/**
 * Get the currently active language code ('en', 'vi', 'es', 'fr', 'ja')
 */
export function getLanguage() {
  return currentLang;
}

/**
 * Get active locale string ('en-US', 'vi-VN', etc.) for Intl formatting
 */
export function getLocale() {
  const match = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);
  return match ? match.locale : "en-US";
}

/**
 * Get list of all supported languages with display metadata
 */
export function getSupportedLanguages() {
  return [...SUPPORTED_LANGUAGES];
}

/**
 * Translate a key into the active language with optional parameter interpolation
 * @param {string} key Dotted key e.g. "hub.hero.title"
 * @param {Object} [params] Key-value pairs to interpolate into placeholders like {count}
 * @returns {string} Translated string or fallback
 */
export function t(key, params = {}) {
  let val = resolveKey(TRANSLATIONS[currentLang], key);

  // Fallback to default language (en) if missing in current language
  if (val === undefined && currentLang !== DEFAULT_LANG) {
    val = resolveKey(TRANSLATIONS[DEFAULT_LANG], key);
  }

  // If still not found, return the key itself
  if (val === undefined) {
    return key;
  }

  // Parameter interpolation: replace {paramName} with value
  if (typeof val === "string" && params && Object.keys(params).length > 0) {
    return val.replace(/\{(\w+)\}/g, (match, paramName) => {
      return Object.prototype.hasOwnProperty.call(params, paramName) ? params[paramName] : match;
    });
  }

  return val;
}

function resolveKey(obj, key) {
  if (!obj || !key) return undefined;
  const parts = key.split(".");
  let cur = obj;
  for (const part of parts) {
    if (cur && typeof cur === "object" && part in cur) {
      cur = cur[part];
    } else {
      return undefined;
    }
  }
  return cur;
}

/**
 * Change the active language, persist to localStorage, update DOM, and dispatch event
 * @param {string} langCode
 */
export function setLanguage(langCode) {
  const valid = SUPPORTED_LANGUAGES.some((l) => l.code === langCode);
  const target = valid ? langCode : DEFAULT_LANG;

  currentLang = target;
  try {
    localStorage.setItem(STORAGE_KEY, target);
  } catch (e) {
    console.warn("Could not save language to localStorage:", e);
  }

  document.documentElement.lang = target;
  updateDOM();

  // Keep select element synchronized if present
  const selectEl = document.getElementById("select-language");
  if (selectEl && selectEl.value !== target) {
    selectEl.value = target;
  }

  // Dispatch event for dynamic view updates
  window.dispatchEvent(new CustomEvent("quizmaster:langchange", { detail: { lang: target } }));
}

/**
 * Scan DOM and update elements with data-i18n attributes
 */
export function updateDOM(root = document) {
  // Update document title
  const appTitle = t("app.title");
  if (appTitle) {
    document.title = appTitle;
  }

  // Update elements with text/HTML content
  const translatableElements = root.querySelectorAll("[data-i18n]");
  translatableElements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const isHtml = el.getAttribute("data-i18n-html") === "true";
    const text = t(key);
    if (isHtml) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  // Update placeholder attributes
  const placeholderElements = root.querySelectorAll("[data-i18n-placeholder]");
  placeholderElements.forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) {
      el.placeholder = t(key);
    }
  });

  // Update title tooltips
  const titleElements = root.querySelectorAll("[data-i18n-title]");
  titleElements.forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key) {
      el.title = t(key);
    }
  });

  // Update aria-label
  const ariaElements = root.querySelectorAll("[data-i18n-aria-label]");
  ariaElements.forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    if (key) {
      el.setAttribute("aria-label", t(key));
    }
  });
}

/**
 * Detect user's preferred initial language
 */
function detectInitialLanguage() {
  // 1. Check saved choice
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
  } catch (e) {
    // localStorage unavailable
  }

  // 2. Check browser languages
  const navLangs = navigator.languages || [navigator.language || navigator.userLanguage];
  for (const nl of navLangs) {
    if (!nl) continue;
    const code = nl.split("-")[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      return code;
    }
  }

  // 3. Fallback to default
  return DEFAULT_LANG;
}

/**
 * Initialize i18n subsystem
 */
export function initI18n() {
  const initialLang = detectInitialLanguage();
  setLanguage(initialLang);
}

// Assign to window for global convenience and non-module script access
if (typeof window !== "undefined") {
  window.i18n = {
    t,
    setLanguage,
    getLanguage,
    getLocale,
    getSupportedLanguages,
    updateDOM,
    initI18n,
    TRANSLATIONS
  };
}
