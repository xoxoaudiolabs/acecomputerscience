/* CS Lab code runner. One worker instance per language, so a runaway
   program can be killed without taking the other runtimes down. */

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const SQLJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';

let pyodide = null;
let pyRun = null;
let SQL = null;

const PY_HARNESS = `
import sys, io, json, traceback

def __cslab_fmt(e, fname):
    if isinstance(e, SyntaxError):
        return f"{type(e).__name__}: {e.msg} (line {e.lineno})"
    line = None
    for fr in traceback.extract_tb(e.__traceback__):
        if fr.filename == fname:
            line = fr.lineno
    msg = f"{type(e).__name__}: {e}" if str(e) else type(e).__name__
    return msg + (f" (line {line})" if line else "")

def __cslab_run(src, tests_json, stdin_text):
    tests = json.loads(tests_json)
    stdin = stdin_text.split("\\n") if stdin_text else []
    def _input(prompt=""):
        print(prompt, end="")
        return stdin.pop(0) if stdin else ""
    ns = {"__name__": "__main__", "input": _input}
    buf = io.StringIO()
    old = sys.stdout
    sys.stdout = buf
    err = None
    try:
        exec(compile(src, "main.py", "exec"), ns)
    except BaseException as e:
        err = __cslab_fmt(e, "main.py")
    finally:
        sys.stdout = old
    out = buf.getvalue()
    results = []
    for t in tests:
        ns["output"] = out
        ns["source"] = src
        sys.stdout = io.StringIO()
        try:
            if err:
                raise AssertionError("Fix the error in your program first.")
            exec(compile(t["code"], "test.py", "exec"), ns)
            results.append({"name": t["name"], "ok": True})
        except AssertionError as e:
            results.append({"name": t["name"], "ok": False, "msg": str(e) or "The result was not what the test expected."})
        except BaseException as e:
            results.append({"name": t["name"], "ok": False, "msg": __cslab_fmt(e, "main.py")})
        finally:
            sys.stdout = old
    return json.dumps({"out": out, "err": err, "results": results})
`;

async function init(lang) {
  if (lang === 'python') {
    importScripts(PYODIDE_URL + 'pyodide.js');
    pyodide = await loadPyodide({ indexURL: PYODIDE_URL });
    pyodide.runPython(PY_HARNESS);
    pyRun = pyodide.globals.get('__cslab_run');
  } else if (lang === 'sql') {
    importScripts(SQLJS_URL + 'sql-wasm.js');
    SQL = await initSqlJs({ locateFile: (f) => SQLJS_URL + f });
  }
}

/* ---------- Python ---------- */
function runPython(m) {
  return JSON.parse(pyRun(m.src, JSON.stringify(m.tests || []), m.stdin || ''));
}

/* ---------- JavaScript ---------- */
function show(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (typeof v === 'function') return '[Function ' + (v.name || 'anonymous') + ']';
  try {
    const s = JSON.stringify(v);
    return s === undefined ? String(v) : s;
  } catch (e) {
    return String(v);
  }
}
function fakeConsole(sink) {
  const log = (...a) => sink.push(a.map(show).join(' '));
  return { log, info: log, warn: log, error: log, debug: log };
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'The result was not what the test expected.');
}
function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error((label ? label + ': ' : '') + 'expected ' + show(expected) + ' but got ' + show(actual));
  }
}
function runJS(m) {
  const lines = [];
  let err = null;
  try {
    new Function('console', m.src)(fakeConsole(lines));
  } catch (e) {
    err = (e && e.name ? e.name : 'Error') + ': ' + (e && e.message ? e.message : e);
  }
  const out = lines.length ? lines.join('\n') + '\n' : '';
  const results = (m.tests || []).map((t) => {
    try {
      if (err) throw new Error('Fix the error in your program first.');
      new Function('console', 'assert', 'assertEqual', 'output', 'source', m.src + '\n;\n' + t.code)(
        fakeConsole([]), assert, assertEqual, out, m.src
      );
      return { name: t.name, ok: true };
    } catch (e) {
      return { name: t.name, ok: false, msg: e && e.message ? e.message : String(e) };
    }
  });
  return { out, err, results };
}

/* ---------- SQL ---------- */
function freshDb(setup) {
  const db = new SQL.Database();
  if (setup) db.run(setup);
  return db;
}
function lastTable(sets) {
  return sets.length ? sets[sets.length - 1] : { columns: [], values: [] };
}
function normRows(t, ordered) {
  const rows = t.values.map((r) =>
    JSON.stringify(r.map((v) => (typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v)))
  );
  return ordered ? rows : rows.sort();
}
function runSQL(m) {
  const db = freshDb(m.setup);
  let err = null;
  let sets = [];
  try {
    sets = db.exec(m.src);
  } catch (e) {
    err = 'SQL error: ' + (e && e.message ? e.message : e);
  }
  const tables = sets.map((s) => ({ columns: s.columns, values: s.values }));
  let results = [];
  if (m.tests && m.tests.length) {
    const sdb = freshDb(m.setup);
    const solSets = sdb.exec(m.solution);
    results = m.tests.map((t) => {
      try {
        if (err) throw new Error('Fix the SQL error first.');
        const got = lastTable(t.check ? db.exec(t.check) : sets);
        const exp = lastTable(t.check ? sdb.exec(t.check) : solSets);
        const fail = (msg) => ({ name: t.name, ok: false, msg, expected: { columns: exp.columns, values: exp.values } });
        if (got.columns.length !== exp.columns.length) {
          return fail('Expected ' + exp.columns.length + ' column(s) but your result has ' + got.columns.length + '.');
        }
        if (got.values.length !== exp.values.length) {
          return fail('Expected ' + exp.values.length + ' row(s) but your result has ' + got.values.length + '.');
        }
        const a = normRows(got, t.ordered);
        const b = normRows(exp, t.ordered);
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return fail(t.ordered ? 'Row ' + (i + 1) + ' is different from the expected result (check your values and the order).' : 'Some rows are different from the expected result.');
          }
        }
        return { name: t.name, ok: true };
      } catch (e) {
        return { name: t.name, ok: false, msg: e && e.message ? e.message : String(e) };
      }
    });
    sdb.close();
  }
  db.close();
  return { out: '', err, tables, results };
}

/* ---------- message loop ---------- */
let ready = null;
self.onmessage = async (e) => {
  const m = e.data;
  try {
    if (m.type === 'init') {
      ready = init(m.lang);
      await ready;
      self.postMessage({ type: 'ready' });
      return;
    }
    await ready;
    let res;
    if (m.lang === 'python') res = runPython(m);
    else if (m.lang === 'javascript') res = runJS(m);
    else res = runSQL(m);
    self.postMessage({ type: 'result', id: m.id, res });
  } catch (err) {
    self.postMessage({ type: m.type === 'init' ? 'initError' : 'result', id: m.id, res: { out: '', err: 'Runner error: ' + (err && err.message ? err.message : err), results: [] }, error: String(err && err.message ? err.message : err) });
  }
};
