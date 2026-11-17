/* Ace Computer Science study modes: flashcards, practice tests, glossary, games and stats. */
(function () {
  const A = window.Ace;
  const { $, $$, esc } = A;
  const P = () => A.progress;
  const main = () => $('#main');

  const QUESTIONS = [];
  A.LESSONS.forEach((l) => l.quiz.forEach((q) => QUESTIONS.push(Object.assign({ domain: UNIT_DOMAIN[l.unit.id] }, q))));
  EXTRA_QUESTIONS.forEach((q) => QUESTIONS.push(q));

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const fmtTime = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const domainSelect = (id, allLabel) =>
    '<select id="' + id + '"><option value="all">' + allLabel + '</option>' +
    Object.keys(DOMAINS).map((d) => '<option value="' + d + '">' + esc(DOMAINS[d].label) + '</option>').join('') + '</select>';
  const domTag = (d) => '<span class="dom" style="--c:' + DOMAINS[d].color + '">' + esc(DOMAINS[d].label) + '</span>';
  const inDomain = (list, d) => (d === 'all' ? list : list.filter((x) => x.domain === d));
  const knownCount = (d) => inDomain(FLASHCARDS, d).filter((c) => P().cards[c.term] === 'known').length;

  /* ================= Games list and achievements ================= */
  const GAMES = [
    { key: 'match', icon: '🧩', title: 'Match-up', desc: 'Pair 6 terms with their definitions. Fast and satisfying.' },
    { key: 'speed', icon: '⚡', title: 'Speed Round', desc: '15 definitions, 10 seconds each. Build a combo for bonus XP.' },
    { key: 'conn', icon: '🔗', title: 'Connections', desc: '16 terms in a grid. Sort them into 4 hidden domains.' },
    { key: 'jeop', icon: '💰', title: 'Quiz Board', desc: '6 categories × 5 clues. Pick the right term, and watch for the Double.' },
    { key: 'drill', icon: '📝', title: 'Definition Drill', desc: '15 definitions. Type the matching term from memory.' },
    { key: 'typing', icon: '⌨️', title: 'Typing Test', desc: 'Type a passage of computer science text. Live WPM and accuracy.' },
  ];

  const labsIn = (lang) => A.LESSONS.filter((l) => l.unit.lang === lang);
  const ACHIEVEMENTS = [
    { id: 'first-xp', icon: '🌱', title: 'First steps', desc: 'Earn your first XP.', test: (s) => s.xp > 0 },
    { id: 'lab-1', icon: '🧪', title: 'It runs!', desc: 'Pass your first coding lab.', test: (s) => s.labs >= 1 },
    { id: 'lab-python', icon: '🐍', title: 'Pythonista', desc: 'Pass every Python lab.', test: () => labsIn('python').every(A.labDone) },
    { id: 'lab-js', icon: '🌐', title: 'Bilingual', desc: 'Pass every JavaScript lab.', test: () => labsIn('javascript').every(A.labDone) },
    { id: 'lab-sql', icon: '🗄️', title: 'Query master', desc: 'Pass every SQL lab.', test: () => labsIn('sql').every(A.labDone) },
    { id: 'lab-all', icon: '🎓', title: 'Graduate', desc: 'Complete every lesson, quiz and lab.', test: () => A.LESSONS.every(A.lessonDone) },
    { id: 'cards-25', icon: '🃏', title: 'Card shark', desc: 'Mark 25 flashcards as known.', test: (s) => s.known >= 25 },
    { id: 'cards-all', icon: '📚', title: 'Walking glossary', desc: 'Mark every flashcard as known.', test: (s) => s.known >= FLASHCARDS.length },
    { id: 'test-1', icon: '📝', title: 'Test taker', desc: 'Finish a practice test.', test: (s) => s.tests.length >= 1 },
    { id: 'test-perfect', icon: '💯', title: 'Flawless', desc: 'Score 100% on a test of 10 or more questions.', test: (s) => s.tests.some((t) => t.score === 100 && t.total >= 10) },
    { id: 'streak-3', icon: '🔥', title: 'On a roll', desc: 'Study 3 days in a row.', test: (s) => s.streak >= 3 },
    { id: 'streak-7', icon: '🚀', title: 'Unstoppable', desc: 'Study 7 days in a row.', test: (s) => s.streak >= 7 },
    { id: 'level-5', icon: '⭐', title: 'High five', desc: 'Reach level 5.', test: (s) => s.level >= 5 },
    { id: 'gamer', icon: '🎮', title: 'Game night', desc: 'Play all six study games.', test: (s) => GAMES.every((g) => s.plays[g.key]) },
    { id: 'typist', icon: '⌨️', title: 'Fast fingers', desc: 'Reach 40 WPM in the Typing Test.', test: (s) => s.bestWpm >= 40 },
  ];
  function checkAchievements() {
    const p = P();
    p.achievements = p.achievements || {};
    const s = {
      xp: p.game.xp,
      level: A.levelInfo(p.game.xp).level,
      streak: A.currentStreak(),
      labs: A.LESSONS.filter(A.labDone).length,
      known: knownCount('all'),
      tests: p.tests,
      plays: p.game.plays || {},
      bestWpm: p.game.bestWpm || 0,
    };
    let changed = false;
    ACHIEVEMENTS.forEach((a) => {
      if (!p.achievements[a.id] && a.test(s)) {
        p.achievements[a.id] = Date.now();
        changed = true;
        A.toast('🏆 Achievement: ' + a.title);
      }
    });
    if (changed) A.save();
  }
  A.onXp = () => setTimeout(checkAchievements, 0);

  /* Extra answers accepted by the Definition Drill. */
  const ALIASES = {
    'Big-O notation': ['big o', 'big-o'], 'if statement': ['if'], 'Function call': ['call', 'calling'], 'Return value': ['return'],
    'Strict equality': ['===', 'triple equals'], 'Integer division': ['floor division', '//'], Modulo: ['modulus', 'mod', 'remainder', '%'],
    Integer: ['int'], String: ['str'], Boolean: ['bool'], Dictionary: ['dict'], 'while loop': ['while'], 'for loop': ['for'],
    'Operating system': ['os'], Length: ['len'], 'Aggregate function': ['aggregate'], 'Comparison operator': ['comparison'],
    'Logical operator': ['logical', 'boolean operator'], 'O(n²)': ['o(n^2)', 'n squared', 'quadratic'], 'O(1)': ['constant'],
    'O(n)': ['linear'], 'O(log n)': ['logarithmic', 'log n'], Append: ['append()'], 'console.log': ['console log'],
    'for...of': ['for of'], 'Data type': ['type'], 'Syntax error': ['syntax'], 'Nested list': ['2d list'],
  };

  /* ================= Flashcards ================= */
  A.routes.flashcards = function () {
    let deck = [];
    let i = 0;
    let flipped = false;
    main().innerHTML =
      '<div class="page study"><h1>Flashcards</h1>' +
      '<p class="muted">' + FLASHCARDS.length + ' key terms. Mark the ones you know to prune the deck as you learn.</p>' +
      '<div class="controls"><label>Domain ' + domainSelect('fcDomain', 'All domains') + '</label>' +
      '<label>Show <select id="fcShow"><option value="all">All cards</option><option value="unknown">Only unknown</option><option value="known">Only known</option></select></label>' +
      '<button id="fcShuffle" class="btn small">Shuffle</button><button id="fcRestart" class="btn small ghost">Restart</button></div>' +
      '<div id="fcCard" class="flashcard" tabindex="0" role="button" aria-label="Flashcard. Press Space to flip."></div>' +
      '<div class="fc-actions"><button id="fcPrev" class="btn">← Prev</button><button id="fcKnown" class="btn ok">✓ I know this</button>' +
      '<button id="fcReview" class="btn warn">Need review</button><button id="fcNext" class="btn">Next →</button></div>' +
      '<div class="fc-count muted" id="fcCount"></div>' +
      '<p class="muted small center">Keyboard: Space to flip · ← → to move · K to mark known</p></div>';

    function build(shuffled) {
      const show = $('#fcShow').value;
      deck = inDomain(FLASHCARDS, $('#fcDomain').value).filter((c) => {
        const known = P().cards[c.term] === 'known';
        return show === 'all' || (show === 'known' ? known : !known);
      });
      if (shuffled) deck = shuffle(deck);
      i = 0;
      flipped = false;
      render();
    }
    function render() {
      const el = $('#fcCard');
      if (!deck.length) {
        el.className = 'flashcard empty';
        el.innerHTML = '<div class="fc-text">No cards match these filters.</div>';
        $('#fcCount').textContent = '0 / 0';
        return;
      }
      const c = deck[i];
      const status = P().cards[c.term];
      el.className = 'flashcard' + (flipped ? ' flipped' : '');
      el.innerHTML = '<div class="fc-top">' + domTag(c.domain) + (status ? '<span class="fc-status ' + status + '">' + (status === 'known' ? '✓ Known' : 'Needs review') + '</span>' : '') + '</div>' +
        '<div class="fc-text ' + (flipped ? 'def' : 'term') + '">' + esc(flipped ? c.def : c.term) + '</div>' +
        '<div class="fc-hint">' + (flipped ? 'Definition' : 'Click or press Space to flip') + '</div>';
      $('#fcCount').textContent = i + 1 + ' / ' + deck.length + ' · ' + knownCount('all') + ' of ' + FLASHCARDS.length + ' known';
    }
    const flip = () => { if (deck.length) { flipped = !flipped; render(); } };
    const move = (d) => { if (deck.length) { i = (i + d + deck.length) % deck.length; flipped = false; render(); } };
    function mark(status) {
      if (!deck.length) return;
      const term = deck[i].term;
      const was = P().cards[term];
      P().cards[term] = status;
      A.save();
      if (status === 'known' && was !== 'known') A.addXp(5);
      move(1);
    }
    $('#fcCard').onclick = flip;
    $('#fcPrev').onclick = () => move(-1);
    $('#fcNext').onclick = () => move(1);
    $('#fcKnown').onclick = () => mark('known');
    $('#fcReview').onclick = () => mark('review');
    $('#fcShuffle').onclick = () => build(true);
    $('#fcRestart').onclick = () => build(false);
    $('#fcDomain').onchange = () => build(false);
    $('#fcShow').onchange = () => build(false);
    const onKey = (e) => {
      if (/^(SELECT|INPUT|TEXTAREA|BUTTON)$/.test(e.target.tagName)) return;
      if (e.key === ' ') { e.preventDefault(); flip(); }
      else if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === 'k' || e.key === 'K') mark('known');
    };
    document.addEventListener('keydown', onKey);
    A.onLeave(() => document.removeEventListener('keydown', onKey));
    build(false);
  };

  /* ================= Practice test ================= */
  A.routes.practice = function () {
    let timer = null;
    A.onLeave(() => clearInterval(timer));
    setup();

    function setup() {
      clearInterval(timer);
      main().innerHTML =
        '<div class="page study"><h1>Practice test</h1><p class="muted">Multiple-choice questions with explanations, drawn from a bank of ' + QUESTIONS.length + '.</p>' +
        '<div class="panel"><h3>1. Choose your scope</h3><div class="controls">' +
        '<label>Domain ' + domainSelect('ptDomain', 'All domains (mixed)') + '</label>' +
        '<label>Questions <select id="ptCount"><option value="10">10 — quick</option><option value="20">20 — standard</option><option value="40">40 — thorough</option></select></label></div>' +
        '<h3>2. Test mode</h3>' +
        '<label class="radio"><input type="radio" name="ptMode" value="practice" checked> <span><b>Practice</b> — see the correct answer after each question</span></label>' +
        '<label class="radio"><input type="radio" name="ptMode" value="exam"> <span><b>Exam</b> — feedback only at the end</span></label>' +
        '<label class="radio"><input type="checkbox" id="ptTimed"> <span>Timed test: <input type="number" id="ptMinutes" value="15" min="1" max="120"> minutes</span></label>' +
        '<button id="ptStart" class="btn primary big">Start test</button></div></div>';
      $('#ptStart').onclick = () => {
        const domain = $('#ptDomain').value;
        const pool = shuffle(inDomain(QUESTIONS, domain));
        const qs = pool.slice(0, Math.min(+$('#ptCount').value, pool.length));
        const mins = Math.max(1, Math.min(120, +$('#ptMinutes').value || 15));
        start({ qs, domain, mode: $('input[name=ptMode]:checked').value, limit: $('#ptTimed').checked ? mins * 60 : 0 });
      };
    }

    function start(t) {
      t.answers = t.qs.map(() => null);
      t.i = 0;
      t.began = Date.now();
      main().innerHTML =
        '<div class="page study"><div class="pt-head"><b id="ptPos"></b><span id="ptClock" class="clock"></span><span class="spacer"></span><button id="ptEnd" class="btn small ghost">End test</button></div>' +
        '<div class="bar"><i id="ptBar"></i></div><div id="ptQ"></div>' +
        '<div class="pager"><button id="ptPrev" class="btn">← Previous</button><button id="ptNext" class="btn primary">Next →</button></div></div>';
      const elapsed = () => (Date.now() - t.began) / 1000;
      const tick = () => {
        const s = t.limit ? Math.max(0, t.limit - elapsed()) : elapsed();
        $('#ptClock').textContent = (t.limit ? '⏱ ' : '') + fmtTime(s);
        if (t.limit && s <= 0) finish(t);
      };
      clearInterval(timer);
      timer = setInterval(tick, 500);
      $('#ptEnd').onclick = () => finish(t);
      $('#ptPrev').onclick = () => { if (t.i > 0) { t.i--; show(); } };
      $('#ptNext').onclick = () => { if (t.i < t.qs.length - 1) { t.i++; show(); } else finish(t); };

      function show() {
        const q = t.qs[t.i];
        const chosen = t.answers[t.i];
        const reveal = t.mode === 'practice' && chosen !== null;
        $('#ptPos').textContent = 'Question ' + (t.i + 1) + ' / ' + t.qs.length;
        $('#ptBar').style.width = ((t.i + 1) / t.qs.length) * 100 + '%';
        $('#ptPrev').disabled = t.i === 0;
        $('#ptNext').textContent = t.i === t.qs.length - 1 ? 'Finish and score' : 'Next →';
        $('#ptQ').innerHTML = '<div class="question">' + domTag(q.domain) + '<div class="q-text">' + q.q + '</div><div class="options">' +
          q.options.map((o, oi) => {
            let cls = 'option';
            if (reveal) cls += oi === q.answer ? ' correct' : oi === chosen ? ' wrong' : '';
            else if (oi === chosen) cls += ' selected';
            return '<button class="' + cls + '" data-o="' + oi + '"' + (reveal ? ' disabled' : '') + '>' + esc(o) + '</button>';
          }).join('') + '</div>' +
          (reveal ? '<div class="explain"><b>' + (chosen === q.answer ? 'Correct.' : 'Not quite.') + '</b> ' + esc(q.explain) + '</div>' : '') + '</div>';
        $$('#ptQ .option').forEach((b) => (b.onclick = () => {
          t.answers[t.i] = +b.dataset.o;
          if (t.mode === 'practice') A.addXp(t.answers[t.i] === q.answer ? 10 : 2);
          show();
        }));
      }
      tick();
      show();
    }

    function finish(t) {
      clearInterval(timer);
      const total = t.qs.length;
      const correct = t.qs.filter((q, i) => t.answers[i] === q.answer).length;
      const score = Math.round((correct / total) * 100);
      const secs = (Date.now() - t.began) / 1000;
      if (t.mode === 'exam') A.addXp(correct * 10 + (total - correct) * 2);
      A.addXp(25 + (score === 100 ? 100 : 0));
      P().tests.unshift({ date: Date.now(), score, correct, total, domain: t.domain, mode: t.mode });
      P().tests = P().tests.slice(0, 20);
      A.save();
      checkAchievements();
      const byDomain = {};
      t.qs.forEach((q, i) => {
        const d = (byDomain[q.domain] = byDomain[q.domain] || { n: 0, ok: 0 });
        d.n++;
        if (t.answers[i] === q.answer) d.ok++;
      });
      main().innerHTML =
        '<div class="page study"><h1>Results</h1>' +
        '<div class="result-hero"><div class="result-pct ' + (score >= 70 ? 'good' : 'low') + '">' + score + '%</div><div class="muted">' + (score === 100 ? 'Perfect score!' : score >= 70 ? 'Solid work.' : 'Keep practising. Review the ones you missed below.') + '</div></div>' +
        '<div class="tiles"><div><b>' + correct + '</b><span>correct</span></div><div><b>' + (total - correct) + '</b><span>incorrect</span></div><div><b>' + total + '</b><span>total</span></div><div><b>' + fmtTime(secs) + '</b><span>time</span></div></div>' +
        '<h2 class="section">By domain</h2>' +
        Object.keys(byDomain).map((d) => '<div class="mastery"><span>' + esc(DOMAINS[d].label) + '</span><div class="bar"><i style="width:' + (byDomain[d].ok / byDomain[d].n) * 100 + '%;background:' + DOMAINS[d].color + '"></i></div><span class="muted small">' + byDomain[d].ok + '/' + byDomain[d].n + '</span></div>').join('') +
        '<h2 class="section">Review</h2><div class="controls"><button id="rvWrong" class="btn small">Show wrong only</button><button id="rvAll" class="btn small ghost">Show all</button></div><div id="review"></div>' +
        '<div class="pager"><button id="ptAgain" class="btn primary">Take another test</button><a class="btn" href="#/">Home</a></div></div>';
      const review = (wrongOnly) => {
        const items = t.qs.map((q, i) => ({ q, a: t.answers[i], n: i + 1 })).filter((x) => !wrongOnly || x.a !== x.q.answer);
        $('#review').innerHTML = items.length ? items.map((x) =>
          '<div class="question ' + (x.a === x.q.answer ? 'solved' : 'missed') + '"><div class="q-text"><b>' + x.n + '.</b> ' + x.q.q + '</div><div class="options">' +
          x.q.options.map((o, oi) => '<div class="option' + (oi === x.q.answer ? ' correct' : oi === x.a ? ' wrong' : '') + '">' + esc(o) + (oi === x.a ? ' <span class="small">(your answer)</span>' : '') + '</div>').join('') +
          '</div>' + (x.a === null ? '<div class="explain muted">Not answered.</div>' : '') + '<div class="explain">' + esc(x.q.explain) + '</div></div>').join('')
          : '<p class="muted">Nothing to review. You got them all right.</p>';
      };
      $('#rvWrong').onclick = () => review(true);
      $('#rvAll').onclick = () => review(false);
      $('#ptAgain').onclick = setup;
      review(correct < total);
      window.scrollTo(0, 0);
    }
  };

  /* ================= Glossary ================= */
  A.routes.glossary = function () {
    const sorted = FLASHCARDS.slice().sort((a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()));
    main().innerHTML =
      '<div class="page study"><h1>Glossary</h1><div class="controls"><input id="glSearch" type="search" placeholder="Search ' + FLASHCARDS.length + ' terms…" autocomplete="off">' +
      domainSelect('glDomain', 'All domains') + '</div><div id="glList"></div></div>';
    const render = () => {
      const q = $('#glSearch').value.trim().toLowerCase();
      const items = inDomain(sorted, $('#glDomain').value).filter((c) => !q || c.term.toLowerCase().includes(q) || c.def.toLowerCase().includes(q));
      let letter = '';
      $('#glList').innerHTML = items.length ? items.map((c) => {
        const first = /[a-z]/i.test(c.term[0]) ? c.term[0].toUpperCase() : '#';
        const head = first !== letter ? '<h3 class="gl-letter">' + (letter = first) + '</h3>' : '';
        return head + '<div class="gl-entry"><div><b>' + esc(c.term) + '</b> ' + domTag(c.domain) + '</div><div>' + esc(c.def) + '</div></div>';
      }).join('') : '<p class="muted">No matches.</p>';
    };
    $('#glSearch').oninput = render;
    $('#glDomain').onchange = render;
    render();
  };

  /* ================= Games ================= */
  A.routes.games = function () {
    let timer = null;
    let domain = 'all';
    A.onLeave(() => clearInterval(timer));
    hub();

    function hub() {
      clearInterval(timer);
      main().innerHTML =
        '<div class="page study"><h1>Study games</h1><p class="muted">Active recall in different shapes. Every game awards XP and counts towards your streak.</p>' +
        '<div class="controls"><label>Pull from domain ' + domainSelect('gmDomain', 'All domains') + '</label></div>' +
        '<div class="units">' + GAMES.map((g) => '<button class="unit-card game-card" data-game="' + g.key + '"><span class="game-icon">' + g.icon + '</span><h2>' + g.title + '</h2><p class="muted">' + g.desc + '</p></button>').join('') + '</div></div>';
      $('#gmDomain').value = domain;
      $('#gmDomain').onchange = (e) => (domain = e.target.value);
      const launch = { match: matchUp, speed: speedRound, conn: connections, jeop: jeopardy, drill: drill, typing: typingSetup };
      $$('.game-card').forEach((b) => (b.onclick = launch[b.dataset.game]));
    }

    function results(key, title, lines, xp, replay, extra) {
      clearInterval(timer);
      const g = P().game;
      g.plays = g.plays || {};
      g.plays[key] = (g.plays[key] || 0) + 1;
      A.save();
      checkAchievements();
      main().innerHTML = '<div class="page study"><h1>' + title + '</h1><div class="result-hero"><div class="result-pct good">+' + xp + '</div><div class="muted">XP earned</div></div>' +
        '<div class="tiles">' + lines.map((l) => '<div><b>' + l[0] + '</b><span>' + l[1] + '</span></div>').join('') + '</div>' + (extra || '') +
        '<div class="pager"><button id="gmAgain" class="btn primary">Play again</button><button id="gmBack" class="btn">Back to games</button></div></div>';
      $('#gmAgain').onclick = replay;
      $('#gmBack').onclick = hub;
    }

    function matchUp() {
      const cards = shuffle(inDomain(FLASHCARDS, domain)).slice(0, 6);
      const began = Date.now();
      let mistakes = 0, matched = 0, pick = null, xp = 0;
      main().innerHTML = '<div class="page study wide"><div class="pt-head"><b>🧩 Match-up</b><span id="muClock" class="clock">0:00</span><span id="muMiss" class="muted">Mistakes: 0</span><span class="spacer"></span><button id="gmQuit" class="btn small ghost">Quit</button></div>' +
        '<p class="muted small">Pick a term, then pick its definition.</p><div class="match"><div class="match-col">' +
        shuffle(cards).map((c) => '<button class="tile term" data-t="' + esc(c.term) + '">' + esc(c.term) + '</button>').join('') + '</div><div class="match-col">' +
        shuffle(cards).map((c) => '<button class="tile def" data-t="' + esc(c.term) + '">' + esc(c.def) + '</button>').join('') + '</div></div></div>';
      timer = setInterval(() => ($('#muClock').textContent = fmtTime((Date.now() - began) / 1000)), 500);
      $('#gmQuit').onclick = hub;
      $$('.tile.term').forEach((b) => (b.onclick = () => {
        $$('.tile.term').forEach((x) => x.classList.remove('picked'));
        b.classList.add('picked');
        pick = b;
      }));
      $$('.tile.def').forEach((b) => (b.onclick = () => {
        if (!pick) return;
        if (pick.dataset.t === b.dataset.t) {
          [pick, b].forEach((x) => { x.classList.remove('picked'); x.classList.add('done'); x.disabled = true; });
          pick = null;
          matched++;
          xp += 5;
          A.addXp(5);
          if (matched === cards.length) {
            const bonus = 25 + (mistakes === 0 ? 50 : 0);
            A.addXp(bonus);
            results('match', 'Match-up complete', [[fmtTime((Date.now() - began) / 1000), 'time'], [mistakes, 'mistakes']], xp + bonus, matchUp);
          }
        } else {
          mistakes++;
          $('#muMiss').textContent = 'Mistakes: ' + mistakes;
          b.classList.add('bad');
          setTimeout(() => b.classList.remove('bad'), 450);
        }
      }));
    }

    function speedRound() {
      const pool = inDomain(FLASHCARDS, domain);
      const qs = shuffle(pool).slice(0, 15);
      const PER = 10;
      let i = 0, correct = 0, combo = 0, best = 0, xp = 0, deadline = 0, locked = false;
      main().innerHTML = '<div class="page study"><div class="pt-head"><b>⚡ Speed Round</b><span id="spPos" class="muted"></span><span id="spCombo" class="combo"></span><span class="spacer"></span><span id="spClock" class="clock"></span><button id="gmQuit" class="btn small ghost">Quit</button></div>' +
        '<div class="bar"><i id="spBar" style="background:var(--accent)"></i></div><div id="spQ"></div></div>';
      $('#gmQuit').onclick = hub;
      const next = () => { if (!$('#spQ')) return; i++; if (i >= qs.length) end(); else show(); };
      function answer(btn, c) {
        if (locked) return;
        locked = true;
        const ok = btn && btn.dataset.t === c.term;
        $$('#spQ .option').forEach((b) => { b.disabled = true; if (b.dataset.t === c.term) b.classList.add('correct'); });
        if (ok) {
          correct++; combo++; best = Math.max(best, combo);
          const gain = 10 + Math.min(combo - 1, 5) * 2;
          xp += gain;
          A.addXp(gain);
        } else {
          combo = 0;
          if (btn) btn.classList.add('wrong');
        }
        $('#spCombo').textContent = combo > 1 ? 'Combo ×' + combo : '';
        setTimeout(next, ok ? 500 : 1400);
      }
      function show() {
        const c = qs[i];
        locked = false;
        deadline = Date.now() + PER * 1000;
        const choices = shuffle([c].concat(shuffle(pool.filter((x) => x.term !== c.term)).slice(0, 3)));
        $('#spPos').textContent = i + 1 + ' / ' + qs.length;
        $('#spQ').innerHTML = '<div class="question">' + domTag(c.domain) + '<div class="q-text big">' + esc(c.def) + '</div><div class="options two">' +
          choices.map((x) => '<button class="option" data-t="' + esc(x.term) + '">' + esc(x.term) + '</button>').join('') + '</div></div>';
        $$('#spQ .option').forEach((b) => (b.onclick = () => answer(b, c)));
      }
      function end() {
        const bonus = 25 + (correct === qs.length ? 100 : 0);
        A.addXp(bonus);
        results('speed', 'Speed Round complete', [[correct + '/' + qs.length, 'correct'], ['×' + best, 'best combo']], xp + bonus, speedRound);
      }
      timer = setInterval(() => {
        if (locked) return;
        const left = Math.max(0, (deadline - Date.now()) / 1000);
        $('#spClock').textContent = left.toFixed(1);
        $('#spBar').style.width = (left / PER) * 100 + '%';
        if (left <= 0) answer(null, qs[i]);
      }, 100);
      show();
    }

    /* ----- Connections ----- */
    function connections() {
      const groups = shuffle(Object.keys(DOMAINS)).slice(0, 4).map((d) => ({ d, terms: shuffle(inDomain(FLASHCARDS, d)).slice(0, 4).map((c) => c.term) }));
      let tiles = shuffle(groups.reduce((all, g) => all.concat(g.terms.map((t) => ({ t, d: g.d }))), []));
      let picked = [];
      const solved = [];
      let left = 4, xp = 0;
      const groupHTML = (g) => '<div class="cn-group" style="--c:' + DOMAINS[g.d].color + '"><b>' + esc(DOMAINS[g.d].label) + '</b><span>' + g.terms.map(esc).join(' · ') + '</span></div>';
      main().innerHTML = '<div class="page study"><div class="pt-head"><b>🔗 Connections</b><span id="cnLeft" class="muted"></span><span class="spacer"></span><button id="gmQuit" class="btn small ghost">Quit</button></div>' +
        '<p class="muted small">Find four groups of four terms that belong to the same domain. Select four tiles, then Submit.</p>' +
        '<div id="cnSolved"></div><div id="cnGrid" class="cn-grid"></div>' +
        '<div class="controls"><button id="cnShuffle" class="btn small">Shuffle</button><button id="cnClear" class="btn small ghost">Deselect all</button><button id="cnSubmit" class="btn small primary">Submit</button><span id="cnMsg" class="muted"></span></div></div>';
      $('#gmQuit').onclick = hub;
      function draw() {
        $('#cnLeft').textContent = 'Mistakes left: ' + left;
        $('#cnSolved').innerHTML = solved.map(groupHTML).join('');
        $('#cnGrid').innerHTML = tiles.map((x) => '<button class="tile cn' + (picked.includes(x.t) ? ' picked' : '') + '" data-t="' + esc(x.t) + '">' + esc(x.t) + '</button>').join('');
        $('#cnSubmit').disabled = picked.length !== 4;
        $$('#cnGrid .tile').forEach((b) => (b.onclick = () => {
          const t = b.dataset.t;
          if (picked.includes(t)) picked = picked.filter((p) => p !== t);
          else if (picked.length < 4) picked.push(t);
          draw();
        }));
      }
      function end(win) {
        const bonus = win ? 50 + (left === 4 ? 50 : 0) : 0;
        if (bonus) A.addXp(bonus);
        results('conn', win ? 'Connections solved' : 'Out of guesses', [[solved.length + '/4', 'groups found'], [4 - left, 'mistakes']], xp + bonus, connections,
          '<h2 class="section">The groups</h2>' + groups.map(groupHTML).join(''));
      }
      $('#cnShuffle').onclick = () => { tiles = shuffle(tiles); draw(); };
      $('#cnClear').onclick = () => { picked = []; draw(); };
      $('#cnSubmit').onclick = () => {
        if (picked.length !== 4) return;
        const counts = {};
        picked.forEach((t) => { const d = tiles.find((x) => x.t === t).d; counts[d] = (counts[d] || 0) + 1; });
        const best = Math.max.apply(null, Object.values(counts));
        if (best === 4) {
          const d = Object.keys(counts)[0];
          solved.push(groups.find((g) => g.d === d));
          tiles = tiles.filter((x) => x.d !== d);
          picked = [];
          xp += 25;
          A.addXp(25);
          $('#cnMsg').textContent = 'Correct!';
          if (!tiles.length) return end(true);
        } else {
          left--;
          $('#cnMsg').textContent = best === 3 ? 'One away!' : 'Those do not all belong together.';
          if (left === 0) return end(false);
        }
        draw();
      };
      draw();
    }

    /* ----- Quiz Board ----- */
    function jeopardy() {
      const VALUES = [200, 400, 600, 800, 1000];
      const cats = shuffle(Object.keys(DOMAINS)).slice(0, 6);
      const board = cats.map((d) => shuffle(inDomain(FLASHCARDS, d)).slice(0, 5));
      const total = cats.length * VALUES.length;
      const double = Math.floor(Math.random() * total);
      const used = {};
      let done = 0, score = 0, correct = 0, xp = 0;
      const money = (n) => (n < 0 ? '-$' + -n : '$' + n);
      const head = () => '<div class="pt-head"><b>💰 Quiz Board</b><span class="muted">' + (total - done) + ' clues left</span><span class="clock">' + money(score) + '</span><span class="spacer"></span><button id="gmQuit" class="btn small ghost">Quit</button></div>';

      function drawBoard() {
        if (done === total) {
          const bonus = 50 + (correct === total ? 200 : 0);
          A.addXp(bonus);
          return results('jeop', 'Board cleared', [[money(score), 'final score'], [correct + '/' + total, 'correct']], xp + bonus, jeopardy);
        }
        let cells = cats.map((d) => '<div class="jp-cat" style="--c:' + DOMAINS[d].color + '">' + esc(DOMAINS[d].label) + '</div>').join('');
        VALUES.forEach((v, r) => cats.forEach((d, c) => {
          const k = c * VALUES.length + r;
          cells += '<button class="jp-cell" data-k="' + k + '"' + (used[k] ? ' disabled' : '') + '>' + (used[k] ? '' : '$' + v) + '</button>';
        }));
        main().innerHTML = '<div class="page study wide">' + head() + '<div class="jp-scroll"><div class="jp-board">' + cells + '</div></div></div>';
        $('#gmQuit').onclick = hub;
        $$('.jp-cell').forEach((b) => (b.onclick = () => open(+b.dataset.k)));
      }

      function open(k) {
        const c = Math.floor(k / VALUES.length);
        const r = k % VALUES.length;
        if (k !== double) return clue(k, board[c][r], VALUES[r]);
        const max = Math.max(1000, score);
        const wagers = [200, 500, 1000, max].filter((w, i, a) => w <= max && a.indexOf(w) === i);
        main().innerHTML = '<div class="page study">' + head() + '<div class="panel center"><h2>DOUBLE!</h2><p>Category: <b>' + esc(DOMAINS[cats[c]].label) + '</b></p>' +
          '<p class="muted">Wager any of these amounts. Your current score is ' + money(score) + ' and the most you can wager is $' + max + '.</p>' +
          '<div class="fc-actions">' + wagers.map((w) => '<button class="btn primary" data-w="' + w + '">$' + w + '</button>').join('') + '</div></div></div>';
        $('#gmQuit').onclick = hub;
        $$('[data-w]').forEach((b) => (b.onclick = () => clue(k, board[c][r], +b.dataset.w)));
      }

      function clue(k, card, value) {
        const choices = shuffle([card].concat(shuffle(inDomain(FLASHCARDS, card.domain).filter((x) => x.term !== card.term)).slice(0, 3)));
        main().innerHTML = '<div class="page study">' + head() + '<div class="question">' + domTag(card.domain) + ' <b>$' + value + '</b><div class="q-text big">' + esc(card.def) + '</div><div class="options two">' +
          choices.map((x) => '<button class="option" data-t="' + esc(x.term) + '">' + esc(x.term) + '</button>').join('') + '</div><div id="jpAfter"></div></div></div>';
        $('#gmQuit').onclick = hub;
        $$('.option').forEach((b) => (b.onclick = () => {
          const ok = b.dataset.t === card.term;
          $$('.option').forEach((o) => { o.disabled = true; if (o.dataset.t === card.term) o.classList.add('correct'); });
          if (!ok) b.classList.add('wrong');
          used[k] = true;
          done++;
          score += ok ? value : -value;
          if (ok) { correct++; const gain = Math.round(value / 40); xp += gain; A.addXp(gain); }
          $('#jpAfter').innerHTML = '<div class="explain"><b>' + (ok ? 'Correct, +$' + value : 'Not quite, -$' + value) + '.</b> Score: ' + money(score) + '</div><div class="pager"><span></span><button id="jpNext" class="btn primary">Continue</button></div>';
          $('#jpNext').onclick = drawBoard;
          $('#jpNext').focus();
        }));
      }
      drawBoard();
    }

    /* ----- Definition Drill ----- */
    function drill() {
      const qs = shuffle(inDomain(FLASHCARDS, domain)).slice(0, 15);
      const began = Date.now();
      const norm = (v) => v.toLowerCase().replace(/²/g, '2').replace(/[^a-z0-9]/g, '');
      const accepts = (c, v) => [c.term].concat(ALIASES[c.term] || []).some((a) => a.toLowerCase() === v.trim().toLowerCase() || (norm(a) && norm(a) === norm(v)));
      let i = 0, correct = 0, xp = 0, hinted = false, locked = false;
      main().innerHTML = '<div class="page study"><div class="pt-head"><b>📝 Definition Drill</b><span id="ddPos" class="muted"></span><span class="spacer"></span><span id="ddClock" class="clock">0:00</span><button id="gmQuit" class="btn small ghost">Quit</button></div>' +
        '<div class="question"><div id="ddDom"></div><div id="ddDef" class="q-text big"></div>' +
        '<div class="controls"><input id="ddInput" type="search" placeholder="Type the term…" autocomplete="off" autocapitalize="off" spellcheck="false">' +
        '<button id="ddSubmit" class="btn primary">Submit</button><button id="ddHint" class="btn">Hint</button><button id="ddSkip" class="btn ghost">Skip →</button></div><div id="ddMsg" class="explain"></div></div></div>';
      timer = setInterval(() => ($('#ddClock').textContent = fmtTime((Date.now() - began) / 1000)), 500);
      $('#gmQuit').onclick = hub;
      function show() {
        hinted = false;
        locked = false;
        $('#ddPos').textContent = i + 1 + ' / ' + qs.length;
        $('#ddDom').innerHTML = domTag(qs[i].domain);
        $('#ddDef').textContent = qs[i].def;
        $('#ddMsg').textContent = '';
        $('#ddInput').value = '';
        $('#ddInput').focus();
      }
      function next(delay) {
        locked = true;
        setTimeout(() => {
          if (!$('#ddInput')) return;
          i++;
          if (i < qs.length) return show();
          A.addXp(25);
          results('drill', 'Drill complete', [[correct + '/' + qs.length, 'correct'], [fmtTime((Date.now() - began) / 1000), 'time']], xp + 25, drill);
        }, delay);
      }
      function submit() {
        const v = $('#ddInput').value;
        if (locked || !v.trim()) return;
        if (accepts(qs[i], v)) {
          correct++;
          const gain = hinted ? 5 : 10;
          xp += gain;
          A.addXp(gain);
          $('#ddMsg').innerHTML = '<b style="color:var(--ok)">Correct: ' + esc(qs[i].term) + '</b>';
          next(700);
        } else {
          $('#ddMsg').textContent = 'Not quite. Try again, ask for a hint, or skip.';
        }
      }
      $('#ddSubmit').onclick = submit;
      $('#ddInput').onkeydown = (e) => { if (e.key === 'Enter') submit(); };
      $('#ddHint').onclick = () => {
        if (locked) return;
        hinted = true;
        const t = qs[i].term;
        $('#ddMsg').textContent = 'Hint: it starts with "' + t.slice(0, 2) + '" and is ' + t.length + ' characters long.';
        $('#ddInput').focus();
      };
      $('#ddSkip').onclick = () => {
        if (locked) return;
        $('#ddMsg').innerHTML = 'The answer was <b>' + esc(qs[i].term) + '</b>.';
        next(1600);
      };
      show();
    }

    /* ----- Typing Test ----- */
    function typingSetup() {
      clearInterval(timer);
      main().innerHTML = '<div class="page study"><div class="pt-head"><b>⌨️ Typing Test</b><span class="spacer"></span><button id="gmQuit" class="btn small ghost">Back</button></div>' +
        '<div class="panel"><h3>Pick your length</h3><div class="fc-actions" style="justify-content:flex-start">' +
        '<button class="btn" data-n="40"><b>Short</b>&nbsp; about 40 words</button><button class="btn" data-n="100"><b>Medium</b>&nbsp; about 100 words</button><button class="btn" data-n="200"><b>Long</b>&nbsp; about 200 words</button></div>' +
        '<p class="muted small">Passages are built from the flashcard definitions, so you revise the material as you type.</p></div></div>';
      $('#gmQuit').onclick = hub;
      $$('[data-n]').forEach((b) => (b.onclick = () => typing(+b.dataset.n)));
    }

    function typing(words) {
      clearInterval(timer);
      const plain = inDomain(FLASHCARDS, domain).filter((c) => /^[\x20-\x7E]+$/.test(c.term + c.def));
      let text = '';
      shuffle(plain).some((c) => {
        text += (text ? ' ' : '') + c.term + ': ' + c.def;
        return text.split(' ').length >= words;
      });
      let started = 0, strokes = 0, errors = 0, prev = 0, finished = false;
      main().innerHTML = '<div class="page study"><div class="pt-head"><b>⌨️ Typing Test</b><span id="tyWpm" class="muted">WPM: 0</span><span id="tyAcc" class="muted">Accuracy: 100%</span><span class="spacer"></span><span id="tyClock" class="clock">0:00</span><button id="gmQuit" class="btn small ghost">Quit</button></div>' +
        '<div id="tyPass" class="passage">' + text.split('').map((ch) => '<span>' + esc(ch) + '</span>').join('') + '</div>' +
        '<textarea id="tyIn" class="ty-input" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Type the passage shown above"></textarea>' +
        '<div class="controls"><span class="muted small">Click the passage and start typing. Backspace works.</span><span class="spacer"></span><button id="tyRestart" class="btn small">New passage</button></div></div>';
      const spans = $$('#tyPass span');
      const input = $('#tyIn');
      const minutes = () => Math.max((Date.now() - started) / 60000, 1 / 600);
      const stats = (v) => {
        let right = 0;
        for (let j = 0; j < v.length; j++) if (v[j] === text[j]) right++;
        return { wpm: started ? Math.round(right / 5 / minutes()) : 0, acc: strokes ? Math.round(((strokes - errors) / strokes) * 100) : 100 };
      };
      function paint(v) {
        spans.forEach((sp, j) => (sp.className = j < v.length ? (v[j] === text[j] ? 'ok' : 'no') : j === v.length ? 'cur' : ''));
        const s = stats(v);
        $('#tyWpm').textContent = 'WPM: ' + s.wpm;
        $('#tyAcc').textContent = 'Accuracy: ' + s.acc + '%';
      }
      input.oninput = () => {
        if (finished) return;
        let v = input.value.replace(/\n/g, ' ').slice(0, text.length);
        if (v !== input.value) input.value = v;
        if (!started && v.length) started = Date.now();
        for (let j = prev; j < v.length; j++) { strokes++; if (v[j] !== text[j]) errors++; }
        prev = v.length;
        paint(v);
        if (v.length >= text.length) {
          finished = true;
          const s = stats(v);
          const gain = 25 + Math.min(150, Math.round(s.wpm * 1.5)) + Math.round(s.acc / 5) + (errors === 0 ? 50 : 0);
          const g = P().game;
          g.bestWpm = Math.max(g.bestWpm || 0, s.wpm);
          A.addXp(gain);
          results('typing', 'Typing Test complete', [[s.wpm, 'words per minute'], [s.acc + '%', 'accuracy'], [fmtTime((Date.now() - started) / 1000), 'time'], [g.bestWpm, 'your best WPM']], gain, typingSetup);
        }
      };
      input.onpaste = (e) => e.preventDefault();
      $('#tyPass').onclick = () => input.focus();
      $('#tyRestart').onclick = () => typing(words);
      $('#gmQuit').onclick = hub;
      timer = setInterval(() => { if (started && !finished) { $('#tyClock').textContent = fmtTime((Date.now() - started) / 1000); paint(input.value); } }, 500);
      paint('');
      input.focus();
    }
  };

  /* ================= Stats ================= */
  A.routes.stats = function () {
    const p = P();
    const li = A.levelInfo(p.game.xp);
    const statuses = Object.values(p.cards);
    const tests = p.tests;
    const avg = tests.length ? Math.round(tests.reduce((n, t) => n + t.score, 0) / tests.length) + '%' : '—';
    const tile = (v, label) => '<div><b>' + v + '</b><span>' + label + '</span></div>';
    main().innerHTML =
      '<div class="page study"><h1>Your progress</h1>' +
      '<div class="tiles">' + tile('Lv.' + li.level, li.total + ' XP total') + tile('🔥 ' + A.currentStreak(), 'day streak') +
      tile(A.LESSONS.filter(A.lessonDone).length + '/' + A.LESSONS.length, 'lessons completed') + tile(A.LESSONS.filter(A.labDone).length + '/' + A.LESSONS.length, 'coding labs passed') +
      tile(statuses.filter((s) => s === 'known').length, 'cards marked known') + tile(statuses.filter((s) => s === 'review').length, 'cards needing review') +
      tile(tests.length, 'practice tests completed') + tile(avg, 'average test score') + '</div>' +
      '<h2 class="section">Flashcard mastery by domain</h2>' +
      Object.keys(DOMAINS).map((d) => {
        const total = inDomain(FLASHCARDS, d).length;
        const k = knownCount(d);
        return '<div class="mastery"><span>' + esc(DOMAINS[d].label) + '</span><div class="bar"><i style="width:' + (k / total) * 100 + '%;background:' + DOMAINS[d].color + '"></i></div><span class="muted small">' + k + '/' + total + '</span></div>';
      }).join('') +
      '<h2 class="section">Achievements <span class="muted small">' + Object.keys(p.achievements || {}).length + ' of ' + ACHIEVEMENTS.length + '</span></h2><div class="ach-grid">' +
      ACHIEVEMENTS.map((a) => { const got = (p.achievements || {})[a.id]; return '<div class="ach' + (got ? ' got' : '') + '"><span class="ach-icon">' + (got ? a.icon : '🔒') + '</span><div><b>' + esc(a.title) + '</b><div class="muted small">' + esc(a.desc) + '</div></div></div>'; }).join('') + '</div>' +
      '<h2 class="section">Recent test history</h2>' +
      (tests.length ? '<div class="result-table"><table><tr><th>Date</th><th>Scope</th><th>Mode</th><th>Score</th></tr>' +
        tests.map((t) => '<tr><td>' + new Date(t.date).toLocaleDateString() + '</td><td>' + esc(t.domain === 'all' ? 'All domains' : DOMAINS[t.domain].label) + '</td><td>' + esc(t.mode) + '</td><td>' + t.correct + '/' + t.total + ' (' + t.score + '%)</td></tr>').join('') + '</table></div>'
        : '<p class="muted">No tests yet. <a href="#/practice">Take your first practice test.</a></p>') +
      '<h2 class="section">Reset</h2><p class="muted">Progress is saved only in this browser.</p><button id="resetAll" class="btn danger">Reset all progress</button></div>';
    let armed = false;
    $('#resetAll').onclick = (e) => {
      if (!armed) {
        armed = true;
        e.target.textContent = 'Click again to erase everything';
        return;
      }
      A.resetAll();
      A.toast('Progress reset');
      A.route();
    };
  };
})();
