# Ace Computer Science

A free, self-contained study app for introductory computer science. It combines short lessons, **live coding labs that run and grade your code in the browser**, flashcards, practice tests and study games.

There are no accounts, no backend and no build step. Python, JavaScript and SQL all execute on your own machine, inside the browser tab.

## Contents

- [What's inside](#whats-inside)
- [Quick start](#quick-start)
- [The curriculum](#the-curriculum)
- [How the coding labs work](#how-the-coding-labs-work)
- [Study modes](#study-modes)
- [Project structure](#project-structure)
- [Adding your own content](#adding-your-own-content)
- [Hosting it](#hosting-it)
- [Privacy](#privacy)
- [Security notes](#security-notes)
- [Built with](#built-with)
- [License](#license)

## What's inside

| | |
|---|---|
| **17 lessons** | Short readings where every code sample is editable and has a Run button. |
| **17 coding labs** | A real editor, a Run button, and "Check my work", which runs automatic tests and explains what failed. |
| **34 lesson quiz questions** | Two per lesson, each with an explanation. |
| **113 flashcards** | Key terms across 7 domains, with known / needs-review tracking. |
| **79-question test bank** | Practice mode or exam mode, optional timer, results by domain, full review. |
| **6 study games** | Match-up, Speed Round, Connections, Quiz Board, Definition Drill, Typing Test. |
| **Progress** | XP, levels, a daily streak, 15 achievements and a stats page. |
| **Installable** | Works as a Progressive Web App and keeps working offline after the first visit. |

Three languages run live:

| Language | Runs on | Used for |
|---|---|---|
| Python | [Pyodide](https://pyodide.org) (CPython compiled to WebAssembly) | Units 1 to 5 |
| JavaScript | The browser's own engine, inside a Web Worker | Unit 6 |
| SQL | [sql.js](https://sql.js.org) (SQLite compiled to WebAssembly) | Unit 7 |

## Quick start

You need [Node.js](https://nodejs.org) 18 or newer and an internet connection for the first load (the editor and language runtimes come from public CDNs, then get cached).

```bash
git clone https://github.com/xoxoaudiolabs/acecomputerscience.git
cd acecomputerscience
node server.js
```

Then open <http://localhost:5173>.

**On Windows** you can skip the terminal: double-click `start.bat`. It starts the server and opens your browser. Close the window to stop.

**No Node?** Any static file server works, because the app is plain files:

```bash
python -m http.server 5173
```

Opening `index.html` straight from disk does not fully work. Browsers block Web Workers on `file://` pages, and the coding labs need them.

To use a different port:

```bash
PORT=8080 node server.js
```

## The curriculum

| Unit | Language | Lessons |
|---|---|---|
| 1. Foundations | Python | Output and variables · Numbers and arithmetic · Working with strings |
| 2. Functions and decisions | Python | Writing functions · Making decisions with `if` |
| 3. Loops | Python | `while` loops · `for` loops and `range` |
| 4. Lists and dictionaries | Python | Lists · Dictionaries |
| 5. Algorithms | Python | Linear search · Binary search |
| 6. A second language | JavaScript | JavaScript basics · Arrays and objects |
| 7. Data and SQL | SQL | `SELECT` and `WHERE` · Sorting and limiting · Counting and grouping · Joining tables |

Each lesson is a reading, a two-question quiz and one lab. A lesson is complete when the quiz is answered and the lab passes.

## How the coding labs work

1. Your code is sent to a **Web Worker**, one per language, so a slow program never freezes the page.
2. The worker runs the code and captures what it prints.
3. For "Check my work", the worker then runs the lab's hidden tests against your code and reports each one as passed or failed, with a message.
4. Any program still running after **10 seconds** is stopped and the worker is restarted. This is what catches infinite loops.

Details by language:

- **Python** tests are small snippets of Python that `assert` things about your variables, functions and printed output. Error messages are trimmed to the error and the line number in your code.
- **JavaScript** tests use two helpers, `assert(condition, message)` and `assertEqual(actual, expected, label)`.
- **SQL** labs run your query against a fresh copy of a small school database, run the reference solution against another fresh copy, and compare the two results. When they differ you are shown the expected rows.

Hints unlock one at a time. The reference solution unlocks after three failed attempts with all hints shown, or once you pass.

## Study modes

- **Flashcards**: filter by domain or by known / unknown, shuffle, and mark cards as you learn. Keyboard: `Space` flips, `←` `→` move, `K` marks known.
- **Practice Test**: choose a domain and length. *Practice* shows the answer after each question; *Exam* holds feedback until the end. Results are broken down by domain.
- **Glossary**: every term, searchable.
- **Games**:
  - *Match-up*: pair six terms with their definitions.
  - *Speed Round*: 15 definitions, 10 seconds each, with a combo bonus.
  - *Connections*: sort 16 terms into four hidden domains.
  - *Quiz Board*: six categories of five clues with a hidden Double.
  - *Definition Drill*: type the term from its definition.
  - *Typing Test*: type a passage of computer science text for words per minute and accuracy.
- **Playground**: a free-play editor for all three languages. Nothing is graded.
- **Stats**: level, streak, mastery by domain, achievements and test history.

## Project structure

```
index.html          Page shell. Loads the editor from a CDN, then the scripts below.
server.js           Zero-dependency static file server for local use.
start.bat           Windows one-click launcher.
manifest.json       Progressive Web App manifest.
sw.js               Service worker: offline cache.
css/
  styles.css        Layout, lessons, lab workspace. Light and dark themes.
  study.css         Flashcards, tests, games, achievements.
js/
  curriculum.js     All lessons, quizzes and labs (content only).
  studydata.js      Domains, flashcards, extra test questions, XP levels (content only).
  app.js            Routing, sidebar, lessons, lab workspace, XP and progress.
  study.js          Flashcards, practice tests, glossary, games, achievements, stats.
  runners.js        Main-thread wrapper that manages the workers and the timeout.
  worker.js         Runs Python, JavaScript and SQL and grades labs.
```

Everything is plain HTML, CSS and JavaScript. There is no framework, no bundler and no `package.json`.

## Adding your own content

All content lives in two data files. You do not need to touch the app code.

### A lesson with a lab

Add an object to a unit's `lessons` array in `js/curriculum.js`:

```js
{
  id: 'py-example',                 // unique, used in the URL
  title: 'My new lesson',
  minutes: 10,
  content: `
    <p>Lesson text is HTML.</p>
    <pre data-run="python">print("This block gets a Run button")</pre>`,
  quiz: [
    { q: 'What is 2 + 2?', options: ['3', '4', '5'], answer: 1, explain: 'Two plus two is four.' },
  ],
  lab: {
    id: 'lab-py-example',           // unique
    title: 'Double it',
    prompt: '<p>Write <code>double(n)</code> that returns twice <code>n</code>.</p>',
    starter: 'def double(n):\n    pass\n',
    solution: 'def double(n):\n    return n * 2\n',
    hints: ['Use <code>return n * 2</code>.'],
    tests: [
      { name: 'double(4) is 8', code: 'assert double(4) == 8, f"double(4) returned {double(4)}"' },
    ],
  },
}
```

Notes:

- Inside `<pre data-run="...">` blocks, write `&lt;` for `<` and `&amp;` for `&`.
- Python and JavaScript tests can read `output` (everything the program printed) and `source` (the code as text).
- SQL labs take a `setup` script that builds the database, and tests are just `{ name, ordered }`. Set `ordered: true` when row order matters. An optional `check` query is run on both databases instead of comparing the learner's last result.

### Check your labs

After editing, open the app, then run this in the browser's developer console:

```js
await selfTest()
```

It runs every lab's `solution` and `starter` through the tests and returns a report. Every row should show `solutionPasses: true` and `starterFails: true`.

### Flashcards and test questions

In `js/studydata.js`:

```js
// FLASHCARDS
{ term: 'Variable', def: 'A name that refers to a stored value.', domain: 'prog' },

// EXTRA_QUESTIONS
{ domain: 'prog', q: 'What is the type of <code>"42"</code>?', options: ['Integer', 'String'], answer: 1, explain: 'Quotes make it text.' },
```

Flashcards automatically feed the glossary and every game. Lesson quiz questions are added to the test bank automatically. To add a domain, add an entry to `DOMAINS` with a label and a colour.

## Hosting it

The app is static files, so it can be hosted anywhere that serves files: GitHub Pages, Netlify, Cloudflare Pages or your own web server. No server-side code runs.

For GitHub Pages: in the repository, go to **Settings → Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save. `server.js` and `start.bat` are only for running it locally and are ignored by a static host.

## Privacy

- **Nothing you do leaves your browser.** Progress, saved code, XP and test history are stored in your browser's `localStorage` on your device. There is no account, no analytics, no tracking and no cookies.
- **Your code runs locally.** It is never uploaded.
- **The only network requests** are downloads of open-source libraries from two public CDNs (`cdnjs.cloudflare.com` and `cdn.jsdelivr.net`). As with any website, those CDNs see your IP address when your browser fetches a file.
- **To erase everything**, use *Stats → Reset all progress*, or clear the site's data in your browser.

Progress does not sync between browsers or devices.

## Security notes

- `server.js` listens on `127.0.0.1` only, so the app is not exposed to other devices on your network. It serves `GET` and `HEAD` requests, refuses paths outside the project folder, and refuses hidden files and folders such as `.git`.
- Editor files loaded from the CDN in `index.html` are pinned to exact versions with [Subresource Integrity](https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity) hashes. The language runtimes loaded inside the worker are pinned to exact versions.
- Code typed into a lab runs in a Web Worker. It has no access to the page or to saved progress, but it is still ordinary code running in your browser under this site's origin. Only run code you understand, as you would in any online editor.
- Lab solutions ship in the page source. This is a learning tool, not an exam system.

## Built with

| Library | Purpose | License |
|---|---|---|
| [Pyodide](https://github.com/pyodide/pyodide) 0.26 | Python in the browser | MPL-2.0 |
| [sql.js](https://github.com/sql-js/sql.js) 1.10 | SQLite in the browser | MIT |
| [CodeMirror](https://codemirror.net/5/) 5.65 | Code editor | MIT |

All three are loaded from CDNs at runtime. None of their code is stored in this repository.

## License

[MIT](LICENSE). You are free to use, change and share this project, including in classrooms.
