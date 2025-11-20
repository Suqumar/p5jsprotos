const defaultThemes = [
  {
    id: 'greetings',
    title: 'Greetings & Small Talk',
    description: 'Confidently introduce yourself and start any conversation.',
    builtIn: true,
    lessons: [
      {
        id: 'greet-1',
        title: 'Hello and Introductions',
        sentences: [
          { text: 'Hello! It is great to meet you.', hint: 'Friendly, upbeat greeting.' },
          { text: 'My name is Maya, what is yours?', hint: 'Introduce yourself and ask their name.' },
          { text: 'Where are you visiting from today?', hint: 'Great follow-up for travelers.' }
        ]
      },
      {
        id: 'greet-2',
        title: 'Checking In',
        sentences: [
          { text: 'How has your day been so far?', hint: 'Ask about their day.' },
          { text: 'Would you like to grab a coffee sometime?', hint: 'Friendly invitation.' },
          { text: 'Let us stay in touch after this event.', hint: 'Closing statement.' }
        ]
      }
    ]
  },
  {
    id: 'travel',
    title: 'Travel Helpers',
    description: 'Handle airports, hotels, and help requests on the go.',
    builtIn: true,
    lessons: [
      {
        id: 'travel-1',
        title: 'Airport Basics',
        sentences: [
          { text: 'Where can I check my luggage?', hint: 'Ask airline staff politely.' },
          { text: 'What time does boarding begin for this flight?', hint: 'Confirm schedule.' },
          { text: 'Could you help me find my gate, please?', hint: 'Request assistance.' }
        ]
      },
      {
        id: 'travel-2',
        title: 'Hotel Conversations',
        sentences: [
          { text: 'I have a reservation for tonight.', hint: 'Check-in phrase.' },
          { text: 'Could you recommend a nearby restaurant?', hint: 'Ask concierge for help.' },
          { text: 'Is breakfast included with the stay?', hint: 'Confirm amenities.' }
        ]
      }
    ]
  },
  {
    id: 'questions',
    title: 'Everyday Questions',
    description: 'Ask and answer polite questions in daily life.',
    builtIn: true,
    lessons: [
      {
        id: 'quest-1',
        title: 'Curiosity Sparks',
        sentences: [
          { text: 'What inspired you to learn English?', hint: 'Encourage a deeper response.' },
          { text: 'How often do you practice speaking?', hint: 'Understand their routine.' },
          { text: 'Which topics are the most fun for you?', hint: 'Learn their interests.' }
        ]
      }
    ]
  }
];

const DB_NAME = 'justSpeakDB';
const DB_VERSION = 1;
const STORES = {
  themes: 'themes',
  progress: 'progress',
  settings: 'settings',
  stats: 'stats'
};

class ProgressStore {
  constructor() {
    this.dbPromise = this.open();
  }

  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        Object.values(STORES).forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(store, id) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const request = tx.objectStore(store).get(id);
      request.onsuccess = () => resolve(request.result?.value ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  async set(store, id, value) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put({ id, value });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }
}

const store = new ProgressStore();
const state = {
  themes: [],
  progress: {},
  stats: {
    attempts: 0,
    successes: 0,
    minutes: 0,
    streak: 0,
    history: []
  },
  settings: {
    voiceRate: 1,
    voice: '',
    autoAdvance: true,
    autoHint: true,
    soundEffects: true,
    defaultInput: 'voice'
  },
  currentTheme: null,
  currentLesson: null,
  currentSentenceIndex: 0,
  activeView: 'practice'
};

const views = [
  'dashboardView',
  'themesView',
  'lessonsView',
  'practiceView',
  'statisticsView',
  'lessonManagerView',
  'settingsView'
];

function showView(id) {
  views.forEach((viewId) => {
    const el = document.getElementById(viewId);
    if (!el) return;
    el.classList.toggle('active', viewId === id);
  });
  state.activeView = id;
}

function toast(message) {
  const toastEl = document.getElementById('toast');
  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), 2500);
}

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'ig');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

async function bootstrapThemes() {
  const saved = await store.get(STORES.themes, 'all');
  if (saved) {
    state.themes = saved;
  } else {
    state.themes = defaultThemes;
    await store.set(STORES.themes, 'all', state.themes);
  }
}

async function bootstrapProgress() {
  state.progress = (await store.get(STORES.progress, 'all')) || {};
  state.stats = (await store.get(STORES.stats, 'main')) || state.stats;
  state.settings = Object.assign(
    {},
    state.settings,
    (await store.get(STORES.settings, 'user')) || {}
  );
}

// breadcrumb removed completely

function getLessonProgress(themeId, lessonId) {
  const themeProgress = state.progress[themeId] || {};
  return (
    themeProgress[lessonId] || {
      completed: false,
      sentences: {},
      attempts: 0,
      successes: 0
    }
  );
}

function setLessonProgress(themeId, lessonId, data) {
  state.progress[themeId] = state.progress[themeId] || {};
  state.progress[themeId][lessonId] = data;
  store.set(STORES.progress, 'all', state.progress);
}

function nextUnfinishedLesson() {
  for (const theme of state.themes) {
    for (const lesson of theme.lessons) {
      const progress = getLessonProgress(theme.id, lesson.id);
      if (!progress.completed) {
        return { theme, lesson };
      }
    }
  }
  // default fallback
  return { theme: state.themes[0], lesson: state.themes[0].lessons[0] };
}

function openDashboard() {
  renderDashboard();
  showView('dashboardView');
}

function openThemes() {
  renderThemes();
  showView('themesView');
}

function openLessons(themeId) {
  const theme = state.themes.find((t) => t.id === themeId);
  if (!theme) return;
  state.currentTheme = theme;
  renderLessons(theme);
  showView('lessonsView');
}

function openPractice(themeId, lessonId) {
  const theme = state.themes.find((t) => t.id === themeId) || state.themes[0];
  const lesson = theme.lessons.find((l) => l.id === lessonId) || theme.lessons[0];
  state.currentTheme = theme;
  state.currentLesson = lesson;
  state.currentSentenceIndex = 0;
  renderPractice();
  showView('practiceView');
}

function renderThemes(filter = '') {
  const list = document.getElementById('themeList');
  const query = filter.trim().toLowerCase();
  list.innerHTML = '';
  state.themes.forEach((theme) => {
    const matchesTheme = theme.title.toLowerCase().includes(query);
    const themeCard = document.createElement('div');
    themeCard.className = 'theme-card';
    const lessonsMatches = theme.lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(query)
    );
    if (query && !matchesTheme && lessonsMatches.length === 0) {
      return;
    }
    const progressCount = theme.lessons.filter((lesson) =>
      getLessonProgress(theme.id, lesson.id).completed
    ).length;
    themeCard.innerHTML = `
      <div>
        <p class="text-sm uppercase tracking-[0.2em] opacity-60">
          ${theme.builtIn ? 'Built-in' : 'Custom'} Theme
        </p>
        <h3>${highlight(theme.title, query)}</h3>
        <p class="opacity-75">${theme.description}</p>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="progress-bar small"><div style="width:${
          (progressCount / theme.lessons.length) * 100
        }%"></div></div>
        <span class="text-sm opacity-80">${progressCount}/${theme.lessons.length} lessons</span>
      </div>
      <button class="primary-btn" data-theme="${theme.id}">Open Theme</button>
    `;
    if (query && lessonsMatches.length) {
      const lessonMatchesHtml = lessonsMatches
        .map((lesson) => `<p class="text-sm">• ${highlight(lesson.title, query)}</p>`)
        .join('');
      themeCard.innerHTML += `<div class="mt-2 text-sm opacity-70">${lessonMatchesHtml}</div>`;
    }
    list.appendChild(themeCard);
  });
  list.querySelectorAll('button[data-theme]').forEach((btn) =>
    btn.addEventListener('click', (e) => openLessons(e.currentTarget.dataset.theme))
  );
}

function renderLessons(theme, filter = '') {
  document.getElementById('lessonsThemeTitle').textContent = theme.title;
  document.getElementById('lessonsThemeDescription').textContent = theme.description;
  const list = document.getElementById('lessonsList');
  const query = filter.trim().toLowerCase();
  list.innerHTML = '';
  theme.lessons.forEach((lesson) => {
    if (query && !lesson.title.toLowerCase().includes(query)) return;
    const progress = getLessonProgress(theme.id, lesson.id);
    const completion = progress.completed ? 'Completed' : 'In Progress';
    const percent =
      (Object.keys(progress.sentences || {}).length / lesson.sentences.length) * 100 || 0;
    const row = document.createElement('div');
    row.className = 'lesson-row';
    row.innerHTML = `
      <div>
        <p class="text-xs uppercase tracking-[0.3em] opacity-60">Lesson</p>
        <h3 class="text-lg font-semibold">${highlight(lesson.title, query)}</h3>
        <p class="text-sm opacity-70">${completion}</p>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="progress-bar small"><div style="width:${percent}%"></div></div>
        <span class="badge">${Math.round(percent)}%</span>
        <button class="primary-btn" data-lesson="${lesson.id}">Practice</button>
      </div>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('button[data-lesson]').forEach((btn) =>
    btn.addEventListener('click', (e) => openPractice(theme.id, e.currentTarget.dataset.lesson))
  );
}

function renderPractice() {
  const lesson = state.currentLesson;
  if (!lesson) return;
  const sentence = lesson.sentences[state.currentSentenceIndex];
  document.getElementById('practiceTitle').textContent = lesson.title;
  document.getElementById('practiceSubtitle').textContent = `${
    state.currentSentenceIndex + 1
  } / ${lesson.sentences.length}`;
  document.getElementById('sentenceText').textContent = sentence.text;
  document.getElementById('hintText').textContent = sentence.hint;
  if (state.settings.autoHint) {
    document.getElementById('hintText').classList.remove('hidden');
  } else {
    document.getElementById('hintText').classList.add('hidden');
  }
  document.getElementById('textInput').value = '';
  document.getElementById('attemptCount').textContent = state.stats.attempts;
  document.getElementById('successCount').textContent = state.stats.successes;
  const accuracy = state.stats.attempts
    ? Math.round((state.stats.successes / state.stats.attempts) * 100)
    : 0;
  document.getElementById('accuracyPercent').textContent = `${accuracy}%`;

  const progress = getLessonProgress(state.currentTheme.id, lesson.id);
  const completedSentences = Object.keys(progress.sentences || {}).length;
  document.getElementById('lessonProgressBar').style.width = `${
    (completedSentences / lesson.sentences.length) * 100
  }%`;

  const defaultInput = state.settings.defaultInput;
  toggleInput(defaultInput === 'voice');
}

function toggleInput(forceVoice) {
  const voicePanel = document.getElementById('voiceInput');
  const textArea = document.getElementById('textInput');
  if (forceVoice) {
    voicePanel.classList.remove('hidden');
    textArea.classList.add('hidden');
  } else {
    voicePanel.classList.add('hidden');
    textArea.classList.remove('hidden');
  }
}

function updateDashboard() {
  const lessonsTotal = state.themes.reduce((acc, theme) => acc + theme.lessons.length, 0);
  const lessonsCompleted = state.themes.reduce(
    (acc, theme) =>
      acc +
      theme.lessons.filter((lesson) => getLessonProgress(theme.id, lesson.id).completed).length,
    0
  );
  const sentencesMastered = state.themes.reduce((acc, theme) => {
    return (
      acc +
      theme.lessons.reduce(
        (lAcc, lesson) =>
          lAcc + Object.keys(getLessonProgress(theme.id, lesson.id).sentences || {}).length,
        0
      )
    );
  }, 0);
  const percent = lessonsTotal ? Math.round((lessonsCompleted / lessonsTotal) * 100) : 0;
  document.getElementById('overallProgressText').textContent = `${percent}%`;
  document.getElementById('overallProgressBar').style.width = `${percent}%`;
  document.getElementById('dashboardLessons').textContent = lessonsCompleted;
  document.getElementById('dashboardSentences').textContent = sentencesMastered;
  document.getElementById('dashboardStreak').textContent = `${state.stats.streak}🔥`;
  const accuracy = state.stats.attempts
    ? Math.round((state.stats.successes / state.stats.attempts) * 100)
    : 0;
  document.getElementById('dashboardAccuracy').textContent = `${accuracy}%`;
  document.getElementById('dashboardMinutes').textContent = state.stats.minutes;
}

function renderDashboard() {
  updateDashboard();
}

function renderStatistics() {
  document.getElementById('statAttempts').textContent = state.stats.attempts;
  document.getElementById('statSuccesses').textContent = state.stats.successes;
  const accuracy = state.stats.attempts
    ? Math.round((state.stats.successes / state.stats.attempts) * 100)
    : 0;
  document.getElementById('statAccuracy').textContent = `${accuracy}%`;
  document.getElementById('statMinutes').textContent = `${state.stats.minutes} min`;
  document.getElementById('statStreak').textContent = `${state.stats.streak}🔥`;
  drawChart();
}

function drawChart() {
  const canvas = document.getElementById('progressChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const points = state.stats.history.slice(-10);
  if (!points.length) {
    ctx.fillStyle = 'rgba(148,163,184,0.5)';
    ctx.font = '14px Inter';
    ctx.fillText('Start practicing to see trends 📈', 10, 30);
    return;
  }
  const maxVal = Math.max(...points.map((p) => p.value));
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = (canvas.width / (points.length - 1 || 1)) * index;
    const y = canvas.height - (point.value / maxVal) * (canvas.height - 20) - 10;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function renderLessonManager() {
  const container = document.getElementById('lessonManagerList');
  container.innerHTML = '';
  state.themes.forEach((theme) => {
    const section = document.createElement('div');
    section.className = 'mini-card';
    const lessonsList = theme.lessons
      .map(
        (lesson) => `
      <li class="flex justify-between text-sm">
        <span>${lesson.title}</span>
        <span class="opacity-60">${lesson.sentences.length} sentences</span>
      </li>
    `
      )
      .join('');
    section.innerHTML = `
      <div class="flex justify-between items-center flex-wrap gap-3">
        <div>
          <p class="mini-title">${theme.builtIn ? 'Built-in' : 'Custom'}</p>
          <h4 class="font-semibold">${theme.title}</h4>
        </div>
        ${
          theme.builtIn
            ? ''
            : '<button class="secondary-btn danger" data-remove="' + theme.id + '">Remove</button>'
        }
      </div>
      <ul class="mt-3 space-y-2">${lessonsList}</ul>
    `;
    container.appendChild(section);
  });
  container.querySelectorAll('button[data-remove]').forEach((btn) =>
    btn.addEventListener('click', (e) => removeTheme(e.currentTarget.dataset.remove))
  );
}

function removeTheme(themeId) {
  state.themes = state.themes.filter((t) => t.id !== themeId);
  store.set(STORES.themes, 'all', state.themes);
  renderLessonManager();
  renderThemes(document.getElementById('themeSearch').value || '');
}

function renderSettings() {
  document.getElementById('voiceRate').value = state.settings.voiceRate;
  document.getElementById('autoAdvance').checked = state.settings.autoAdvance;
  document.getElementById('autoHint').checked = state.settings.autoHint;
  document.getElementById('soundEffects').checked = state.settings.soundEffects;
  document.getElementById('defaultInput').value = state.settings.defaultInput;

  const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  const variantSelect = document.getElementById('voiceVariant');
  variantSelect.innerHTML = voices
    .map((voice) => `<option value="${voice.name}">${voice.name}</option>`)
    .join('');
  variantSelect.value = state.settings.voice || voices[0]?.name || '';
  renderSupportCheck();
}

function renderSupportCheck() {
  const list = document.getElementById('supportList');
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const items = [
    { label: 'Speech Recognition', supported: Boolean(recognition) },
    { label: 'Speech Synthesis', supported: Boolean(window.speechSynthesis) },
    { label: 'Media Recorder', supported: Boolean(window.MediaRecorder) },
    { label: 'IndexedDB', supported: Boolean(window.indexedDB) }
  ];
  list.innerHTML = items
    .map(
      (item) => `
      <li class="flex justify-between">
        <span>${item.label}</span>
        <span class="${item.supported ? 'text-emerald-300' : 'text-rose-400'}">
          ${item.supported ? 'Ready' : 'Unavailable'}
        </span>
      </li>
    `
    )
    .join('');
}

function speakSentence(text) {
  if (!window.speechSynthesis) {
    toast('Speech synthesis is not supported in this browser.');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = state.settings.voiceRate || 1;
  const voices = speechSynthesis.getVoices() || [];
  const voice = voices.find((v) => v.name === state.settings.voice);
  if (voice) utterance.voice = voice;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function handleHint() {
  const hint = document.getElementById('hintText');
  hint.classList.toggle('hidden');
  if (!hint.classList.contains('hidden')) {
    const progress = getLessonProgress(state.currentTheme.id, state.currentLesson.id);
    progress.hints = (progress.hints || 0) + 1;
    setLessonProgress(state.currentTheme.id, state.currentLesson.id, progress);
  }
}

function submitSentence() {
  const lesson = state.currentLesson;
  if (!lesson) return;

  const sentence = lesson.sentences[state.currentSentenceIndex];
  const textInputEl = document.getElementById('textInput');
  const voicePanel = document.getElementById('voiceInput');

  const userInput = textInputEl.value.trim();
  const isVoiceMode = !voicePanel.classList.contains('hidden');

  if (!userInput) {
    if (isVoiceMode) {
      toast('Speak your response or switch to text input.');
    } else {
      toast('Type your response or switch to voice input.');
    }
    return;
  }

  state.stats.attempts += 1;
  state.stats.minutes = (state.stats.minutes || 0) + 1;
  state.stats.streak = Math.max(state.stats.streak || 0, 1);

  const normalizedAnswer = sentence.text.replace(/[^a-z]/gi, '').toLowerCase();
  const normalizedInput = userInput.replace(/[^a-z]/gi, '').toLowerCase();

 const similarity = wordSimilarity(sentence.text, userInput);

// Voice mode threshold can be lower
const threshold = isVoiceMode ? 0.65 : 0.80;

const correct = similarity >= threshold;

  if (correct) {
    state.stats.successes += 1;
    markSentenceComplete();
    toast('Great job!');
    if (state.settings.autoAdvance) {
      setTimeout(nextSentence, 600);
    }
  } else {
    toast('Keep trying – compare with the sentence.');
  }

  persistStats();
  renderPractice();
  renderStatistics();
  updateDashboard();
}

function markSentenceComplete() {
  const lesson = state.currentLesson;
  const index = state.currentSentenceIndex;
  const progress = getLessonProgress(state.currentTheme.id, lesson.id);

  if (!progress.sentences) progress.sentences = {};
  progress.sentences[index] = true;

  if (Object.keys(progress.sentences).length === lesson.sentences.length) {
    progress.completed = true;
    openCelebration();
  }
  setLessonProgress(state.currentTheme.id, lesson.id, progress);
}

function nextSentence() {
  const lesson = state.currentLesson;
  if (!lesson) return;

  if (state.currentSentenceIndex < lesson.sentences.length - 1) {
    state.currentSentenceIndex += 1;
    renderPractice();
  } else {
    completeLesson();
  }
}

function prevSentence() {
  if (state.currentSentenceIndex === 0) return;
  state.currentSentenceIndex -= 1;
  renderPractice();
}

function skipSentence() {
  nextSentence();
}

function completeLesson() {
  openCelebration();
}

function openCelebration() {
  const modal = document.getElementById('celebrationModal');
  const lesson = state.currentLesson;
  if (!lesson) return;
  modal.classList.remove('hidden');
  document.getElementById('celebrationText').textContent = `${lesson.title} complete! We will load the next lesson automatically.`;
}

function closeCelebration() {
  document.getElementById('celebrationModal').classList.add('hidden');
}

function loadNextLesson() {
  closeCelebration();
  const { theme, lesson } = findNextLessonAfter(state.currentTheme.id, state.currentLesson.id);
  openPractice(theme.id, lesson.id);
}

function findNextLessonAfter(themeId, lessonId) {
  const themeIndex = state.themes.findIndex((t) => t.id === themeId);
  const theme = state.themes[themeIndex];
  const lessonIndex = theme.lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex < theme.lessons.length - 1) {
    return { theme, lesson: theme.lessons[lessonIndex + 1] };
  }
  const nextTheme = state.themes[(themeIndex + 1) % state.themes.length];
  return { theme: nextTheme, lesson: nextTheme.lessons[0] };
}

function persistStats() {
  state.stats.history.push({ value: state.stats.successes, timestamp: Date.now() });
  // Trim history to avoid unbounded growth
  if (state.stats.history.length > 500) {
    state.stats.history = state.stats.history.slice(-500);
  }
  store.set(STORES.stats, 'main', state.stats);
}

function handleNav(e) {
  const navTarget = e.target.closest('[data-nav]');
  if (!navTarget) return;
  const target = navTarget.dataset.nav;
  switch (target) {
    case 'practice':
      if (state.currentTheme && state.currentLesson) {
        openPractice(state.currentTheme.id, state.currentLesson.id);
      } else {
        const { theme, lesson } = nextUnfinishedLesson();
        openPractice(theme.id, lesson.id);
      }
      break;
    case 'themes':
      openThemes();
      break;
    case 'dashboard':
      openDashboard();
      break;
    case 'settings':
      renderSettings();
      showView('settingsView');
      break;
    case 'statistics':
      renderStatistics();
      showView('statisticsView');
      break;
    case 'lessonManager':
      renderLessonManager();
      showView('lessonManagerView');
      break;
    default:
      break;
  }
}

document.addEventListener('click', handleNav);

document.getElementById('themeSearch').addEventListener('input', (e) =>
  renderThemes(e.target.value)
);

document.getElementById('lessonSearch').addEventListener('input', (e) => {
  if (!state.currentTheme) return;
  renderLessons(state.currentTheme, e.target.value);
});

document.getElementById('listenBtn').addEventListener('click', () => {
  const sentence = state.currentLesson.sentences[state.currentSentenceIndex];
  speakSentence(sentence.text);
});

const toggleBtn = document.getElementById('toggleInputBtn');
toggleBtn.addEventListener('click', () => {
  const voicePanel = document.getElementById('voiceInput');
  const useVoice = voicePanel.classList.contains('hidden');
  toggleInput(useVoice);
});

document.getElementById('hintBtn').addEventListener('click', handleHint);

document.getElementById('submitSentence').addEventListener('click', submitSentence);

document.getElementById('skipSentence').addEventListener('click', skipSentence);

document.getElementById('prevSentence').addEventListener('click', prevSentence);

// Global timer used to debounce auto-submit
let autoSubmitTimer = null;

document.getElementById('micBtn').addEventListener('click', () => {
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!recognition) {
    toast('Speech recognition is unavailable in this browser.');
    return;
  }

  const recognizer = new recognition();
  recognizer.lang = 'en-US';

   // ⭐ REQUIRED FOR FINAL RESULT TO FIRE ⭐
  recognizer.continuous = false;
  recognizer.interimResults = false;
  
  recognizer.start();

  recognizer.onresult = (event) => {
  const transcript = (event.results[0][0].transcript || '').trim();

  const textInput = document.getElementById('textInput');
  textInput.value = transcript;

  // ⭐ Show what was recognized ⭐
  document.getElementById('voiceTranscript').textContent = transcript;

  if (transcript.length < 3) {
    toast("Didn't catch that, please try again.");
    return;
  }

  clearTimeout(autoSubmitTimer);

  autoSubmitTimer = setTimeout(() => {
    submitSentence();
  }, 300);
};


  recognizer.onerror = () => toast('Voice capture failed. Please try again.');
});


document.getElementById('nextLessonBtn').addEventListener('click', loadNextLesson);

document.getElementById('closeModalBtn').addEventListener('click', closeCelebration);

document.getElementById('voiceRate').addEventListener('input', (e) => {
  state.settings.voiceRate = Number(e.target.value);
  store.set(STORES.settings, 'user', state.settings);
});

document.getElementById('voiceVariant').addEventListener('change', (e) => {
  state.settings.voice = e.target.value;
  store.set(STORES.settings, 'user', state.settings);
});

document.getElementById('autoAdvance').addEventListener('change', (e) => {
  state.settings.autoAdvance = e.target.checked;
  store.set(STORES.settings, 'user', state.settings);
});

document.getElementById('autoHint').addEventListener('change', (e) => {
  state.settings.autoHint = e.target.checked;
  store.set(STORES.settings, 'user', state.settings);
  renderPractice();
});

document.getElementById('soundEffects').addEventListener('change', (e) => {
  state.settings.soundEffects = e.target.checked;
  store.set(STORES.settings, 'user', state.settings);
});

document.getElementById('defaultInput').addEventListener('change', (e) => {
  state.settings.defaultInput = e.target.value;
  store.set(STORES.settings, 'user', state.settings);
  toggleInput(e.target.value === 'voice');
});

document.getElementById('previewVoiceBtn').addEventListener('click', () => {
  speakSentence('This is how your lessons will sound.');
});

function exportData(type = 'all') {
  const payload = {
    generatedAt: new Date().toISOString(),
    themes: state.themes,
    progress: state.progress,
    stats: state.stats,
    settings: state.settings
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `just-speak-${type}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(files) {
  const file = files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const payload = JSON.parse(event.target.result);
      if (payload.themes) state.themes = payload.themes;
      if (payload.progress) state.progress = payload.progress;
      if (payload.stats) state.stats = payload.stats;
      if (payload.settings) state.settings = payload.settings;
      store.set(STORES.themes, 'all', state.themes);
      store.set(STORES.progress, 'all', state.progress);
      store.set(STORES.stats, 'main', state.stats);
      store.set(STORES.settings, 'user', state.settings);
      toast('Import successful.');
      renderThemes();
      renderLessonManager();
      renderSettings();
      renderStatistics();
    } catch (error) {
      toast('Import failed: invalid JSON');
    }
  };
  reader.readAsText(file);
}

function resetProgress() {
  state.progress = {};
  state.stats = { attempts: 0, successes: 0, minutes: 0, streak: 0, history: [] };
  store.set(STORES.progress, 'all', state.progress);
  store.set(STORES.stats, 'main', state.stats);
  toast('Progress reset. Start fresh!');
  renderThemes();
  renderStatistics();
  updateDashboard();
}

document.getElementById('exportAllBtn').addEventListener('click', () => exportData('all'));

document
  .getElementById('exportProgressBtn')
  .addEventListener('click', () => exportData('progress'));

document.getElementById('exportDataBtn').addEventListener('click', () => exportData('backup'));

document.getElementById('importInput').addEventListener('change', (e) => importData(e.target.files));

document.getElementById('resetProgressBtn').addEventListener('click', resetProgress);

async function init() {
  await bootstrapThemes();
  await bootstrapProgress();
  const { theme, lesson } = nextUnfinishedLesson();
  state.currentTheme = theme;
  state.currentLesson = lesson;
  renderThemes();
  renderDashboard();
  renderSettings();
  renderStatistics();
  renderLessonManager();
  openPractice(theme.id, lesson.id);
}

window.addEventListener('load', () => {
  if (window.speechSynthesis && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = renderSettings;
  }
  init();
});

function levenshtein(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function stringSimilarity(a, b) {
  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - distance / maxLen;
}

function wordSimilarity(expected, actual) {
  const clean = (s) =>
    s.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);

  const expWords = clean(expected);
  const actWords = clean(actual);

  let matches = 0;

  expWords.forEach((w, i) => {
    if (actWords[i] && levenshtein(w, actWords[i]) <= 2) {
      matches++;
    }
  });

  return matches / expWords.length;
}

