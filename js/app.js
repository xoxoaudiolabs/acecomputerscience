/* Ace Computer Science: UI, routing and progress tracking. */
(function () {
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LANG_LABEL = { python: 'Python', javascript: 'JavaScript', sql: 'SQL' };
  const CM_MODE = { python: 'python', javascript: 'javascript', sql: 'text/x-sql' };

  /* ---------- curriculum index ---------- */
  const LESSONS = [];
  CURRICULUM.forEach((unit, ui) => {
    unit.lessons.forEach((lesson, li) => {
      lesson.unit = unit;
      lesson.number = ui + 1 + '.' + (li + 1);
      lesson.lab.lang = unit.lang;
      lesson.lab.lesson = lesson;
      LESSONS.push(lesson);
    });
  });
  const lessonById = (id) => LESSONS.find((l) => l.id === id);
  const labById = (id) => (LESSONS.find((l) => l.lab.id === id) || {}).lab;

  /* ---------- progress (saved in this browser) ---------- */
  const STORE_KEY = 'ace-cs-progress-v1';
  let progress = { quiz: {}, labs: {}, playground: {}, cards: {}, tests: [], game: { xp: 0, streak: 0, lastDay: null } };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved) progress = Object.assign(progress, saved);
  } catch (e) { /* storage unavailable: progress lasts for this visit only */ }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* ignore */ }
  }
  /* ---------- XP, levels and daily streak ---------- */
  const dayKey = (d) => { d = d || new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
  function levelInfo(xp) {
    let level = 1;
    for (let i = 1; i < XP_THRESHOLDS.length; i++) { if (xp >= XP_THRESHOLDS[i]) level = i + 1; else break; }
    const cur = XP_THRESHOLDS[level - 1];
    const next = level < XP_THRESHOLDS.length ? XP_THRESHOLDS[level] : null;
    return { level, into: xp - cur, span: next ? next - cur : 0, max: next === null, total: xp };
  }
  function currentStreak() {
    const g = progress.game;
    const y = new Date(); y.setDate(y.getDate() - 1);
    return g.lastDay === dayKey() || g.lastDay === dayKey(y) ? g.streak : 0;
  }
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }
  function addXp(amount) {
    const g = progress.game;
    const before = levelInfo(g.xp).level;
    const today = dayKey();
    if (g.lastDay !== today) {
      g.streak = currentStreak() + 1;
      g.lastDay = today;
      if (g.streak > 1) toast(g.streak + ' day streak!');
    }
    g.xp += amount;
    save();
    const after = levelInfo(g.xp).level;
    if (after > before) toast('Level up! You reached level ' + after);
    renderLevel();
  }
  function renderLevel() {
    const el = $('#levelBox');
    if (!el) return;
    const li = levelInfo(progress.game.xp);
    el.innerHTML = '<div class="level-row"><b>Lv.' + li.level + '</b><span>' + (li.max ? li.total + ' XP' : li.into + '/' + li.span + ' XP') + '</span><span class="streak" title="Daily streak">🔥 ' + currentStreak() + '</span></div>' +
      '<div class="bar xp"><i style="width:' + (li.max ? 100 : Math.round((li.into / li.span) * 100)) + '%"></i></div>';
  }

  const labState = (id) => progress.labs[id] || (progress.labs[id] = { passed: false, attempts: 0 });
  const quizDone = (l) => l.quiz.every((_, i) => (progress.quiz[l.id] || [])[i]);
  const labDone = (l) => !!(progress.labs[l.lab.id] && progress.labs[l.lab.id].passed);
  const lessonDone = (l) => quizDone(l) && labDone(l);
  const steps = (lessons) => lessons.reduce((n, l) => n + (quizDone(l) ? 1 : 0) + (labDone(l) ? 1 : 0), 0);
  const pct = (lessons) => Math.round((steps(lessons) / (lessons.length * 2)) * 100);
  const nextLesson = () => LESSONS.find((l) => !lessonDone(l));

  /* ---------- editor + output helpers ---------- */
  function makeEditor(parent, lang, value, opts) {
    opts = opts || {};
    const indent = lang === 'python' ? 4 : 2;
    return CodeMirror(parent, {
      value: value,
      mode: CM_MODE[lang],
      theme: 'material-darker',
      lineNumbers: opts.lineNumbers !== false,
      indentUnit: indent,
      tabSize: indent,
      matchBrackets: true,
      autoCloseBrackets: true,
      lineWrapping: lang === 'sql',
      viewportMargin: opts.autoHeight ? Infinity : 10,
      extraKeys: {
        Tab: (cm) => (cm.somethingSelected() ? cm.indentSelection('add') : cm.replaceSelection(' '.repeat(indent), 'end')),
        'Shift-Tab': (cm) => cm.indentSelection('subtract'),
        'Ctrl-Enter': () => opts.onRun && opts.onRun(),
        'Cmd-Enter': () => opts.onRun && opts.onRun(),
        'Ctrl-/': 'toggleComment',
        'Cmd-/': 'toggleComment',
      },
    });
  }

  function tableHTML(t) {
    const MAX = 200;
    const head = '<tr>' + t.columns.map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr>';
    const body = t.values.slice(0, MAX).map((r) => '<tr>' + r.map((v) => '<td>' + (v === null ? '<i>NULL</i>' : esc(v)) + '</td>').join('') + '</tr>').join('');
    const more = t.values.length > MAX ? '<div class="muted small">Showing the first ' + MAX + ' of ' + t.values.length + ' rows.</div>' : '';
    return '<div class="result-table"><table>' + head + body + '</table></div><div class="muted small">' + t.values.length + ' row' + (t.values.length === 1 ? '' : 's') + '</div>' + more;
  }

  function renderResult(el, res, lang) {
    let html = '';
    if (res.out) html += '<pre class="out">' + esc(res.out) + '</pre>';
    (res.tables || []).forEach((t) => (html += tableHTML(t)));
    if (res.err) html += '<pre class="err">' + esc(res.err) + '</pre>';
    if (!html) html = '<div class="muted">' + (lang === 'sql' ? 'The SQL ran, but it did not return any rows.' : 'The program ran, but it did not print anything.') + '</div>';
    el.innerHTML = html;
  }

  async function execute(lang, payload, outEl, btn) {
    if (btn) btn.disabled = true;
    outEl.hidden = false;
    outEl.innerHTML = '<div class="muted status">Running…</div>';
    const res = await Runners.run(lang, payload, (msg) => {
      const s = $('.status', outEl);
      if (s) s.textContent = msg;
    });
    if (btn) btn.disabled = false;
    return res;
  }

  /* ---------- sidebar ---------- */
  function renderSidebar(activeLessonId) {
    const route = location.hash || '#/';
    const link = (hash, label) => '<a class="nav-link' + ((hash === '#/' ? route === '#/' || route === '' : route.startsWith(hash)) ? ' active' : '') + '" href="' + hash + '">' + label + '</a>';
    $('#sidebar').innerHTML =
      '<a class="brand" href="#/"><span class="logo">&gt;_</span><span>Ace<br><b>Computer Science</b></span></a>' +
      '<div class="overall" id="levelBox"></div>' +
      '<div class="nav-scroll">' +
      link('#/', 'Home') + link('#/flashcards', 'Flashcards') + link('#/practice', 'Practice Test') + link('#/games', 'Games') +
      link('#/glossary', 'Glossary') + link('#/stats', 'Stats') + link('#/playground', 'Playground') +
      '<div class="nav-heading">Course and labs</div>' +
      CURRICULUM.map((u, i) =>
        '<div class="nav-unit"><div class="nav-unit-title"><span>Unit ' + (i + 1) + '</span>' + esc(u.title) + '</div>' +
        u.lessons.map((l) =>
          '<a class="nav-lesson' + (l.id === activeLessonId ? ' active' : '') + '" href="#/lesson/' + l.id + '">' +
          '<span class="dot ' + (lessonDone(l) ? 'done' : quizDone(l) || labDone(l) ? 'half' : '') + '"></span>' + esc(l.title) + '</a>'
        ).join('') + '</div>'
      ).join('') +
      '</div>';
    renderLevel();
  }

  /* ---------- dashboard ---------- */
  function viewDashboard() {
    renderSidebar();
    const next = nextLesson();
    const done = steps(LESSONS);
    const overall = pct(LESSONS);
    const labsPassed = LESSONS.filter(labDone).length;
    $('#main').innerHTML =
      '<div class="page">' +
      '<header class="hero"><div><h1>' + (done ? 'Welcome back' : 'Learn to code by coding') + '</h1>' +
      '<p>' + LESSONS.length + ' short lessons, each with a quiz and a live coding lab that runs and checks your code right here in the browser.</p>' +
      (next
        ? '<a class="btn primary big" href="#/lesson/' + next.id + '">' + (done ? 'Continue' : 'Start') + ': ' + esc(next.title) + ' →</a>'
        : '<div class="banner ok">You have finished every lesson and lab. Try your own ideas in the <a href="#/playground">Playground</a>.</div>') +
      '<div class="quick"><a class="btn" href="#/flashcards">Study flashcards</a><a class="btn" href="#/practice">Take a practice test</a><a class="btn" href="#/games">Play a game</a></div>' +
      '</div><div class="stats"><div><b>' + overall + '%</b><span>complete</span></div><div><b>' + labsPassed + '/' + LESSONS.length + '</b><span>labs passed</span></div></div></header>' +
      '<div class="units">' +
      CURRICULUM.map((u, i) => {
        const p = pct(u.lessons);
        return '<section class="unit-card"><div class="unit-head"><span class="badge ' + u.lang + '">' + LANG_LABEL[u.lang] + '</span><span class="muted small">Unit ' + (i + 1) + '</span></div>' +
          '<h2>' + esc(u.title) + '</h2><p class="muted">' + esc(u.blurb) + '</p>' +
          '<div class="bar"><i style="width:' + p + '%"></i></div>' +
          '<ul>' + u.lessons.map((l) =>
            '<li><a href="#/lesson/' + l.id + '"><span class="dot ' + (lessonDone(l) ? 'done' : quizDone(l) || labDone(l) ? 'half' : '') + '"></span>' + esc(l.title) + '<span class="muted small">' + l.minutes + ' min</span></a></li>'
          ).join('') + '</ul></section>';
      }).join('') +
      '</div></div>';
  }

  /* ---------- lesson ---------- */
  function viewLesson(id) {
    const lesson = lessonById(id);
    if (!lesson) return viewDashboard();
    const lang = lesson.unit.lang;
    renderSidebar(id);
    Runners.preload(lang);
    const idx = LESSONS.indexOf(lesson);
    const prev = LESSONS[idx - 1];
    const next = LESSONS[idx + 1];
    $('#main').innerHTML =
      '<article class="page lesson">' +
      '<div class="crumbs"><a href="#/">Home</a> / Unit ' + lesson.number.split('.')[0] + ': ' + esc(lesson.unit.title) + '</div>' +
      '<h1><span class="num">' + lesson.number + '</span> ' + esc(lesson.title) + '</h1>' +
      '<div class="meta"><span class="badge ' + lang + '">' + LANG_LABEL[lang] + '</span><span class="muted">' + lesson.minutes + ' min read, then a quiz and a lab</span></div>' +
      '<div class="content">' + lesson.content + '</div>' +
      '<h2 class="section">Check your understanding</h2><div id="quiz"></div>' +
      '<h2 class="section">Coding lab</h2><div id="labCard"></div>' +
      '<div class="pager">' +
      (prev ? '<a class="btn" href="#/lesson/' + prev.id + '">← ' + esc(prev.title) + '</a>' : '<span></span>') +
      (next ? '<a class="btn" href="#/lesson/' + next.id + '">' + esc(next.title) + ' →</a>' : '<span></span>') +
      '</div></article>';

    // Live examples
    $$('.content pre[data-run]').forEach((pre) => {
      const exLang = pre.dataset.run;
      const code = pre.textContent.replace(/\s+$/, '');
      const box = document.createElement('div');
      box.className = 'example';
      box.innerHTML = '<div class="ex-editor"></div><div class="ex-bar"><button class="btn small run">▶ Run</button><button class="btn small ghost reset">Reset</button><span class="muted small">Edit the code and run it again</span></div><div class="output" hidden></div>';
      pre.replaceWith(box);
      const out = $('.output', box);
      const runBtn = $('.run', box);
      const run = async () => {
        const payload = { src: cm.getValue() };
        if (exLang === 'sql') payload.setup = SCHOOL_DB;
        renderResult(out, await execute(exLang, payload, out, runBtn), exLang);
      };
      const cm = makeEditor($('.ex-editor', box), exLang, code, { lineNumbers: false, autoHeight: true, onRun: run });
      runBtn.onclick = run;
      $('.reset', box).onclick = () => { cm.setValue(code); out.hidden = true; };
    });

    renderQuiz(lesson);
    renderLabCard(lesson);
    window.scrollTo(0, 0);
  }

  function renderQuiz(lesson) {
    const state = progress.quiz[lesson.id] || (progress.quiz[lesson.id] = []);
    $('#quiz').innerHTML = lesson.quiz.map((q, qi) =>
      '<div class="question' + (state[qi] ? ' solved' : '') + '" data-q="' + qi + '"><div class="q-text"><b>Question ' + (qi + 1) + '.</b> ' + q.q + '</div>' +
      '<div class="options">' + q.options.map((o, oi) =>
        '<button class="option' + (state[qi] && oi === q.answer ? ' correct' : '') + '" data-o="' + oi + '"' + (state[qi] ? ' disabled' : '') + '>' + esc(o) + '</button>'
      ).join('') + '</div>' +
      '<div class="explain"' + (state[qi] ? '' : ' hidden') + '>' + (state[qi] ? '<b>Correct.</b> ' + esc(q.explain) : '') + '</div></div>'
    ).join('');
    $$('#quiz .option').forEach((btn) => {
      btn.onclick = () => {
        const qEl = btn.closest('.question');
        const qi = +qEl.dataset.q;
        const q = lesson.quiz[qi];
        const explain = $('.explain', qEl);
        explain.hidden = false;
        if (+btn.dataset.o === q.answer) {
          state[qi] = true;
          save();
          addXp(10);
          btn.classList.add('correct');
          qEl.classList.add('solved');
          $$('.option', qEl).forEach((b) => (b.disabled = true));
          explain.innerHTML = '<b>Correct.</b> ' + esc(q.explain);
          renderSidebar(lesson.id);
        } else {
          btn.classList.add('wrong');
          btn.disabled = true;
          explain.innerHTML = 'Not quite. Have another go.';
        }
      };
    });
  }

  function renderLabCard(lesson) {
    const lab = lesson.lab;
    const done = labDone(lesson);
    const started = progress.labs[lab.id] && progress.labs[lab.id].code != null;
    $('#labCard').innerHTML =
      '<div class="lab-card' + (done ? ' done' : '') + '"><div><div class="muted small">' + LANG_LABEL[lab.lang] + ' lab · ' + lab.tests.length + ' automatic check' + (lab.tests.length === 1 ? '' : 's') + '</div><h3>' + esc(lab.title) + '</h3>' +
      '<div class="muted">' + (done ? '✓ Passed. You can reopen it to practise.' : 'Write real code, run it, and get instant feedback.') + '</div></div>' +
      '<a class="btn primary" href="#/lab/' + lab.id + '">' + (done ? 'Reopen lab' : started ? 'Continue lab →' : 'Start lab →') + '</a></div>';
  }

  /* ---------- lab workspace ---------- */
  function viewLab(id) {
    const lab = labById(id);
    if (!lab) return viewDashboard();
    const lesson = lab.lesson;
    const lang = lab.lang;
    const st = labState(lab.id);
    renderSidebar(lesson.id);
    Runners.preload(lang);
    let hintsShown = 0;

    $('#main').innerHTML =
      '<div class="lab">' +
      '<aside class="lab-info">' +
      '<div class="crumbs"><a href="#/lesson/' + lesson.id + '">← ' + lesson.number + ' ' + esc(lesson.title) + '</a></div>' +
      '<h1>' + esc(lab.title) + '</h1><span class="badge ' + lang + '">' + LANG_LABEL[lang] + ' lab</span>' +
      '<div class="content prompt">' + lab.prompt + '</div>' +
      '<h3>Checks</h3><ul id="tests" class="tests"></ul>' +
      '<div id="passBanner"></div>' +
      '<h3>Stuck?</h3><div id="hints"></div>' +
      '<div class="hint-actions"><button id="hintBtn" class="btn small">Show a hint</button><button id="solBtn" class="btn small ghost" hidden>Show solution</button></div>' +
      '<div id="solution"></div>' +
      '</aside>' +
      '<section class="lab-work">' +
      '<div class="toolbar"><span class="file">' + ({ python: 'main.py', javascript: 'main.js', sql: 'query.sql' }[lang]) + '</span><span class="spacer"></span>' +
      '<button id="resetBtn" class="btn small ghost" title="Put the starter code back">Reset</button>' +
      '<button id="runBtn" class="btn small" title="Ctrl+Enter">▶ Run</button>' +
      '<button id="checkBtn" class="btn small primary">✓ Check my work</button></div>' +
      '<div id="editor" class="editor"></div>' +
      '<div class="console"><div class="console-head">Output</div><div id="output" class="output"><div class="muted">Press Run to see what your code does, or Check my work to test it.</div></div></div>' +
      '</section></div>';

    const out = $('#output');
    const payload = (withTests) => {
      const p = { src: cm.getValue() };
      if (lang === 'sql') { p.setup = lab.setup; p.solution = lab.solution; }
      if (withTests) p.tests = lab.tests;
      return p;
    };

    function renderTests(results) {
      $('#tests').innerHTML = lab.tests.map((t, i) => {
        const r = results && results[i];
        const cls = r ? (r.ok ? 'pass' : 'fail') : st.passed && !results ? 'pass' : '';
        return '<li class="' + cls + '"><span class="mark">' + (cls === 'pass' ? '✓' : cls === 'fail' ? '✕' : '○') + '</span><div><div>' + esc(t.name) + '</div>' +
          (r && !r.ok && r.msg ? '<pre class="test-msg">' + esc(r.msg) + '</pre>' : '') +
          (r && !r.ok && r.expected ? '<div class="muted small">Expected result:</div>' + tableHTML(r.expected) : '') +
          '</div></li>';
      }).join('');
    }

    function renderBanner() {
      if (!st.passed) { $('#passBanner').innerHTML = ''; return; }
      const next = LESSONS[LESSONS.indexOf(lesson) + 1];
      const needQuiz = !quizDone(lesson);
      $('#passBanner').innerHTML = '<div class="banner ok"><b>Lab passed!</b> ' +
        (needQuiz ? 'Finish the quiz to complete this lesson. <a class="btn small primary" href="#/lesson/' + lesson.id + '">Back to the lesson</a>'
          : next ? 'Nice work. <a class="btn small primary" href="#/lesson/' + next.id + '">Next lesson →</a>'
            : 'That was the final lab. <a class="btn small primary" href="#/">Dashboard</a>') + '</div>';
    }

    function renderHints() {
      $('#hints').innerHTML = lab.hints.slice(0, hintsShown).map((h, i) => '<div class="hint"><b>Hint ' + (i + 1) + '.</b> ' + h + '</div>').join('');
      $('#hintBtn').hidden = hintsShown >= lab.hints.length;
      $('#hintBtn').textContent = hintsShown ? 'Another hint' : 'Show a hint';
      $('#solBtn').hidden = !(st.passed || (st.attempts >= 3 && hintsShown >= lab.hints.length));
    }

    const run = async () => renderResult(out, await execute(lang, payload(false), out, $('#runBtn')), lang);
    const check = async () => {
      const res = await execute(lang, payload(true), out, $('#checkBtn'));
      renderResult(out, res, lang);
      renderTests(res.results);
      const allOk = res.results.length === lab.tests.length && res.results.every((r) => r.ok);
      st.attempts++;
      if (allOk && !st.passed) { st.passed = true; addXp(50); toast('Lab passed! +50 XP'); }
      save();
      renderBanner();
      renderHints();
      renderSidebar(lesson.id);
    };

    const cm = makeEditor($('#editor'), lang, st.code != null ? st.code : lab.starter, { onRun: run });
    let timer;
    cm.on('change', () => {
      clearTimeout(timer);
      timer = setTimeout(() => { st.code = cm.getValue(); save(); }, 400);
    });
    $('#runBtn').onclick = run;
    $('#checkBtn').onclick = check;
    $('#resetBtn').onclick = () => { cm.setValue(lab.starter); cm.focus(); };
    $('#hintBtn').onclick = () => { hintsShown++; renderHints(); };
    $('#solBtn').onclick = () => {
      $('#solution').innerHTML = '<h3>One possible solution</h3><pre class="solution">' + esc(lab.solution) + '</pre>';
      $('#solBtn').hidden = true;
    };
    renderTests();
    renderBanner();
    renderHints();
    window.scrollTo(0, 0);
    setTimeout(() => cm.refresh(), 0);
  }

  /* ---------- playground ---------- */
  function viewPlayground() {
    renderSidebar();
    let lang = progress.playground.lang || 'python';
    $('#main').innerHTML =
      '<div class="lab playground"><section class="lab-work">' +
      '<div class="toolbar"><div class="tabs">' + Object.keys(LANG_LABEL).map((l) => '<button class="tab" data-lang="' + l + '">' + LANG_LABEL[l] + '</button>').join('') + '</div><span class="spacer"></span>' +
      '<span class="muted small">Free play. Nothing here is graded.</span><button id="runBtn" class="btn small primary" title="Ctrl+Enter">▶ Run</button></div>' +
      '<div id="editor" class="editor"></div>' +
      '<div class="console"><div class="console-head">Output</div><div id="output" class="output"><div class="muted">Press Run or Ctrl+Enter.</div></div></div>' +
      '</section></div>';
    const out = $('#output');
    const codeFor = (l) => (progress.playground[l] != null ? progress.playground[l] : PLAYGROUND_STARTERS[l]);
    const run = async () => {
      const p = { src: cm.getValue() };
      if (lang === 'sql') p.setup = SCHOOL_DB;
      renderResult(out, await execute(lang, p, out, $('#runBtn')), lang);
    };
    const cm = makeEditor($('#editor'), lang, codeFor(lang), { onRun: run });
    const setLang = (l) => {
      lang = l;
      progress.playground.lang = l;
      cm.setOption('mode', CM_MODE[l]);
      cm.setOption('indentUnit', l === 'python' ? 4 : 2);
      cm.setValue(codeFor(l));
      $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.lang === l));
      Runners.preload(l);
      save();
    };
    cm.on('change', () => { progress.playground[lang] = cm.getValue(); save(); });
    $$('.tab').forEach((t) => (t.onclick = () => setLang(t.dataset.lang)));
    $('#runBtn').onclick = run;
    setLang(lang);
    setTimeout(() => cm.refresh(), 0);
  }

  /* ---------- router ---------- */
  const routes = {};
  const cleanups = [];
  function route() {
    while (cleanups.length) { try { cleanups.pop()(); } catch (e) { /* ignore */ } }
    document.body.classList.remove('menu-open');
    const parts = (location.hash || '#/').slice(2).split('/');
    document.body.dataset.view = parts[0] || 'home';
    if (parts[0] === 'lesson') viewLesson(parts[1]);
    else if (parts[0] === 'lab') viewLab(parts[1]);
    else if (parts[0] === 'playground') viewPlayground();
    else if (routes[parts[0]]) { renderSidebar(); routes[parts[0]](parts); window.scrollTo(0, 0); }
    else viewDashboard();
  }
  window.addEventListener('hashchange', route);
  $('#menuBtn').onclick = () => document.body.classList.toggle('menu-open');
  document.addEventListener('DOMContentLoaded', route);

  /* Shared with study.js */
  window.Ace = {
    $, $$, esc, LESSONS, LANG_LABEL, routes, route, addXp, toast, levelInfo, currentStreak, renderSidebar,
    lessonDone, labDone, quizDone, pct, steps,
    get progress() { return progress; },
    save,
    onLeave: (fn) => cleanups.push(fn),
    resetAll() {
      progress = { quiz: {}, labs: {}, playground: {}, cards: {}, tests: [], game: { xp: 0, streak: 0, lastDay: null } };
      save();
    },
  };

  /* ---------- developer self-test: run selfTest() in the console ---------- */
  window.selfTest = async function () {
    const report = [];
    for (const l of LESSONS) {
      const lab = l.lab;
      const base = lab.lang === 'sql' ? { setup: lab.setup, solution: lab.solution } : {};
      const sol = await Runners.run(lab.lang, Object.assign({ src: lab.solution, tests: lab.tests }, base));
      const start = await Runners.run(lab.lang, Object.assign({ src: lab.starter, tests: lab.tests }, base));
      const solOk = !sol.err && sol.results.length === lab.tests.length && sol.results.every((r) => r.ok);
      const startOk = start.results.every((r) => r.ok);
      report.push({ lab: lab.id, solutionPasses: solOk, starterFails: !startOk, detail: solOk ? '' : (sol.err || '') + ' ' + sol.results.filter((r) => !r.ok).map((r) => r.name + ': ' + r.msg).join(' | ') });
    }
    return report;
  };
})();
