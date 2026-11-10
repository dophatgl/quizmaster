/**
 * QuizMaster - Multiple Choice Frontend Engine
 * Powered by a high-performance native Rust backend via Tauri IPC.
 */

import { t, initI18n, setLanguage, getLanguage, getLocale, getSupportedLanguages } from "./i18n.js";

// Detect Tauri Core Environment
const isTauri = typeof window.__TAURI__ !== "undefined" && typeof window.__TAURI__.core !== "undefined";
const tauriInvoke = isTauri ? window.__TAURI__.core.invoke : null;

/* ==========================================================================
   RUST BACKEND API CLIENT
   ========================================================================== */
const backendApi = {
  async getStats() {
    if (isTauri) {
      return await tauriInvoke("get_stats");
    }
    return mockApi.getStats();
  },

  async startQuiz(config) {
    if (isTauri) {
      return await tauriInvoke("start_quiz", { config });
    }
    return mockApi.startQuiz(config);
  },

  async submitQuiz(submission) {
    if (isTauri) {
      return await tauriInvoke("submit_quiz", { submission });
    }
    return mockApi.submitQuiz(submission);
  },

  async getAllQuestions() {
    if (isTauri) {
      return await tauriInvoke("get_all_questions");
    }
    return mockApi.getAllQuestions();
  },

  async filterQuestions(category, difficulty, search) {
    if (isTauri) {
      return await tauriInvoke("filter_questions", { category, difficulty, search });
    }
    return mockApi.filterQuestions(category, difficulty, search);
  },

  async addQuestion(question) {
    if (isTauri) {
      return await tauriInvoke("add_question", { question });
    }
    return mockApi.addQuestion(question);
  },

  async updateQuestion(question) {
    if (isTauri) {
      return await tauriInvoke("update_question", { question });
    }
    return mockApi.updateQuestion(question);
  },

  async deleteQuestion(id) {
    if (isTauri) {
      return await tauriInvoke("delete_question", { id });
    }
    return mockApi.deleteQuestion(id);
  },

  async getHistory() {
    if (isTauri) {
      return await tauriInvoke("get_history");
    }
    return mockApi.getHistory();
  },

  async clearHistory() {
    if (isTauri) {
      return await tauriInvoke("clear_history");
    }
    return mockApi.clearHistory();
  },

  async deleteHistoryEntry(id) {
    if (isTauri) {
      return await tauriInvoke("delete_history_entry", { id });
    }
    return mockApi.deleteHistoryEntry(id);
  },

  async getHistoryEntry(id) {
    if (isTauri) {
      return await tauriInvoke("get_history_entry", { id });
    }
    return mockApi.getHistoryEntry(id);
  },

  async exportQuestions() {
    if (isTauri) {
      return await tauriInvoke("export_questions");
    }
    return mockApi.exportQuestions();
  },

  async importQuestions(jsonStr, mode = "append") {
    if (isTauri) {
      return await tauriInvoke("import_questions", { jsonStr, mode });
    }
    return mockApi.importQuestions(jsonStr, mode);
  },

  async reloadQuestionsFromFile(filePath = null) {
    if (isTauri) {
      return await tauriInvoke("reload_questions_from_file", { filePath });
    }
    return mockApi.reloadQuestionsFromFile(filePath);
  },

  async resetDefaultQuestions() {
    if (isTauri) {
      return await tauriInvoke("reset_default_questions");
    }
    return mockApi.resetDefaultQuestions();
  }
};

/* ==========================================================================
   BROWSER FALLBACK / PREVIEW CLIENT (Only used if opened outside Tauri)
   ========================================================================== */
const DEFAULT_QUESTIONS = [
  {
    id: "web-1",
    category: "web",
    difficulty: "medium",
    question: "What is the output of the following JavaScript expression?",
    code: "console.log(typeof NaN);",
    options: ["\"number\"", "\"nan\"", "\"undefined\"", "\"object\""],
    correct: 0,
    explanation: "In JavaScript, NaN ('Not-a-Number') is technically a numeric data type specified by IEEE 754 floating-point standards."
  },
  {
    id: "web-2",
    category: "web",
    difficulty: "easy",
    question: "Which HTML5 semantic element is most appropriate for independent, self-contained syndicateable content?",
    options: ["<section>", "<article>", "<aside>", "<main>"],
    correct: 1,
    explanation: "The <article> element specifies independent, self-contained content such as blog posts, news stories, or forum comments."
  },
  {
    id: "web-3",
    category: "web",
    difficulty: "hard",
    question: "In the JavaScript Event Loop, which queue takes highest priority when the current synchronous call stack clears?",
    options: ["Macro-task Queue (setTimeout)", "Micro-task Queue (Promise.then)", "Animation Frame Queue", "I/O Polling Queue"],
    correct: 1,
    explanation: "Micro-tasks (like Promise callbacks and queueMicrotask) are processed immediately after the current script executes and before rendering or the next macro-task."
  },
  {
    id: "web-4",
    category: "web",
    difficulty: "medium",
    question: "In CSS Flexbox, which property aligns flex items along the cross axis?",
    options: ["justify-content", "align-items", "align-content", "flex-direction"],
    correct: 1,
    explanation: "While 'justify-content' aligns items along the main axis, 'align-items' aligns items along the cross axis."
  },
  {
    id: "web-5",
    category: "web",
    difficulty: "easy",
    question: "Which method is used to convert a JavaScript object into a JSON string?",
    code: "const user = { name: 'Alice' };",
    options: ["JSON.parse(user)", "JSON.stringify(user)", "user.toJSON()", "JSON.objectify(user)"],
    correct: 1,
    explanation: "JSON.stringify() serializes a JavaScript value or object to a JSON string, whereas JSON.parse() parses a JSON string back into a JavaScript object."
  },
  {
    id: "cs-1",
    category: "cs",
    difficulty: "medium",
    question: "What is the worst-case time complexity of standard QuickSort with poor pivot selection?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correct: 1,
    explanation: "When QuickSort consistently chooses the smallest or largest element as pivot, time complexity degrades to O(n²)."
  },
  {
    id: "cs-2",
    category: "cs",
    difficulty: "easy",
    question: "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
    options: ["Queue", "Stack", "Linked List", "Binary Heap"],
    correct: 1,
    explanation: "A Stack operates on LIFO (Last-In, First-Out), where push and pop occur at the same top end. Queues operate on FIFO."
  },
  {
    id: "cs-3",
    category: "cs",
    difficulty: "medium",
    question: "What is the average lookup time complexity in a well-balanced Hash Table?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 0,
    explanation: "Hash tables provide average O(1) constant time lookup, insertion, and deletion assuming a good distribution hash function."
  },
  {
    id: "cs-4",
    category: "cs",
    difficulty: "hard",
    question: "Which algorithm is designed to find the shortest path in a weighted graph with non-negative edge weights?",
    options: ["Bellman-Ford", "Dijkstra's Algorithm", "Floyd-Warshall", "Kruskal's Algorithm"],
    correct: 1,
    explanation: "Dijkstra's algorithm finds single-source shortest paths on graphs with non-negative weights in O((V + E) log V) with a binary priority queue."
  },
  {
    id: "cs-5",
    category: "cs",
    difficulty: "medium",
    question: "In binary representation, what decimal value does the 8-bit unsigned integer `00101010` represent?",
    options: ["34", "42", "58", "64"],
    correct: 1,
    explanation: "00101010 in binary = 32 + 8 + 2 = 42."
  },
  {
    id: "sci-1",
    category: "science",
    difficulty: "easy",
    question: "What is the approximate speed of light in a vacuum?",
    options: ["300,000 km/s", "150,000 km/s", "30,000 km/s", "1,080,000 km/s"],
    correct: 0,
    explanation: "The speed of light in a vacuum is approximately 300,000 km/s (299,792,458 m/s)."
  },
  {
    id: "sci-2",
    category: "science",
    difficulty: "medium",
    question: "Which nucleotide base pairs with Adenine in a standard DNA double helix?",
    options: ["Cytosine", "Thymine", "Guanine", "Uracil"],
    correct: 1,
    explanation: "In DNA, Adenine (A) pairs with Thymine (T) via two hydrogen bonds. In RNA, Uracil replaces Thymine."
  },
  {
    id: "sci-3",
    category: "science",
    difficulty: "hard",
    question: "What phenomenon in quantum mechanics describes two particles remaining connected so that actions performed on one instantly affect the other?",
    options: ["Quantum Tunneling", "Quantum Entanglement", "Wave-Particle Duality", "Superposition"],
    correct: 1,
    explanation: "Quantum entanglement is the physical phenomenon where pairs or groups of particles interact such that the quantum state of each particle cannot be described independently."
  },
  {
    id: "sci-4",
    category: "science",
    difficulty: "easy",
    question: "What is the primary chemical element that makes up the majority of the Sun's mass?",
    options: ["Helium", "Hydrogen", "Oxygen", "Carbon"],
    correct: 1,
    explanation: "Hydrogen accounts for approximately 73% of the Sun's mass, with Helium making up roughly 25%."
  },
  {
    id: "sci-5",
    category: "science",
    difficulty: "medium",
    question: "In machine learning, what term refers to a model learning the noise in training data so closely that it performs poorly on new data?",
    options: ["Underfitting", "Overfitting", "Gradient descent", "Regularization"],
    correct: 1,
    explanation: "Overfitting occurs when a mathematical model learns spurious noise and specific training artifacts, impairing generalizability."
  },
  {
    id: "hist-1",
    category: "history",
    difficulty: "easy",
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correct: 2,
    explanation: "Canberra was chosen as a compromise between rival cities Sydney and Melbourne in 1908."
  },
  {
    id: "hist-2",
    category: "history",
    difficulty: "medium",
    question: "In which year did the Apollo 11 mission successfully land the first humans on the Moon?",
    options: ["1965", "1969", "1971", "1973"],
    correct: 1,
    explanation: "Apollo 11 landed astronauts Neil Armstrong and Buzz Aldrin on the Moon on July 20, 1969."
  },
  {
    id: "hist-3",
    category: "history",
    difficulty: "medium",
    question: "Which ancient civilization built the monumental Machu Picchu sanctuary in the Andes?",
    options: ["Aztec", "Maya", "Inca", "Olmec"],
    correct: 2,
    explanation: "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru."
  },
  {
    id: "hist-4",
    category: "history",
    difficulty: "hard",
    question: "What strait separates the continent of Asia from North America?",
    options: ["Strait of Gibraltar", "Bering Strait", "Malacca Strait", "Bosphorus Strait"],
    correct: 1,
    explanation: "The Bering Strait connects the Bering Sea with the Chukchi Sea, separating Russia (Asia) from Alaska (North America)."
  },
  {
    id: "hist-5",
    category: "history",
    difficulty: "easy",
    question: "Which river is widely recognized as the longest in South America?",
    options: ["Paraná River", "Amazon River", "Orinoco River", "Magdalena River"],
    correct: 1,
    explanation: "The Amazon River is the longest river in South America and by far the largest by discharge volume in the world."
  }
];

function questionFingerprint(q) {
  const normalize = (value) =>
    String(value ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

  const options = (q.options || [])
    .map((opt, idx) => `${idx === q.correct ? 1 : 0}:${normalize(opt)}`)
    .sort();

  return `${normalize(q.question)}|${options.join("\u001f")}`;
}

const mockApi = {
  questions: JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)),
  history: [],

  async getStats() {
    return {
      totalQuestions: this.questions.length,
      countAll: this.questions.length,
      countWeb: this.questions.filter((q) => q.category === "web").length,
      countCs: this.questions.filter((q) => q.category === "cs").length,
      countScience: this.questions.filter((q) => q.category === "science").length,
      countHistory: this.questions.filter((q) => q.category === "history").length,
      countCustom: this.questions.filter((q) => q.category === "custom").length,
      totalAttempts: this.history.length,
      avgAccuracy: this.history.length ? Math.round(this.history.reduce((a, b) => a + b.accuracy, 0) / this.history.length) : 0,
      bestScore: this.history.length ? Math.max(...this.history.map((h) => h.accuracy)) : 0,
      totalTimeMins: Math.round(this.history.reduce((a, b) => a + (b.durationSecs || 0), 0) / 60)
    };
  },

  async startQuiz(config) {
    let eligible = this.questions.filter((q) => {
      const matchCat = config.category === "all" || q.category === config.category;
      const matchDiff = config.difficulty === "all" || q.difficulty === config.difficulty;
      return matchCat && matchDiff;
    });
    if (!eligible.length) throw new Error("No questions match criteria.");
    return eligible.slice(0, config.count || 10).map((q) => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      code: q.code || null,
      options: [...q.options],
      correct: q.correct,
      explanation: q.explanation
    }));
  },

  async submitQuiz(sub) {
    let correct = 0;
    const breakdowns = sub.questions.map((q, idx) => {
      const pick = sub.userAnswers[idx];
      const isCorrect = pick === q.correct;
      if (isCorrect) correct++;
      return {
        index: idx,
        id: q.id,
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        code: q.code,
        options: q.options,
        correct: q.correct,
        userPick: pick !== undefined ? pick : null,
        isCorrect,
        isSkipped: pick === undefined,
        isFlagged: sub.flagged.includes(idx),
        explanation: q.explanation
      };
    });
    const accuracy = Math.round((correct / sub.questions.length) * 100);
    const res = {
      id: `res-${Date.now()}`,
      timestamp: Math.floor(Date.now() / 1000),
      category: sub.category,
      mode: sub.mode,
      totalQuestions: sub.questions.length,
      correctCount: correct,
      wrongCount: sub.questions.length - correct,
      skippedCount: sub.questions.length - Object.keys(sub.userAnswers).length,
      flaggedCount: sub.flagged.length,
      accuracy,
      durationSecs: sub.totalDurationSecs,
      breakdowns
    };
    this.history.unshift({
      id: res.id,
      timestamp: res.timestamp,
      category: res.category,
      mode: res.mode,
      totalQuestions: res.totalQuestions,
      correctCount: res.correctCount,
      accuracy: res.accuracy,
      durationSecs: res.durationSecs
    });
    return res;
  },

  async getAllQuestions() { return [...this.questions]; },
  async filterQuestions(cat, diff, search) {
    const s = search.toLowerCase();
    return this.questions.filter((q) => {
      const matchCat = cat === "all" || q.category === cat;
      const matchDiff = diff === "all" || q.difficulty === diff;
      const matchSearch = !s || q.question.toLowerCase().includes(s);
      return matchCat && matchDiff && matchSearch;
    });
  },
  async addQuestion(q) {
    const fingerprint = questionFingerprint(q);
    if (this.questions.some((item) => questionFingerprint(item) === fingerprint)) {
      throw new Error("An identical question already exists.");
    }

    q.id = `q-${Date.now()}`;
    while (this.questions.some((item) => item.id === q.id)) {
      q.id = `q-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    this.questions.unshift(q);
    return q;
  },
  async updateQuestion(q) {
    const idx = this.questions.findIndex((item) => item.id === q.id);
    if (idx === -1) throw new Error("Question not found.");

    const fingerprint = questionFingerprint(q);
    const duplicate = this.questions.some(
      (item, itemIdx) => itemIdx !== idx && questionFingerprint(item) === fingerprint
    );
    if (duplicate) {
      throw new Error("Another question with identical content already exists.");
    }

    this.questions[idx] = q;
    return q;
  },
  async deleteQuestion(id) {
    this.questions = this.questions.filter((q) => q.id !== id);
    return true;
  },
  async getHistory() { return [...this.history]; },
  async clearHistory() { this.history = []; return true; },
  async deleteHistoryEntry(id) {
    const before = this.history.length;
    this.history = this.history.filter((h) => h.id !== id);
    if (this.history.length === before) throw new Error(`No history entry with id '${id}'`);
    return true;
  },
  async getHistoryEntry(id) {
    const entry = this.history.find((h) => h.id === id);
    if (!entry) throw new Error(`No history entry with id '${id}'`);
    return { ...entry };
  },
  async exportQuestions() { return JSON.stringify(this.questions, null, 2); },
  async importQuestions(str, mode = "append") {
    let parsed;
    try {
      parsed = JSON.parse(str);
    } catch (e) {
      throw new Error(`Invalid JSON syntax: ${e.message}`);
    }

    const rawList = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    if (!rawList.length) throw new Error("Question list in JSON is empty.");

    const seenFingerprints = new Set();
    const seenIds = new Set();
    const normalized = [];

    rawList.forEach((raw, idx) => {
      if (!raw.question || !raw.question.trim()) {
        throw new Error(`Question #${idx + 1}: prompt cannot be empty.`);
      }
      if (!Array.isArray(raw.options) || raw.options.length < 2) {
        throw new Error(`Question #${idx + 1}: must have at least 2 options.`);
      }

      let correct = raw.correct;
      if (typeof correct === "string") {
        const trimmed = correct.trim();
        const num = parseInt(trimmed, 10);
        if (!isNaN(num) && num >= 0 && num < raw.options.length) {
          correct = num;
        } else if (trimmed.length === 1 && /^[a-zA-Z]$/.test(trimmed)) {
          correct = trimmed.toUpperCase().charCodeAt(0) - 65;
        } else {
          const matchIdx = raw.options.findIndex(opt => opt.trim().toLowerCase() === trimmed.toLowerCase());
          if (matchIdx !== -1) {
            correct = matchIdx;
          } else {
            throw new Error(`Question #${idx + 1}: correct answer '${trimmed}' does not match any options.`);
          }
        }
      }

      if (typeof correct !== "number" || isNaN(correct) || correct < 0 || correct >= raw.options.length) {
        throw new Error(`Question #${idx + 1}: correct index ${correct} is out of bounds for ${raw.options.length} options.`);
      }

      let id = raw.id ? String(raw.id).trim() : `q-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
      const item = {
        id,
        category: (raw.category || "custom").toLowerCase(),
        difficulty: (raw.difficulty || "medium").toLowerCase(),
        question: raw.question.trim(),
        code: raw.code || null,
        options: raw.options,
        correct,
        explanation: raw.explanation || null
      };

      const fingerprint = questionFingerprint(item);
      if (seenFingerprints.has(fingerprint)) return;

      if (seenIds.has(item.id)) {
        item.id = `${item.id}-${Math.floor(Math.random() * 10000)}`;
      }

      seenFingerprints.add(fingerprint);
      seenIds.add(item.id);
      normalized.push(item);
    });

    if (!normalized.length) {
      throw new Error("Question list contains no unique questions.");
    }

    let changed = 0;
    if (mode === "replace" || mode === "overwrite") {
      this.questions = normalized;
      changed = normalized.length;
    } else if (mode === "upsert") {
      for (const item of normalized) {
        const fingerprint = questionFingerprint(item);
        const existingIdx = this.questions.findIndex((q) => q.id === item.id);
        if (existingIdx !== -1) {
          const duplicate = this.questions.some(
            (q, idx) => idx !== existingIdx && questionFingerprint(q) === fingerprint
          );
          if (duplicate) continue;
          this.questions[existingIdx] = item;
          changed += 1;
        } else {
          const contentIdx = this.questions.findIndex(
            (q) => questionFingerprint(q) === fingerprint
          );
          if (contentIdx !== -1) {
            item.id = this.questions[contentIdx].id;
            this.questions[contentIdx] = item;
            changed += 1;
          } else {
            this.questions.push(item);
            changed += 1;
          }
        }
      }
    } else {
      for (const item of normalized) {
        const fingerprint = questionFingerprint(item);
        if (this.questions.some((q) => questionFingerprint(q) === fingerprint)) {
          continue;
        }
        while (this.questions.some((q) => q.id === item.id)) {
          item.id = `q-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        }
        this.questions.push(item);
        changed += 1;
      }
    }
    return changed;
  },
  async reloadQuestionsFromFile() {
    this.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    return this.questions.length;
  },
  async resetDefaultQuestions() {
    this.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    return this.questions.length;
  }
};

/* ==========================================================================
   APP STATE
   ========================================================================== */
const state = {
  currentView: "hub",
  soundEnabled: true,
  theme: "light",

  config: {
    category: "all",
    mode: "practice",
    count: 10,
    difficulty: "all",
    timer: "30s",
    shuffleQuestions: true,
    shuffleOptions: true
  },

  activeQuiz: {
    questions: [],
    currentIndex: 0,
    userAnswers: {},
    flagged: new Set(),
    practiceAnswered: {},
    timerInterval: null,
    timeRemaining: 0,
    totalDuration: 0,
    quizStartTime: null
  },

  lastResults: null
};

const BUILTIN_CATEGORIES = ["web", "cs", "science", "history", "custom"];
const NEW_CATEGORY_VALUE = "__new__";
let knownCategories = ["all", ...BUILTIN_CATEGORIES];

/* ==========================================================================
   WEB AUDIO SYNTHESIZER
   ========================================================================== */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
      case "click": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case "correct": {
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.18, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
        break;
      }
      case "wrong": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }
      case "flag": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case "tick": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }
      case "complete": {
        [
          { f: 523.25, t: 0.00 },
          { f: 659.25, t: 0.10 },
          { f: 783.99, t: 0.20 },
          { f: 1046.50, t: 0.35 }
        ].forEach(({ f, t }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + t);
          gain.gain.setValueAtTime(0.2, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.45);
        });
        break;
      }
    }
  } catch (err) {
    console.warn("Audio playback not allowed yet:", err);
  }
}

/* ==========================================================================
   TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease-out";
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

/* ==========================================================================
   I18N HELPERS
   ========================================================================== */
function prettifyCategoryKey(catKey) {
  return String(catKey)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function getCategoryLabel(catKey) {
  const key = `common.categoryLabels.${catKey}`;
  const translated = t(key);
  return translated === key ? prettifyCategoryKey(catKey) : translated;
}

function normalizeCategory(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function collectCategoryKeys(questions = []) {
  const customs = new Set();
  questions.forEach((q) => {
    const cat = normalizeCategory(q.category);
    if (cat && cat !== "all" && !BUILTIN_CATEGORIES.includes(cat)) {
      customs.add(cat);
    }
  });
  return ["all", ...BUILTIN_CATEGORIES, ...Array.from(customs).sort()];
}

function syncEditorCategoryOptions(categories = knownCategories) {
  const select = document.getElementById("edit-q-category");
  if (!select) return;

  const current = select.value;
  select.innerHTML = "";

  categories
    .filter((cat) => cat !== "all")
    .forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = getCategoryLabel(cat);
      select.appendChild(option);
    });

  const newOption = document.createElement("option");
  newOption.value = NEW_CATEGORY_VALUE;
  newOption.textContent = t("modal.editor.newCategory");
  select.appendChild(newOption);

  if (current === NEW_CATEGORY_VALUE || categories.includes(current)) {
    select.value = current;
  }
}

function syncCategoryUI(questions = []) {
  const categories = collectCategoryKeys(questions);
  knownCategories = categories;

  if (!categories.includes(state.config.category)) {
    state.config.category = "all";
  }

  // Hub category selector: keep built-in cards, append discovered categories.
  const selector = document.getElementById("category-selector");
  if (selector) {
    selector.querySelectorAll(".category-item.dynamic-category").forEach((item) => item.remove());

    categories
      .filter((cat) => cat !== "all" && !BUILTIN_CATEGORIES.includes(cat))
      .forEach((cat) => {
        const item = document.createElement("div");
        item.className = "category-item dynamic-category";
        item.dataset.category = cat;

        const icon = document.createElement("div");
        icon.className = "cat-icon";
        icon.textContent = "🏷️";

        const info = document.createElement("div");
        info.className = "cat-info";
        const title = document.createElement("div");
        title.className = "cat-title";
        title.textContent = getCategoryLabel(cat);
        const count = document.createElement("div");
        count.className = "cat-count";
        info.append(title, count);

        const check = document.createElement("div");
        check.className = "cat-check";
        check.textContent = "✓";

        item.append(icon, info, check);
        selector.appendChild(item);
      });

    selector.querySelectorAll(".category-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.category === state.config.category);
    });
  }

  // Question bank category filter.
  const bankFilter = document.getElementById("bank-filter-category");
  if (bankFilter) {
    const previous = categories.includes(bankFilter.value) ? bankFilter.value : "all";
    bankFilter.innerHTML = "";
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat === "all" ? t("bank.allCategories") : getCategoryLabel(cat);
      bankFilter.appendChild(option);
    });
    bankFilter.value = previous;
  }

  // Question editor category dropdown.
  syncEditorCategoryOptions(categories);
}

function ensureCategoryOption(category) {
  const select = document.getElementById("edit-q-category");
  if (!select || !category || category === "all") return;

  const exists = Array.from(select.options).some((option) => option.value === category);
  if (exists) return;

  const option = document.createElement("option");
  option.value = category;
  option.textContent = getCategoryLabel(category);
  const newOption = select.querySelector(`option[value="${NEW_CATEGORY_VALUE}"]`);
  select.insertBefore(option, newOption || null);
}

function toggleNewCategoryInput() {
  const select = document.getElementById("edit-q-category");
  const input = document.getElementById("edit-q-category-new");
  if (!select || !input) return;

  const isNew = select.value === NEW_CATEGORY_VALUE;
  input.classList.toggle("hidden", !isNew);
  if (isNew) input.focus();
}

function getDifficultyLabel(diffKey) {
  const key = `common.difficultyLabels.${diffKey}`;
  const translated = t(key);
  return translated === key ? String(diffKey).toUpperCase() : translated.toUpperCase();
}

function getModeLabel(modeKey) {
  const key = `common.modes.${modeKey}`;
  const translated = t(key);
  return translated === key ? modeKey : translated;
}

function updateModeDescription() {
  const modeDesc = document.getElementById("mode-desc");
  if (!modeDesc) return;
  const modeKey = `hub.modes.${state.config.mode}Desc`;
  const translated = t(modeKey);
  modeDesc.innerHTML = translated === modeKey ? "" : translated;
}

function initLanguageSelector() {
  const select = document.getElementById("select-language");
  if (!select) return;

  select.innerHTML = "";
  getSupportedLanguages().forEach(({ code, nativeName }) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${nativeName} (${code.toUpperCase()})`;
    select.appendChild(option);
  });
  select.value = getLanguage();
  select.addEventListener("change", () => {
    setLanguage(select.value);
    playSound("click");
  });
}

function refreshDynamicContent() {
  updateModeDescription();
  refreshHubStats();

  if (state.currentView === "quiz" && state.activeQuiz.questions.length > 0) {
    renderCurrentQuestion();
  } else if (state.currentView === "results" && state.lastResults) {
    renderResultsView();
  } else if (state.currentView === "bank") {
    renderQuestionBank();
  } else if (state.currentView === "history") {
    renderHistoryView();
  }
}

/* ==========================================================================
   THEME & AUDIO CONTROLS
   ========================================================================== */
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  const sun = document.getElementById("theme-icon-sun");
  const moon = document.getElementById("theme-icon-moon");
  if (state.theme === "dark") {
    sun?.classList.remove("hidden");
    moon?.classList.add("hidden");
  } else {
    sun?.classList.add("hidden");
    moon?.classList.remove("hidden");
  }
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem("qm_theme", state.theme);
  applyTheme();
  playSound("click");
}

function applySoundUI() {
  const onIcon = document.getElementById("sound-icon-on");
  const offIcon = document.getElementById("sound-icon-off");
  if (state.soundEnabled) {
    onIcon?.classList.remove("hidden");
    offIcon?.classList.add("hidden");
  } else {
    onIcon?.classList.add("hidden");
    offIcon?.classList.remove("hidden");
  }
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem("qm_sound", String(state.soundEnabled));
  applySoundUI();
  if (state.soundEnabled) playSound("click");
}

/* ==========================================================================
   VIEW NAVIGATION
   ========================================================================== */
async function switchView(viewName) {
  if (state.currentView === "quiz" && viewName !== "quiz") {
    clearInterval(state.activeQuiz.timerInterval);
  }

  state.currentView = viewName;
  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.classList.remove("active");
  });

  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) {
    targetPanel.classList.add("active");
  }

  document.querySelectorAll(".nav-tab").forEach((tab) => {
    if (tab.dataset.view === viewName) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  if (viewName === "hub") {
    await refreshHubStats();
  } else if (viewName === "bank") {
    await renderQuestionBank();
  } else if (viewName === "history") {
    await renderHistoryView();
  }
}

/* ==========================================================================
   QUIZ HUB CONTROLLER (RUST POWERED)
   ========================================================================== */
async function refreshHubStats() {
  try {
    const [stats, allQuestions] = await Promise.all([
      backendApi.getStats(),
      backendApi.getAllQuestions()
    ]);

    syncCategoryUI(allQuestions);

    const counts = new Map();
    allQuestions.forEach((q) => {
      const cat = normalizeCategory(q.category);
      if (cat) counts.set(cat, (counts.get(cat) || 0) + 1);
    });

    document.querySelectorAll("#category-selector .category-item").forEach((item) => {
      const cat = item.dataset.category;
      const count = cat === "all" ? allQuestions.length : (counts.get(cat) || 0);
      const countEl = item.querySelector(".cat-count");
      if (countEl) countEl.textContent = t("hub.categories.questionsCount", { count });
    });

    document.getElementById("stat-quizzes-taken").textContent = stats.totalAttempts;
    document.getElementById("stat-avg-score").textContent = `${stats.avgAccuracy}%`;
    document.getElementById("stat-total-questions").textContent = stats.totalQuestions;
  } catch (err) {
    console.error("Failed to load stats from backend:", err);
  }
}

function initHubControls() {
  const categorySelector = document.getElementById("category-selector");
  categorySelector?.addEventListener("click", (event) => {
    const item = event.target.closest(".category-item");
    if (!item || !categorySelector.contains(item)) return;

    categorySelector.querySelectorAll(".category-item").forEach((c) => c.classList.remove("active"));
    item.classList.add("active");
    state.config.category = item.dataset.category;
    playSound("click");
  });

  const modeBtns = document.querySelectorAll("#mode-selector .segment-btn");
  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.config.mode = btn.dataset.mode;
      playSound("click");

      updateModeDescription();
    });
  });

  const countChips = document.querySelectorAll("#count-selector .chip-btn");
  countChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      countChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.config.count = chip.dataset.count === "all" ? 9999 : parseInt(chip.dataset.count, 10);
      playSound("click");
    });
  });

  const diffChips = document.querySelectorAll("#difficulty-selector .chip-btn");
  diffChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      diffChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.config.difficulty = chip.dataset.diff;
      playSound("click");
    });
  });

  document.getElementById("timer-select")?.addEventListener("change", (e) => {
    state.config.timer = e.target.value;
  });

  document.getElementById("toggle-shuffle-q")?.addEventListener("change", (e) => {
    state.config.shuffleQuestions = e.target.checked;
  });
  document.getElementById("toggle-shuffle-o")?.addEventListener("change", (e) => {
    state.config.shuffleOptions = e.target.checked;
  });

  document.getElementById("btn-start-quiz")?.addEventListener("click", () => startQuizSession());
}

/* ==========================================================================
   QUIZ EXECUTION ENGINE (RUST POWERED)
   ========================================================================== */
async function startQuizSession(overrideQuestions = null) {
  try {
    let preparedQuestions = [];

    if (overrideQuestions && overrideQuestions.length > 0) {
      preparedQuestions = overrideQuestions;
    } else {
      const rustConfig = {
        category: state.config.category,
        difficulty: state.config.difficulty,
        count: state.config.count,
        mode: state.config.mode,
        timer: state.config.timer,
        shuffleQuestions: state.config.shuffleQuestions,
        shuffleOptions: state.config.shuffleOptions
      };

      preparedQuestions = await backendApi.startQuiz(rustConfig);
    }

    if (!preparedQuestions || preparedQuestions.length === 0) {
      showToast(t("toasts.noQuestionsFound"), "error");
      return;
    }

    state.activeQuiz = {
      questions: preparedQuestions,
      currentIndex: 0,
      userAnswers: {},
      flagged: new Set(),
      practiceAnswered: {},
      timerInterval: null,
      timeRemaining: 0,
      totalDuration: 0,
      quizStartTime: Date.now()
    };

    initTimer();
    await switchView("quiz");
    renderCurrentQuestion();
    playSound("click");
  } catch (err) {
    showToast(t("toasts.failedToStart", { error: err }), "error");
    console.error(err);
  }
}

function initTimer() {
  clearInterval(state.activeQuiz.timerInterval);
  const timerConfig = state.config.timer;

  if (timerConfig === "none" || state.config.mode === "study") {
    document.getElementById("timer-container").classList.add("hidden");
    return;
  }

  document.getElementById("timer-container").classList.remove("hidden");
  document.getElementById("timer-container").classList.remove("warning", "danger");

  let seconds = 30;
  if (timerConfig === "20s") seconds = 20;
  else if (timerConfig === "30s") seconds = 30;
  else if (timerConfig === "5m") seconds = 300;
  else if (timerConfig === "10m") seconds = 600;
  else if (timerConfig === "15m") seconds = 900;

  state.activeQuiz.timeRemaining = seconds;
  updateTimerUI();

  state.activeQuiz.timerInterval = setInterval(() => {
    state.activeQuiz.timeRemaining--;
    state.activeQuiz.totalDuration++;

    updateTimerUI();

    if (state.activeQuiz.timeRemaining <= 5 && state.activeQuiz.timeRemaining > 0) {
      playSound("tick");
    }

    if (state.activeQuiz.timeRemaining <= 0) {
      handleTimeExpired();
    }
  }, 1000);
}

function updateTimerUI() {
  const display = document.getElementById("timer-display");
  const container = document.getElementById("timer-container");
  const remaining = Math.max(0, state.activeQuiz.timeRemaining);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  display.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  if (remaining <= 10) {
    container.classList.add("danger");
    container.classList.remove("warning");
  } else if (remaining <= 25) {
    container.classList.add("warning");
    container.classList.remove("danger");
  } else {
    container.classList.remove("warning", "danger");
  }
}

function handleTimeExpired() {
  const isPerQuestion = state.config.timer === "20s" || state.config.timer === "30s";

  if (isPerQuestion) {
    showToast(t("quiz.timeExpiredQuestion"), "info");
    if (state.activeQuiz.currentIndex < state.activeQuiz.questions.length - 1) {
      nextQuestion();
    } else {
      finishAndSubmitQuiz();
    }
  } else {
    clearInterval(state.activeQuiz.timerInterval);
    showToast(t("quiz.timeExpiredTest"), "error", 4000);
    finishAndSubmitQuiz();
  }
}

function renderCurrentQuestion() {
  const { questions, currentIndex, userAnswers, flagged, practiceAnswered } = state.activeQuiz;
  const currentQ = questions[currentIndex];
  if (!currentQ) return;

  document.getElementById("quiz-cat-badge").textContent = getCategoryLabel(currentQ.category);
  document.getElementById("quiz-diff-badge").textContent = getDifficultyLabel(currentQ.difficulty);
  document.getElementById("quiz-q-counter").textContent = t("quiz.questionCounter", {
    current: currentIndex + 1,
    total: questions.length
  });

  const percent = Math.round(((currentIndex + 1) / questions.length) * 100);
  document.getElementById("quiz-progress-fill").style.width = `${percent}%`;

  const answeredCount = Object.keys(userAnswers).length;
  document.getElementById("palette-status").textContent = `${answeredCount}/${questions.length}`;

  const flagBtn = document.getElementById("btn-flag-question");
  const flagText = document.getElementById("flag-text");
  if (flagged.has(currentIndex)) {
    flagBtn.classList.add("flagged");
    flagText.textContent = t("quiz.flagged");
  } else {
    flagBtn.classList.remove("flagged");
    flagText.textContent = t("quiz.flag");
  }

  document.getElementById("question-text").textContent = currentQ.question;

  const codeBox = document.getElementById("question-code-box");
  const codeEl = document.getElementById("question-code");
  if (currentQ.code) {
    codeBox.classList.remove("hidden");
    codeEl.textContent = currentQ.code;
  } else {
    codeBox.classList.add("hidden");
  }

  const expBox = document.getElementById("explanation-box");
  const expTitle = document.getElementById("exp-title");
  const expContent = document.getElementById("exp-content");
  const expIcon = document.getElementById("exp-status-icon");

  const hasAnsweredPractice = state.config.mode === "practice" && practiceAnswered[currentIndex];
  const isStudyMode = state.config.mode === "study";

  if (hasAnsweredPractice || isStudyMode) {
    expBox.classList.remove("hidden");
    expContent.textContent = currentQ.explanation || t("quiz.noExplanation");
    if (userAnswers[currentIndex] === currentQ.correct) {
      expTitle.textContent = t("quiz.explanationCorrect");
      expIcon.textContent = "🎉";
    } else {
      expTitle.textContent = t("quiz.explanationRationale");
      expIcon.textContent = "💡";
    }
  } else {
    expBox.classList.add("hidden");
  }

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  const selectedAnswer = userAnswers[currentIndex];
  const optionLetters = ["A", "B", "C", "D", "E"];

  currentQ.options.forEach((optText, optIdx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.index = optIdx;

    if (selectedAnswer === optIdx) {
      btn.classList.add("selected");
    }

    if (hasAnsweredPractice) {
      if (optIdx === currentQ.correct) {
        btn.classList.add("correct");
      } else if (selectedAnswer === optIdx && selectedAnswer !== currentQ.correct) {
        btn.classList.add("wrong");
      }
    }

    const badge = document.createElement("div");
    badge.className = "option-badge";
    badge.textContent = optionLetters[optIdx] || optIdx + 1;

    const textSpan = document.createElement("span");
    textSpan.className = "option-text";
    textSpan.textContent = optText;

    const iconSpan = document.createElement("span");
    iconSpan.className = "option-icon";
    iconSpan.textContent = optIdx === currentQ.correct && hasAnsweredPractice ? "✓" : "●";

    btn.appendChild(badge);
    btn.appendChild(textSpan);
    btn.appendChild(iconSpan);

    btn.addEventListener("click", () => handleOptionSelected(optIdx));
    optionsContainer.appendChild(btn);
  });

  const prevBtn = document.getElementById("btn-prev-q");
  const nextBtn = document.getElementById("btn-next-q");
  const submitBtn = document.getElementById("btn-submit-quiz");

  prevBtn.disabled = currentIndex === 0;

  if (currentIndex === questions.length - 1) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }
}

function handleOptionSelected(optionIndex) {
  const { currentIndex, questions, userAnswers, practiceAnswered } = state.activeQuiz;
  const currentQ = questions[currentIndex];

  if (state.config.mode === "practice" && practiceAnswered[currentIndex]) {
    return;
  }

  userAnswers[currentIndex] = optionIndex;

  if (state.config.mode === "practice") {
    practiceAnswered[currentIndex] = true;
    if (optionIndex === currentQ.correct) {
      playSound("correct");
    } else {
      playSound("wrong");
    }
  } else {
    playSound("click");
  }

  renderCurrentQuestion();
}

function clearCurrentSelection() {
  const { currentIndex, userAnswers, practiceAnswered } = state.activeQuiz;
  if (state.config.mode === "practice" && practiceAnswered[currentIndex]) {
    showToast(t("toasts.cannotClearPractice"), "info");
    return;
  }
  delete userAnswers[currentIndex];
  playSound("click");
  renderCurrentQuestion();
}

function nextQuestion() {
  if (state.activeQuiz.currentIndex < state.activeQuiz.questions.length - 1) {
    state.activeQuiz.currentIndex++;
    if (state.config.timer === "20s" || state.config.timer === "30s") {
      state.activeQuiz.timeRemaining = state.config.timer === "20s" ? 20 : 30;
    }
    playSound("click");
    renderCurrentQuestion();
  }
}

function prevQuestion() {
  if (state.activeQuiz.currentIndex > 0) {
    state.activeQuiz.currentIndex--;
    playSound("click");
    renderCurrentQuestion();
  }
}

function toggleFlagCurrentQuestion() {
  const { currentIndex, flagged } = state.activeQuiz;
  if (flagged.has(currentIndex)) {
    flagged.delete(currentIndex);
    showToast(t("toasts.unflagged", { number: currentIndex + 1 }), "info");
  } else {
    flagged.add(currentIndex);
    showToast(t("toasts.flagged", { number: currentIndex + 1 }), "info");
  }
  playSound("flag");
  renderCurrentQuestion();
}

/* ==========================================================================
   PALETTE & MODALS
   ========================================================================== */
function openPaletteModal() {
  const modal = document.getElementById("modal-palette");
  const grid = document.getElementById("palette-grid");
  const footerStats = document.getElementById("palette-footer-stats");
  if (!modal || !grid) return;

  grid.innerHTML = "";
  const { questions, currentIndex, userAnswers, flagged } = state.activeQuiz;

  questions.forEach((q, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "palette-num-btn";
    btn.textContent = idx + 1;

    if (idx === currentIndex) btn.classList.add("current");
    if (userAnswers[idx] !== undefined) btn.classList.add("answered");
    if (flagged.has(idx)) btn.classList.add("flagged");

    btn.addEventListener("click", () => {
      state.activeQuiz.currentIndex = idx;
      renderCurrentQuestion();
      closeModal("modal-palette");
      playSound("click");
    });

    grid.appendChild(btn);
  });

  const answeredCount = Object.keys(userAnswers).length;
  footerStats.textContent = t("modal.palette.stats", {
    answered: answeredCount,
    total: questions.length
  });

  modal.classList.remove("hidden");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hidden");
}

/**
 * In-app confirmation dialog.
 * Native window.confirm() is silently disabled in Tauri v2 on macOS (WKWebView),
 * where it always returns false, so destructive actions were never executed.
 * This returns a Promise<boolean> and works in both browser and desktop builds.
 */
let appConfirmResolver = null;

function showAppConfirm({ title, message, confirmLabel, cancelLabel, danger = false } = {}) {
  const modal = document.getElementById("modal-app-confirm");
  if (!modal) {
    return Promise.resolve(window.confirm(message || title || ""));
  }

  const titleEl = document.getElementById("app-confirm-title");
  const bodyEl = document.getElementById("app-confirm-body");
  const okBtn = document.getElementById("btn-app-confirm-ok");
  const cancelBtn = document.getElementById("btn-app-confirm-cancel");
  const closeBtn = document.getElementById("btn-app-confirm-close");

  // Cancel any dialog that is already open before showing a new one.
  if (appConfirmResolver) {
    appConfirmResolver(false);
  }

  titleEl.textContent = title || t("common.confirm");
  bodyEl.textContent = message || "";
  okBtn.textContent = confirmLabel || t("common.confirm");
  cancelBtn.textContent = cancelLabel || t("common.cancel");
  okBtn.classList.toggle("btn-warning", danger);
  okBtn.classList.toggle("btn-primary", !danger);

  const previousFocus = document.activeElement;
  modal.classList.remove("hidden");
  okBtn.focus();

  return new Promise((resolve) => {
    const finish = (result) => {
      if (appConfirmResolver !== finish) return;
      appConfirmResolver = null;
      modal.classList.add("hidden");
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      closeBtn.removeEventListener("click", onCancel);
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
      resolve(result);
    };
    const onOk = () => finish(true);
    const onCancel = () => finish(false);
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finish(false);
      }
    };

    appConfirmResolver = finish;
    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
    closeBtn.addEventListener("click", onCancel);
    document.addEventListener("keydown", onKeyDown);
  });
}

function showConfirmSubmitModal() {
  const { questions, userAnswers } = state.activeQuiz;
  const unansweredCount = questions.length - Object.keys(userAnswers).length;

  const modal = document.getElementById("modal-confirm");
  const title = document.getElementById("confirm-title");
  const body = document.getElementById("confirm-body");

  title.textContent = t("modal.confirm.title");
  if (unansweredCount > 0) {
    body.innerHTML = t("modal.confirm.unansweredWarning", {
      count: unansweredCount,
      total: questions.length
    });
  } else {
    body.innerHTML = t("modal.confirm.allAnswered");
  }

  modal.classList.remove("hidden");
}

/* ==========================================================================
   SUBMISSION & RESULTS (RUST POWERED)
   ========================================================================== */
async function finishAndSubmitQuiz() {
  clearInterval(state.activeQuiz.timerInterval);
  closeModal("modal-confirm");
  closeModal("modal-palette");

  const { questions, userAnswers, flagged, totalDuration, quizStartTime } = state.activeQuiz;
  const totalDurationSecs = totalDuration > 0 ? totalDuration : Math.round((Date.now() - quizStartTime) / 1000);

  const submission = {
    questions,
    userAnswers,
    flagged: Array.from(flagged),
    totalDurationSecs,
    category: state.config.category,
    mode: state.config.mode
  };

  try {
    const results = await backendApi.submitQuiz(submission);
    results.originalQuestions = questions;
    state.lastResults = results;

    playSound("complete");
    renderResultsView();
    await switchView("results");
  } catch (err) {
    showToast(t("toasts.errorSubmitting", { error: err }), "error");
    console.error(err);
  }
}

function renderResultsView() {
  const res = state.lastResults;
  if (!res) return;

  document.getElementById("res-score-percent").textContent = `${res.accuracy}%`;
  document.getElementById("res-score-ratio").textContent = `${res.correctCount} / ${res.totalQuestions}`;

  const circle = document.getElementById("score-circle-progress");
  const circumference = 314.16;
  const offset = circumference - (res.accuracy / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  const badgeStatus = document.getElementById("res-badge-status");
  const heading = document.getElementById("res-heading");
  const desc = document.getElementById("res-description");

  let tier = "review";
  if (res.accuracy >= 90) tier = "masterful";
  else if (res.accuracy >= 70) tier = "great";
  else if (res.accuracy >= 50) tier = "good";

  badgeStatus.textContent = t(`results.badge.${tier}`);
  if (tier === "masterful") {
    badgeStatus.style.backgroundColor = "var(--success-bg)";
    badgeStatus.style.color = "var(--success)";
  } else {
    badgeStatus.style.backgroundColor = "";
    badgeStatus.style.color = "";
  }
  heading.textContent = t(`results.heading.${tier}`);
  desc.textContent = t(`results.desc.${tier}`);

  document.getElementById("res-correct-count").textContent = res.correctCount;
  document.getElementById("res-wrong-count").textContent = res.wrongCount;
  document.getElementById("res-skipped-count").textContent = res.skippedCount;
  document.getElementById("res-flagged-count").textContent = res.flaggedCount;

  const mins = Math.floor(res.durationSecs / 60);
  const secs = res.durationSecs % 60;
  document.getElementById("res-time-spent").textContent = t("common.time.minutesSeconds", { mins, secs });

  const avgSec = Math.round(res.durationSecs / res.totalQuestions);
  document.getElementById("res-avg-time").textContent = t("common.time.secondsOnly", { secs: avgSec });

  const mistakeBtn = document.getElementById("btn-retry-mistakes");
  const mistakeCountEl = document.getElementById("mistake-count");
  if (res.wrongCount > 0) {
    mistakeBtn.classList.remove("hidden");
    mistakeCountEl.textContent = res.wrongCount;
  } else {
    mistakeBtn.classList.add("hidden");
  }

  document.getElementById("tab-cnt-all").textContent = res.totalQuestions;
  document.getElementById("tab-cnt-correct").textContent = res.correctCount;
  document.getElementById("tab-cnt-wrong").textContent = res.wrongCount;
  document.getElementById("tab-cnt-flagged").textContent = res.flaggedCount;

  renderReviewList("all");
}

function renderReviewList(filter = "all") {
  const res = state.lastResults;
  if (!res) return;

  const container = document.getElementById("review-cards-list");
  container.innerHTML = "";

  const filtered = res.breakdowns.filter((b) => {
    if (filter === "correct") return b.isCorrect;
    if (filter === "wrong") return !b.isCorrect && !b.isSkipped;
    if (filter === "flagged") return b.isFlagged;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-muted);">${escapeHtml(t("results.review.empty"))}</div>`;
    return;
  }

  const optionLetters = ["A", "B", "C", "D"];

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "review-card";

    let statusTag = "";
    if (item.isCorrect) {
      card.classList.add("status-correct");
      statusTag = `<span class="review-status-tag correct">${escapeHtml(t("results.review.statusCorrect"))}</span>`;
    } else if (item.isSkipped) {
      card.classList.add("status-skipped");
      statusTag = `<span class="review-status-tag skipped">${escapeHtml(t("results.review.statusSkipped"))}</span>`;
    } else {
      card.classList.add("status-wrong");
      statusTag = `<span class="review-status-tag wrong">${escapeHtml(t("results.review.statusWrong"))}</span>`;
    }

    const flagTag = item.isFlagged ? `<span>${escapeHtml(t("results.review.statusFlagged"))}</span>` : "";

    let codeHtml = "";
    if (item.code) {
      codeHtml = `<div class="code-snippet-box"><pre><code>${escapeHtml(item.code)}</code></pre></div>`;
    }

    let optionsHtml = "";
    item.options.forEach((optText, optIdx) => {
      const isCorrectPick = optIdx === item.correct;
      const isUserPick = optIdx === item.userPick;
      let optClass = "review-option-pill";

      if (isCorrectPick) optClass += " correct-pick";
      else if (isUserPick) optClass += " user-pick";

      let optBadge = `<strong>${optionLetters[optIdx]}.</strong> ${escapeHtml(optText)}`;
      if (isCorrectPick) optBadge += ` <em>${escapeHtml(t("results.review.correctAnswer"))}</em>`;
      if (isUserPick && !isCorrectPick) optBadge += ` <em>${escapeHtml(t("results.review.yourAnswer"))}</em>`;

      optionsHtml += `<div class="${optClass}">${optBadge}</div>`;
    });

    card.innerHTML = `
      <div class="review-q-header">
        <span class="quiz-q-counter">${escapeHtml(t("results.review.questionLabel", { number: item.index + 1 }))}</span>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          ${flagTag}
          ${statusTag}
        </div>
      </div>
      <div class="bank-q-title">${escapeHtml(item.question)}</div>
      ${codeHtml}
      <div class="review-options-summary">
        ${optionsHtml}
      </div>
      <div class="review-explanation">
        <strong>${escapeHtml(t("results.review.explanationLabel"))}</strong> ${escapeHtml(item.explanation || t("quiz.noExplanation"))}
      </div>
    `;

    container.appendChild(card);
  });
}

/* ==========================================================================
   QUESTION BANK CONTROLLER (RUST POWERED)
   ========================================================================== */
async function renderQuestionBank() {
  const container = document.getElementById("bank-items-list");

  try {
    const allQuestions = await backendApi.getAllQuestions();
    syncCategoryUI(allQuestions);

    const searchVal = document.getElementById("bank-search-input").value.trim();
    const catFilter = document.getElementById("bank-filter-category").value;
    const diffFilter = document.getElementById("bank-filter-difficulty").value;
    const filtered = await backendApi.filterQuestions(catFilter, diffFilter, searchVal);

    const counter = document.getElementById("bank-counter");
    if (counter) {
      counter.textContent = t("bank.showingCount", {
        filtered: filtered.length,
        total: allQuestions.length
      });
    }

    container.innerHTML = "";

    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-muted);">${escapeHtml(t("bank.empty"))}</div>`;
      return;
    }

    const optionLetters = ["A", "B", "C", "D"];

    filtered.forEach((q) => {
      const itemCard = document.createElement("div");
      itemCard.className = "bank-item-card";

      let codeBlock = "";
      if (q.code) {
        codeBlock = `<div class="code-snippet-box"><pre><code>${escapeHtml(q.code)}</code></pre></div>`;
      }

      let choicesHtml = "";
      q.options.forEach((opt, idx) => {
        const isCorrect = idx === q.correct;
        choicesHtml += `
          <div class="bank-choice-pill ${isCorrect ? "is-correct" : ""}">
            <strong>${optionLetters[idx]}:</strong> ${escapeHtml(opt)} ${isCorrect ? "✓" : ""}
          </div>
        `;
      });

      itemCard.innerHTML = `
        <div class="bank-item-top">
          <div class="bank-item-badges">
            <span class="badge category-badge">${escapeHtml(getCategoryLabel(q.category))}</span>
            <span class="badge diff-badge">${escapeHtml(getDifficultyLabel(q.difficulty))}</span>
          </div>
          <div class="bank-item-actions">
            <button class="btn btn-secondary btn-sm btn-edit-q" data-id="${q.id}">${escapeHtml(t("bank.edit"))}</button>
            <button class="btn btn-ghost-danger btn-sm btn-delete-q" data-id="${q.id}">${escapeHtml(t("bank.delete"))}</button>
          </div>
        </div>
        <div class="bank-q-title">${escapeHtml(q.question)}</div>
        ${codeBlock}
        <div class="bank-choices-grid">
          ${choicesHtml}
        </div>
        ${q.explanation ? `<div class="review-explanation"><strong>${escapeHtml(t("bank.noteLabel"))}</strong> ${escapeHtml(q.explanation)}</div>` : ""}
      `;

      itemCard.querySelector(".btn-edit-q").addEventListener("click", () => openEditQuestionModal(q));
      itemCard.querySelector(".btn-delete-q").addEventListener("click", () => handleDeleteQuestion(q.id));

      container.appendChild(itemCard);
    });
  } catch (err) {
    showToast(t("toasts.errorLoadingQuestions", { error: err }), "error");
  }
}

function openAddQuestionModal() {
  document.getElementById("editor-modal-title").textContent = t("modal.editor.addTitle");
  document.getElementById("edit-q-id").value = "";
  document.getElementById("form-question-editor").reset();
  document.getElementById("edit-q-category").value = "custom";
  document.getElementById("edit-q-category-new").value = "";
  toggleNewCategoryInput();
  document.querySelector('input[name="correct-choice"][value="0"]').checked = true;
  document.getElementById("modal-question-editor").classList.remove("hidden");
}

function openEditQuestionModal(q) {
  document.getElementById("editor-modal-title").textContent = t("modal.editor.editTitle");
  document.getElementById("edit-q-id").value = q.id;
  ensureCategoryOption(q.category);
  document.getElementById("edit-q-category").value = q.category;
  document.getElementById("edit-q-category-new").value = "";
  toggleNewCategoryInput();
  document.getElementById("edit-q-difficulty").value = q.difficulty;
  document.getElementById("edit-q-text").value = q.question;
  document.getElementById("edit-q-code").value = q.code || "";
  document.getElementById("edit-opt-0").value = q.options[0] || "";
  document.getElementById("edit-opt-1").value = q.options[1] || "";
  document.getElementById("edit-opt-2").value = q.options[2] || "";
  document.getElementById("edit-opt-3").value = q.options[3] || "";
  document.getElementById("edit-q-explanation").value = q.explanation || "";

  const radio = document.querySelector(`input[name="correct-choice"][value="${q.correct}"]`);
  if (radio) radio.checked = true;

  document.getElementById("modal-question-editor").classList.remove("hidden");
}

async function handleSaveQuestionForm(e) {
  e.preventDefault();
  const qId = document.getElementById("edit-q-id").value.trim();
  const categorySelect = document.getElementById("edit-q-category");
  const newCategoryInput = document.getElementById("edit-q-category-new");
  let category = categorySelect.value;

  if (category === NEW_CATEGORY_VALUE) {
    category = normalizeCategory(newCategoryInput.value);
    if (!category) {
      showToast(t("modal.editor.categoryRequired"), "error");
      newCategoryInput.focus();
      return;
    }
  }

  const difficulty = document.getElementById("edit-q-difficulty").value;
  const question = document.getElementById("edit-q-text").value.trim();
  const code = document.getElementById("edit-q-code").value.trim() || null;
  const opt0 = document.getElementById("edit-opt-0").value.trim();
  const opt1 = document.getElementById("edit-opt-1").value.trim();
  const opt2 = document.getElementById("edit-opt-2").value.trim();
  const opt3 = document.getElementById("edit-opt-3").value.trim();
  const explanation = document.getElementById("edit-q-explanation").value.trim() || null;
  const correct = parseInt(document.querySelector('input[name="correct-choice"]:checked').value, 10);

  if (!question || !opt0 || !opt1 || !opt2 || !opt3) {
    showToast(t("toasts.formIncomplete"), "error");
    return;
  }

  const questionPayload = {
    id: qId,
    category,
    difficulty,
    question,
    code,
    options: [opt0, opt1, opt2, opt3],
    correct,
    explanation
  };

  try {
    if (qId) {
      await backendApi.updateQuestion(questionPayload);
      showToast(t("toasts.questionUpdated"), "success");
    } else {
      await backendApi.addQuestion(questionPayload);
      showToast(t("toasts.questionSaved"), "success");
    }

    closeModal("modal-question-editor");
    await renderQuestionBank();
    await refreshHubStats();
    playSound("click");
  } catch (err) {
    showToast(t("toasts.failedToSave", { error: err }), "error");
  }
}

async function handleDeleteQuestion(qId) {
  const confirmed = await showAppConfirm({
    title: t("bank.delete"),
    message: t("dialogs.confirmDeleteQuestion"),
    confirmLabel: t("bank.delete"),
    danger: true
  });
  if (!confirmed) return;

  try {
    await backendApi.deleteQuestion(qId);
    showToast(t("toasts.questionRemoved"), "info");
    await renderQuestionBank();
    await refreshHubStats();
  } catch (err) {
    showToast(t("toasts.errorDeleting", { error: err }), "error");
  }
}

/* ==========================================================================
   IMPORT / EXPORT (RUST & JSON POWERED)
   ========================================================================== */
async function openImportExportModal() {
  try {
    const jsonStr = await backendApi.exportQuestions();
    const textarea = document.getElementById("io-json-textarea");
    textarea.value = jsonStr;
    const statusMsg = document.getElementById("io-status-msg");
    statusMsg.style.color = "var(--text-muted)";
    statusMsg.textContent = t("modal.io.statusCurrentLoaded");
    document.getElementById("modal-import-export").classList.remove("hidden");
    setupJsonDragAndDrop();
  } catch (err) {
    showToast(t("toasts.failedToExport", { error: err }), "error");
  }
}

async function handleApplyImport(mode = "append") {
  const textarea = document.getElementById("io-json-textarea");
  const statusMsg = document.getElementById("io-status-msg");
  const jsonText = textarea.value.trim();

  if (!jsonText) {
    statusMsg.style.color = "var(--danger)";
    statusMsg.textContent = t("modal.io.statusPasteFirst");
    return;
  }

  try {
    const count = await backendApi.importQuestions(jsonText, mode);
    const isReplace = mode === "replace" || mode === "overwrite";

    if (!isReplace && count === 0) {
      const noNewMessage = t("toasts.importNoNewQuestions");
      statusMsg.style.color = "var(--warning, var(--text-muted))";
      statusMsg.textContent = noNewMessage;
      showToast(noNewMessage, "info");
    } else {
      statusMsg.style.color = "var(--success)";
      const action = isReplace
        ? t("toasts.actionReplaced")
        : t("toasts.actionAppended");
      const successMessage = t("toasts.importSuccess", { action, count });
      statusMsg.textContent = `✓ ${successMessage}`;
      showToast(successMessage, "success");
    }

    await renderQuestionBank();
    await refreshHubStats();
    playSound("click");
  } catch (err) {
    statusMsg.style.color = "var(--danger)";
    statusMsg.textContent = t("toasts.importFailed", { error: err });
    showToast(t("toasts.invalidJson"), "error");
  }
}

function handleFileInputChange(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;
    document.getElementById("io-json-textarea").value = content;
    const statusMsg = document.getElementById("io-status-msg");
    statusMsg.style.color = "var(--primary)";
    statusMsg.textContent = t("modal.io.statusFileLoaded", {
      filename: file.name,
      size: (file.size / 1024).toFixed(1)
    });
    showToast(t("toasts.fileLoaded", { filename: file.name }), "info");
    playSound("click");
  };
  reader.onerror = () => {
    showToast(t("toasts.failedToReadFile"), "error");
  };
  reader.readAsText(file);
  e.target.value = "";
}

async function handleReloadFileJson() {
  const statusMsg = document.getElementById("io-status-msg");
  try {
    const count = await backendApi.reloadQuestionsFromFile();
    const updatedJson = await backendApi.exportQuestions();
    document.getElementById("io-json-textarea").value = updatedJson;
    statusMsg.style.color = "var(--success)";
    const syncMessage = t("toasts.syncedSuccess", { count });
    statusMsg.textContent = `✓ ${syncMessage}`;
    showToast(syncMessage, "success");
    await renderQuestionBank();
    await refreshHubStats();
    playSound("click");
  } catch (err) {
    statusMsg.style.color = "var(--danger)";
    statusMsg.textContent = t("toasts.syncFailed", { error: err });
    showToast(t("toasts.syncFailed", { error: err }), "error");
  }
}

function handleLoadSampleTemplate() {
  const sample = [
    {
      "category": "science",
      "difficulty": "easy",
      "question": "What is the chemical symbol for Gold?",
      "options": ["Ag", "Au", "Fe", "Pb"],
      "correct": "B",
      "explanation": "Au comes from the Latin word 'aurum', meaning shining dawn."
    },
    {
      "category": "web",
      "difficulty": "medium",
      "question": "Which HTTP status code signifies 'Created'?",
      "code": "POST /api/items HTTP/1.1",
      "options": ["200", "201", "204", "301"],
      "correct": 1,
      "explanation": "201 Created indicates the request succeeded and a new resource was created."
    }
  ];

  document.getElementById("io-json-textarea").value = JSON.stringify(sample, null, 2);
  const statusMsg = document.getElementById("io-status-msg");
  statusMsg.style.color = "var(--text-muted)";
  statusMsg.textContent = t("modal.io.statusSampleLoaded");
  playSound("click");
}

let dragDropInitialized = false;
function setupJsonDragAndDrop() {
  if (dragDropInitialized) return;
  const textarea = document.getElementById("io-json-textarea");
  if (!textarea) return;

  ["dragenter", "dragover"].forEach((eventName) => {
    textarea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      textarea.style.borderColor = "var(--primary)";
      textarea.style.backgroundColor = "var(--bg-elevated)";
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    textarea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      textarea.style.borderColor = "";
      textarea.style.backgroundColor = "";
    });
  });

  textarea.addEventListener("drop", (e) => {
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        textarea.value = evt.target.result;
        const statusMsg = document.getElementById("io-status-msg");
        statusMsg.style.color = "var(--primary)";
        statusMsg.textContent = t("modal.io.statusFileDropped", { filename: file.name });
        showToast(t("toasts.fileLoaded", { filename: file.name }), "info");
        playSound("click");
      };
      reader.readAsText(file);
    }
  });

  dragDropInitialized = true;
}

function handleCopyJson() {
  const textarea = document.getElementById("io-json-textarea");
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => {
    showToast(t("toasts.jsonCopied"), "success");
    playSound("click");
  });
}

function handleDownloadJson() {
  const textarea = document.getElementById("io-json-textarea");
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(textarea.value);
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `quizmaster-questions-${Date.now()}.json`);
  dlAnchor.click();
  dlAnchor.remove();
  showToast(t("toasts.downloadInitiated"), "success");
  playSound("click");
}

async function handleResetDefaults() {
  const confirmed = await showAppConfirm({
    title: t("modal.io.restoreDefaults"),
    message: t("dialogs.confirmResetDefaults"),
    confirmLabel: t("modal.io.restoreDefaults"),
    danger: true
  });
  if (!confirmed) return;

  try {
    const count = await backendApi.resetDefaultQuestions();
    const updatedJson = await backendApi.exportQuestions();
    document.getElementById("io-json-textarea").value = updatedJson;
    showToast(t("toasts.restoredDefaults", { count }), "info");
    await renderQuestionBank();
    await refreshHubStats();
    playSound("click");
  } catch (err) {
    showToast(t("toasts.errorResetting", { error: err }), "error");
  }
}

/* ==========================================================================
   HISTORY CONTROLLER (RUST POWERED)
   ========================================================================== */
async function renderHistoryView() {
  const list = document.getElementById("history-items-list");
  const listSection = document.querySelector(".history-list-section");
  const clearBtn = document.getElementById("btn-clear-history");
  const statsCards = document.querySelector(".history-stats-cards");

  try {
    const history = await backendApi.getHistory();
    const totalAttempts = history.length;
    const isEmpty = totalAttempts === 0;

    document.getElementById("hist-total-attempts").textContent = totalAttempts;
    document.getElementById("hist-best-score").textContent = isEmpty ? "—" : `${Math.max(...history.map((h) => h.accuracy))}%`;
    document.getElementById("hist-avg-accuracy").textContent = isEmpty
      ? "—"
      : `${Math.round(history.reduce((a, b) => a + b.accuracy, 0) / totalAttempts)}%`;
    document.getElementById("hist-total-time").textContent = t("common.time.minutesOnly", {
      mins: isEmpty ? 0 : Math.round(history.reduce((a, b) => a + (b.durationSecs || 0), 0) / 60)
    });

    if (clearBtn) {
      clearBtn.disabled = isEmpty;
      clearBtn.classList.toggle("is-disabled", isEmpty);
      clearBtn.setAttribute("aria-disabled", String(isEmpty));
    }

    if (statsCards) {
      statsCards.classList.toggle("is-empty", isEmpty);
    }

    if (listSection) {
      listSection.classList.toggle("is-empty", isEmpty);
    }

    list.innerHTML = "";

    if (isEmpty) {
      list.innerHTML = `
        <div class="history-empty-state">
          <div class="history-empty-icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h4 class="history-empty-title">${escapeHtml(t("history.emptyTitle"))}</h4>
          <p class="history-empty-copy">${escapeHtml(t("history.empty"))}</p>
          <button type="button" class="btn btn-primary" id="btn-history-start-quiz">
            ${escapeHtml(t("history.emptyCta"))}
          </button>
        </div>
      `;

      document.getElementById("btn-history-start-quiz")?.addEventListener("click", () => {
        switchView("hub");
      });
      return;
    }

    history.forEach((entry) => {
      const card = document.createElement("div");
      card.className = "history-entry";

      const dateStr = new Date(entry.timestamp * 1000).toLocaleDateString(getLocale(), {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const mins = Math.floor(entry.durationSecs / 60);
      const secs = entry.durationSecs % 60;

      card.innerHTML = `
        <div class="history-entry-info">
          <div class="hist-entry-title">${escapeHtml(getCategoryLabel(entry.category))} (${escapeHtml(getModeLabel(entry.mode))})</div>
          <div class="hist-entry-meta">
            <span>📅 ${escapeHtml(dateStr)}</span>
            <span>⏱️ ${escapeHtml(t("common.time.minutesSeconds", { mins, secs }))}</span>
            <span>📋 ${escapeHtml(t("history.correctRatio", { correct: entry.correctCount, total: entry.totalQuestions }))}</span>
          </div>
        </div>
        <div class="history-entry-score">${entry.accuracy}%</div>
        <button
          type="button"
          class="btn-delete-entry"
          aria-label="${escapeHtml(t("history.deleteEntry"))}"
          data-id="${escapeHtml(entry.id)}"
          title="${escapeHtml(t("history.deleteEntry"))}"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path><path d="M14 11v6"></path>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
          </svg>
        </button>
      `;

      card.querySelector(".btn-delete-entry").addEventListener("click", (e) => {
        e.stopPropagation();
        deleteHistoryEntry(entry.id);
      });

      list.appendChild(card);
    });
  } catch (err) {
    showToast(t("toasts.errorLoadingHistory", { error: err }), "error");
  }
}

async function clearAllHistory() {
  const confirmed = await showAppConfirm({
    title: t("history.clear"),
    message: t("dialogs.confirmClearHistory"),
    confirmLabel: t("history.clear"),
    danger: true
  });
  if (!confirmed) return;

  try {
    await backendApi.clearHistory();
    await renderHistoryView();
    await refreshHubStats();
    showToast(t("toasts.historyCleared"), "info");
  } catch (err) {
    showToast(t("toasts.errorClearingHistory", { error: err }), "error");
  }
}

async function deleteHistoryEntry(id) {
  try {
    await backendApi.deleteHistoryEntry(id);
    await renderHistoryView();
    await refreshHubStats();
    showToast(t("toasts.historyEntryDeleted"), "info");
  } catch (err) {
    showToast(t("toasts.errorClearingHistory", { error: err }), "error");
  }
}

/* ==========================================================================
   HELPERS & KEYBOARD SHORTCUTS
   ========================================================================== */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function handleKeyDown(e) {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
    return;
  }

  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay:not(.hidden)").forEach((m) => m.classList.add("hidden"));
    return;
  }

  if (e.key === "?") {
    document.getElementById("modal-shortcuts")?.classList.toggle("hidden");
    return;
  }

  if (state.currentView === "quiz") {
    const key = e.key.toUpperCase();
    if (["1", "2", "3", "4"].includes(key)) {
      handleOptionSelected(parseInt(key, 10) - 1);
    } else if (["A", "B", "C", "D"].includes(key)) {
      handleOptionSelected(key.charCodeAt(0) - 65);
    } else if (e.key === "ArrowRight" || key === "J") {
      nextQuestion();
    } else if (e.key === "ArrowLeft" || key === "K") {
      prevQuestion();
    } else if (key === "F") {
      toggleFlagCurrentQuestion();
    } else if (key === "P") {
      openPaletteModal();
    }
  }
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
window.addEventListener("DOMContentLoaded", async () => {
  initI18n();
  initLanguageSelector();
  updateModeDescription();
  window.addEventListener("quizmaster:langchange", refreshDynamicContent);

  const savedSound = localStorage.getItem("qm_sound");
  if (savedSound !== null) state.soundEnabled = savedSound === "true";

  const savedTheme = localStorage.getItem("qm_theme");
  if (savedTheme) {
    state.theme = savedTheme;
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    state.theme = "dark";
  }

  applyTheme();
  applySoundUI();

  const backendIndicator = document.getElementById("backend-indicator");
  if (backendIndicator) {
    if (isTauri) {
      backendIndicator.textContent = t("app.backendRustNative");
      backendIndicator.title = t("app.backendRustNativeTooltip");
    } else {
      backendIndicator.textContent = t("app.backendBrowser");
      backendIndicator.title = t("app.backendBrowserTooltip");
    }
  }

  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      switchView(tab.dataset.view);
      playSound("click");
    });
  });

  document.getElementById("brand-logo")?.addEventListener("click", () => {
    switchView("hub");
    playSound("click");
  });

  document.getElementById("btn-shortcuts")?.addEventListener("click", () => {
    document.getElementById("modal-shortcuts").classList.remove("hidden");
    playSound("click");
  });
  document.getElementById("btn-sound")?.addEventListener("click", toggleSound);
  document.getElementById("btn-theme")?.addEventListener("click", toggleTheme);

  initHubControls();

  document.getElementById("btn-prev-q")?.addEventListener("click", prevQuestion);
  document.getElementById("btn-next-q")?.addEventListener("click", nextQuestion);
  document.getElementById("btn-clear-selection")?.addEventListener("click", clearCurrentSelection);
  document.getElementById("btn-flag-question")?.addEventListener("click", toggleFlagCurrentQuestion);
  document.getElementById("btn-open-palette")?.addEventListener("click", openPaletteModal);
  document.getElementById("btn-quit-quiz")?.addEventListener("click", async () => {
    const confirmed = await showAppConfirm({
      title: t("quiz.exitTooltip"),
      message: t("dialogs.confirmQuitQuiz"),
      confirmLabel: t("quiz.exitTooltip"),
      danger: true
    });
    if (confirmed) {
      clearInterval(state.activeQuiz.timerInterval);
      switchView("hub");
      playSound("click");
    }
  });
  document.getElementById("btn-submit-quiz")?.addEventListener("click", showConfirmSubmitModal);
  document.getElementById("palette-submit-btn")?.addEventListener("click", showConfirmSubmitModal);
  document.getElementById("btn-confirm-submit-action")?.addEventListener("click", finishAndSubmitQuiz);

  document.getElementById("btn-retake-all")?.addEventListener("click", () => {
    if (state.lastResults?.originalQuestions) {
      startQuizSession(state.lastResults.originalQuestions);
    }
  });

  document.getElementById("btn-retry-mistakes")?.addEventListener("click", () => {
    if (state.lastResults) {
      const wrongBreakdowns = state.lastResults.breakdowns.filter((b) => !b.isCorrect);
      const wrongQuestions = wrongBreakdowns.map((b) => {
        return {
          id: b.id,
          category: b.category,
          difficulty: b.difficulty,
          question: b.question,
          code: b.code,
          options: b.options,
          correct: b.correct,
          explanation: b.explanation
        };
      });
      startQuizSession(wrongQuestions);
    }
  });

  document.getElementById("btn-new-quiz-hub")?.addEventListener("click", () => {
    switchView("hub");
    playSound("click");
  });

  document.getElementById("btn-export-results")?.addEventListener("click", () => {
    if (!state.lastResults) return;
    const blob = new Blob([JSON.stringify(state.lastResults, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-results-${state.lastResults.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t("toasts.resultsExported"), "success");
    playSound("click");
  });

  document.querySelectorAll(".review-filters .filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".review-filters .filter-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderReviewList(tab.dataset.filter);
      playSound("click");
    });
  });

  document.getElementById("btn-add-question-modal")?.addEventListener("click", openAddQuestionModal);
  document.getElementById("btn-import-export-modal")?.addEventListener("click", openImportExportModal);
  document.getElementById("bank-search-input")?.addEventListener("input", renderQuestionBank);
  document.getElementById("bank-filter-category")?.addEventListener("change", renderQuestionBank);
  document.getElementById("bank-filter-difficulty")?.addEventListener("change", renderQuestionBank);

  document.getElementById("form-question-editor")?.addEventListener("submit", handleSaveQuestionForm);
  document.getElementById("edit-q-category")?.addEventListener("change", toggleNewCategoryInput);

  document.getElementById("btn-apply-import")?.addEventListener("click", () => handleApplyImport("append"));
  document.getElementById("btn-apply-replace")?.addEventListener("click", () => handleApplyImport("replace"));
  document.getElementById("btn-upload-json")?.addEventListener("click", () => document.getElementById("io-file-input")?.click());
  document.getElementById("io-file-input")?.addEventListener("change", handleFileInputChange);
  document.getElementById("btn-reload-file-json")?.addEventListener("click", handleReloadFileJson);
  document.getElementById("btn-sample-template")?.addEventListener("click", handleLoadSampleTemplate);
  document.getElementById("btn-copy-json")?.addEventListener("click", handleCopyJson);
  document.getElementById("btn-download-json")?.addEventListener("click", handleDownloadJson);
  document.getElementById("btn-reset-default-bank")?.addEventListener("click", handleResetDefaults);

  document.getElementById("btn-clear-history")?.addEventListener("click", clearAllHistory);

  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal;
      if (modalId) closeModal(modalId);
      playSound("click");
    });
  });

  window.addEventListener("keydown", handleKeyDown);

  await refreshHubStats();
});
