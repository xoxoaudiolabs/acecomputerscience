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
        '<div class="units"><button class="unit-card game-card" id="gmMatch"><span class="game-icon">🧩</span><h2>Match-up</h2><p class="muted">Pair 6 terms with their definitions. Fast and satisfying.</p></button>' +
        '<button class="unit-card game-card" id="gmSpeed"><span class="game-icon">⚡</span><h2>Speed Round</h2><p class="muted">15 definitions, 10 seconds each. Build a combo for bonus XP.</p></button></div></div>';
      $('#gmDomain').value = domain;
      $('#gmDomain').onchange = (e) => (domain = e.target.value);
      $('#gmMatch').onclick = matchUp;
      $('#gmSpeed').onclick = speedRound;
    }

    function results(title, lines, xp, replay) {
      clearInterval(timer);
      main().innerHTML = '<div class="page study"><h1>' + title + '</h1><div class="result-hero"><div class="result-pct good">+' + xp + '</div><div class="muted">XP earned</div></div>' +
        '<div class="tiles">' + lines.map((l) => '<div><b>' + l[0] + '</b><span>' + l[1] + '</span></div>').join('') + '</div>' +
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
            results('Match-up complete', [[fmtTime((Date.now() - began) / 1000), 'time'], [mistakes, 'mistakes']], xp + bonus, matchUp);
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
        results('Speed Round complete', [[correct + '/' + qs.length, 'correct'], ['×' + best, 'best combo']], xp + bonus, speedRound);
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
