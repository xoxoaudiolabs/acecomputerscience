/* Main-thread wrapper around the runner workers.
   Usage: const res = await Runners.run('python', { src, tests }, onStatus)
   res = { out, err, results:[{name, ok, msg}], tables?, timeout? } */
(function () {
  const TIMEOUT_MS = 10000;
  const LABEL = { python: 'Python', javascript: 'JavaScript', sql: 'SQL' };
  const pool = {};
  let nextId = 1;

  function boot(lang) {
    const entry = { worker: new Worker('js/worker.js'), pending: new Map(), isReady: false };
    entry.ready = new Promise((resolve, reject) => {
      entry.worker.onmessage = (e) => {
        const m = e.data;
        if (m.type === 'ready') {
          entry.isReady = true;
          resolve();
        } else if (m.type === 'initError') {
          reject(new Error(m.error));
        } else if (m.type === 'result') {
          const done = entry.pending.get(m.id);
          if (done) {
            entry.pending.delete(m.id);
            done(m.res);
          }
        }
      };
      entry.worker.onerror = (e) => reject(new Error(e.message || 'Could not start the code runner.'));
    });
    entry.worker.postMessage({ type: 'init', lang });
    pool[lang] = entry;
    return entry;
  }

  function kill(lang) {
    if (pool[lang]) {
      pool[lang].worker.terminate();
      delete pool[lang];
    }
  }

  async function run(lang, payload, onStatus) {
    const entry = pool[lang] || boot(lang);
    if (!entry.isReady && onStatus) {
      onStatus(lang === 'python' ? 'Loading Python (first run takes a few seconds)…' : 'Starting ' + LABEL[lang] + '…');
    }
    try {
      await entry.ready;
    } catch (e) {
      kill(lang);
      return { out: '', err: 'Could not load the ' + LABEL[lang] + ' runner. Check your internet connection and try again.\n(' + e.message + ')', results: [] };
    }
    if (onStatus) onStatus('Running…');
    return new Promise((resolve) => {
      const id = nextId++;
      const timer = setTimeout(() => {
        entry.pending.delete(id);
        kill(lang);
        resolve({
          out: '',
          err: 'Your program ran for more than ' + TIMEOUT_MS / 1000 + ' seconds, so it was stopped. Look for a loop that never ends.',
          results: (payload.tests || []).map((t) => ({ name: t.name, ok: false, msg: 'The program did not finish.' })),
          timeout: true,
        });
      }, TIMEOUT_MS);
      entry.pending.set(id, (res) => {
        clearTimeout(timer);
        resolve(res);
      });
      entry.worker.postMessage(Object.assign({ type: 'run', id, lang }, payload));
    });
  }

  /* Warm a runtime up in the background so the first Run feels fast. */
  function preload(lang) {
    if (!pool[lang]) boot(lang).ready.catch(() => kill(lang));
  }

  window.Runners = { run, preload, LABEL };
})();
