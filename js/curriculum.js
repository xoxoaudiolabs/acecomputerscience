/* Ace Computer Science curriculum.
   Lesson content is HTML. A <pre data-run="python|javascript|sql"> block becomes a
   live, editable example. Inside those blocks write &lt; for < and &amp; for &.
   Every lab has a solution; run selfTest() in the browser console to check that
   every solution passes its tests and every starter does not. */

const SCHOOL_DB = `
CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, grade INTEGER, gpa REAL);
INSERT INTO students VALUES
  (1,'Ava',9,3.8),(2,'Ben',10,3.1),(3,'Cara',11,3.9),
  (4,'Dev',9,2.7),(5,'Eli',12,3.5),(6,'Fay',10,3.9);
CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT, credits INTEGER);
INSERT INTO courses VALUES (1,'Intro to CS',3),(2,'Algebra',4),(3,'Biology',4),(4,'Art',2);
CREATE TABLE enrollments (student_id INTEGER, course_id INTEGER, score INTEGER);
INSERT INTO enrollments VALUES
  (1,1,95),(1,2,88),(2,1,72),(3,1,91),(3,3,85),(4,2,64),(5,1,80),(5,4,99),(6,3,93);
`;

const SCHOOL_SCHEMA = `
<div class="schema">
  <div><b>students</b><span>id, name, grade, gpa</span></div>
  <div><b>courses</b><span>id, title, credits</span></div>
  <div><b>enrollments</b><span>student_id, course_id, score</span></div>
</div>`;

const CURRICULUM = [
  /* ================= UNIT 1 ================= */
  {
    id: 'foundations',
    title: 'Foundations',
    lang: 'python',
    blurb: 'Print output, store values in variables, and work with numbers and text.',
    lessons: [
      {
        id: 'py-hello',
        title: 'Output and variables',
        minutes: 10,
        content: `
<p>A program is a list of instructions the computer follows from top to bottom. The first instruction most programmers learn is <code>print</code>, which shows something on the screen.</p>
<pre data-run="python">print("Hello, world!")
print(2 + 3)</pre>
<p>Press <b>Run</b> above, then change the text and run it again. Every example in this course is live.</p>
<h3>Variables</h3>
<p>A <b>variable</b> is a name that holds a value. You create one with <code>=</code>, which means "store the value on the right under the name on the left".</p>
<pre data-run="python">player = "Sam"
score = 10
score = score + 5      # replace the old value
print(player, "has", score, "points")</pre>
<p>Text values are called <b>strings</b> and need quotes. Numbers do not. Anything after a <code>#</code> is a comment that Python ignores.</p>
<h3>f-strings</h3>
<p>Put an <code>f</code> before the quotes to drop variables straight into text using curly braces:</p>
<pre data-run="python">city = "Lagos"
temp = 31
print(f"It is {temp} degrees in {city}")</pre>`,
        quiz: [
          {
            q: 'What does this program print?<pre>x = 4\nx = x + 1\nprint(x)</pre>',
            options: ['4', '5', 'x + 1', 'An error'],
            answer: 1,
            explain: 'The second line computes 4 + 1 and stores 5 back into x.',
          },
          {
            q: 'Which line correctly stores the text hello in a variable?',
            options: ['greeting = hello', '"hello" = greeting', 'greeting = "hello"', 'print = hello'],
            answer: 2,
            explain: 'The name goes on the left, and text needs quotes.',
          },
        ],
        lab: {
          id: 'lab-py-hello',
          title: 'Introduce Ada',
          prompt: `<p>Create two variables and use them to print one sentence.</p>
<ol><li>A variable <code>name</code> holding <code>"Ada"</code></li>
<li>A variable <code>age</code> holding <code>36</code></li>
<li>Print exactly: <code>Ada is 36 years old</code></li></ol>`,
          starter: `# 1. Create a variable called name that holds "Ada"\n\n# 2. Create a variable called age that holds 36\n\n# 3. Print: Ada is 36 years old   (use your variables)\n`,
          solution: `name = "Ada"\nage = 36\nprint(f"{name} is {age} years old")\n`,
          hints: [
            'Text needs quotes: <code>name = "Ada"</code>. Numbers do not: <code>age = 36</code>.',
            'An f-string fills in variables: <code>print(f"{name} is {age} years old")</code>',
          ],
          tests: [
            { name: 'name holds "Ada"', code: `assert name == "Ada", "name should be the text Ada"` },
            { name: 'age holds the number 36', code: `assert age == 36 and not isinstance(age, str), "age should be the number 36, without quotes"` },
            { name: 'Prints the sentence', code: `assert output.strip() == "Ada is 36 years old", f"Expected: Ada is 36 years old\\nYou printed: {output.strip() or '(nothing)'}"` },
          ],
        },
      },
      {
        id: 'py-numbers',
        title: 'Numbers and arithmetic',
        minutes: 10,
        content: `
<p>Python has two main kinds of numbers: <b>integers</b> (whole numbers such as <code>7</code>) and <b>floats</b> (numbers with a decimal point such as <code>7.5</code>).</p>
<table class="ref"><tr><th>Operator</th><th>Meaning</th><th>Example</th><th>Result</th></tr>
<tr><td><code>+ - *</code></td><td>add, subtract, multiply</td><td><code>3 * 4</code></td><td>12</td></tr>
<tr><td><code>/</code></td><td>divide (always a float)</td><td><code>7 / 2</code></td><td>3.5</td></tr>
<tr><td><code>//</code></td><td>whole-number division</td><td><code>7 // 2</code></td><td>3</td></tr>
<tr><td><code>%</code></td><td>remainder ("modulo")</td><td><code>7 % 2</code></td><td>1</td></tr>
<tr><td><code>**</code></td><td>power</td><td><code>2 ** 10</code></td><td>1024</td></tr></table>
<pre data-run="python">minutes = 135
hours = minutes // 60
left = minutes % 60
print(hours, "hours and", left, "minutes")</pre>
<p>The remainder operator is surprisingly useful. <code>n % 2 == 0</code> tells you a number is even, and <code>n % 10</code> gives you its last digit.</p>
<h3>Order of operations</h3>
<p>Python follows the same order as maths: powers, then multiply and divide, then add and subtract. Use brackets to be clear.</p>
<pre data-run="python">print(2 + 3 * 4)
print((2 + 3) * 4)</pre>`,
        quiz: [
          {
            q: 'What is the value of <code>17 % 5</code>?',
            options: ['3', '3.4', '2', '85'],
            answer: 2,
            explain: '5 goes into 17 three times (15) with 2 left over. % gives the remainder.',
          },
          {
            q: 'What is the value of <code>9 // 2</code>?',
            options: ['4.5', '4', '5', '1'],
            answer: 1,
            explain: '// divides and throws away the fraction, so 4.5 becomes 4.',
          },
        ],
        lab: {
          id: 'lab-py-numbers',
          title: 'Pizza party',
          prompt: `<p>There are <code>22</code> slices of pizza and <code>5</code> people.</p>
<ol><li>Set <code>each</code> to the number of whole slices each person gets.</li>
<li>Set <code>left</code> to the number of slices left over.</li></ol>
<p>Work them out with operators so the program would still be right if the numbers changed.</p>`,
          starter: `slices = 22\npeople = 5\n\n# How many whole slices does each person get?\neach = 0\n\n# How many slices are left over?\nleft = 0\n\nprint(each, "each,", left, "left over")\n`,
          solution: `slices = 22\npeople = 5\n\neach = slices // people\nleft = slices % people\n\nprint(each, "each,", left, "left over")\n`,
          hints: [
            'Whole-number division is <code>//</code>.',
            'The remainder operator is <code>%</code>: <code>left = slices % people</code>',
          ],
          tests: [
            { name: 'each is 4', code: `assert each == 4, f"each should be 4 but it is {each}"` },
            { name: 'left is 2', code: `assert left == 2, f"left should be 2 but it is {left}"` },
            { name: 'Uses // and %', code: `assert "//" in source and "%" in source, "Calculate the answers with the // and % operators instead of typing them in."` },
          ],
        },
      },
      {
        id: 'py-strings',
        title: 'Working with strings',
        minutes: 12,
        content: `
<p>A string is a sequence of characters. Each character has a position called an <b>index</b>, and counting starts at <b>0</b>.</p>
<pre data-run="python">word = "python"
print(word[0])      # first character
print(word[-1])     # last character
print(len(word))    # how many characters</pre>
<h3>Slicing</h3>
<p><code>word[start:end]</code> copies part of a string, from <code>start</code> up to but not including <code>end</code>.</p>
<pre data-run="python">word = "python"
print(word[0:2])
print(word[2:])     # from index 2 to the end
print(word[-3:])    # the last three characters</pre>
<h3>Joining and methods</h3>
<p>Use <code>+</code> to join strings. Strings also come with built-in tools called <b>methods</b>, which you call with a dot.</p>
<pre data-run="python">first = "grace"
print(first.upper())
print(first.capitalize() + " Hopper")
print("Total: " + str(42))   # numbers must be converted with str()</pre>`,
        quiz: [
          {
            q: 'If <code>s = "robot"</code>, what is <code>s[1]</code>?',
            options: ['r', 'o', 'ro', 'b'],
            answer: 1,
            explain: 'Indexes start at 0, so index 1 is the second character.',
          },
          {
            q: 'If <code>s = "keyboard"</code>, what is <code>s[0:3]</code>?',
            options: ['key', 'keyb', 'ey', 'k'],
            answer: 0,
            explain: 'A slice includes the start index and stops just before the end index: 0, 1, 2.',
          },
        ],
        lab: {
          id: 'lab-py-strings',
          title: 'Username generator',
          prompt: `<p>A school builds usernames from the <b>first letter of the first name</b>, the <b>whole last name</b>, and the <b>last two digits of the birth year</b>, all in lowercase.</p>
<p>For Grace Hopper, born 1906, the username is <code>ghopper06</code>.</p>
<p>Build <code>username</code> from the three variables. Do not type the answer in directly.</p>`,
          starter: `first = "Grace"\nlast = "Hopper"\nyear = 1906\n\n# Build the username from the variables above\nusername = ""\n\nprint(username)\n`,
          solution: `first = "Grace"\nlast = "Hopper"\nyear = 1906\n\nusername = (first[0] + last).lower() + str(year)[-2:]\n\nprint(username)\n`,
          hints: [
            '<code>first[0]</code> is the first letter. <code>.lower()</code> makes text lowercase.',
            'Turn the year into text with <code>str(year)</code>, then slice the last two characters with <code>[-2:]</code>.',
          ],
          tests: [
            { name: 'username is ghopper06', code: `assert username == "ghopper06", f'Expected "ghopper06" but username is "{username}"'` },
            { name: 'Built from the variables', code: `assert "ghopper06" not in source, "Build the username from first, last and year instead of typing it."` },
          ],
        },
      },
    ],
  },

  /* ================= UNIT 2 ================= */
  {
    id: 'functions',
    title: 'Functions and decisions',
    lang: 'python',
    blurb: 'Package code into reusable functions and make programs choose what to do.',
    lessons: [
      {
        id: 'py-functions',
        title: 'Writing functions',
        minutes: 12,
        content: `
<p>A <b>function</b> is a named block of code you can run whenever you need it. You have already used some: <code>print</code> and <code>len</code>. Now you will write your own.</p>
<pre data-run="python">def double(n):
    return n * 2

print(double(4))
print(double(10) + 1)</pre>
<ul><li><code>def</code> starts the definition, followed by the function's name.</li>
<li><code>n</code> is a <b>parameter</b>: a variable that receives whatever value is passed in.</li>
<li>The indented lines are the <b>body</b>. Indentation (4 spaces) is how Python knows what belongs to the function.</li>
<li><code>return</code> sends a result back to whoever called the function.</li></ul>
<h3>return is not print</h3>
<p><code>print</code> shows a value to a person. <code>return</code> hands a value back to the program so it can be stored or used in more calculations. Most labs from here on ask you to <b>return</b> the answer.</p>
<pre data-run="python">def full_name(first, last):
    return first + " " + last

name = full_name("Alan", "Turing")   # the result is stored
print(name.upper())</pre>`,
        quiz: [
          {
            q: 'What does this print?<pre>def add(a, b):\n    return a + b\n\nprint(add(2, 3) * 2)</pre>',
            options: ['5', '10', '7', 'Nothing'],
            answer: 1,
            explain: 'add(2, 3) returns 5, and 5 * 2 is 10.',
          },
          {
            q: 'A function body has no <code>return</code> statement. What does calling it give back?',
            options: ['0', 'An error', 'None', 'The last value printed'],
            answer: 2,
            explain: 'Without return, a function gives back the special value None.',
          },
        ],
        lab: {
          id: 'lab-py-functions',
          title: 'Two small functions',
          prompt: `<p>Write two functions.</p>
<ol><li><code>area(width, height)</code> returns the area of a rectangle.</li>
<li><code>greet(name)</code> returns a greeting such as <code>"Hello, Sam!"</code></li></ol>
<p>Both must <b>return</b> their answer, not print it.</p>`,
          starter: `def area(width, height):\n    # return the area\n    pass\n\n\ndef greet(name):\n    # return "Hello, <name>!"\n    pass\n\n\nprint(area(3, 4))\nprint(greet("Sam"))\n`,
          solution: `def area(width, height):\n    return width * height\n\n\ndef greet(name):\n    return f"Hello, {name}!"\n\n\nprint(area(3, 4))\nprint(greet("Sam"))\n`,
          hints: [
            'Replace <code>pass</code> with a return statement: <code>return width * height</code>',
            'For the greeting: <code>return f"Hello, {name}!"</code>',
          ],
          tests: [
            { name: 'area(3, 4) returns 12', code: `assert area(3, 4) == 12, f"area(3, 4) returned {area(3, 4)}"` },
            { name: 'area(10, 0.5) returns 5', code: `assert area(10, 0.5) == 5, f"area(10, 0.5) returned {area(10, 0.5)}"` },
            { name: 'greet("Sam") returns "Hello, Sam!"', code: `assert greet("Sam") == "Hello, Sam!", f'greet("Sam") returned {greet("Sam")!r}'` },
            { name: 'greet works for other names', code: `assert greet("Katherine") == "Hello, Katherine!", f'greet("Katherine") returned {greet("Katherine")!r}'` },
          ],
        },
      },
      {
        id: 'py-if',
        title: 'Making decisions with if',
        minutes: 12,
        content: `
<p>Programs become useful when they can choose. A <b>condition</b> is an expression that is either <code>True</code> or <code>False</code>.</p>
<table class="ref"><tr><th>Comparison</th><th>Meaning</th></tr>
<tr><td><code>==</code></td><td>equal to (two equals signs)</td></tr>
<tr><td><code>!=</code></td><td>not equal to</td></tr>
<tr><td><code>&lt; &nbsp; &gt;</code></td><td>less than, greater than</td></tr>
<tr><td><code>&lt;= &nbsp; &gt;=</code></td><td>at most, at least</td></tr></table>
<pre data-run="python">def describe(temp):
    if temp &gt;= 30:
        return "hot"
    elif temp &gt;= 15:
        return "mild"
    else:
        return "cold"

print(describe(34))
print(describe(15))
print(describe(2))</pre>
<p>Python checks each condition in order and runs the <b>first</b> branch that is true, then skips the rest. That is why <code>describe(34)</code> does not also return "mild".</p>
<h3>Combining conditions</h3>
<p>Use <code>and</code>, <code>or</code> and <code>not</code> to build bigger conditions.</p>
<pre data-run="python">age = 16
has_ticket = True
print(age &gt;= 13 and has_ticket)
print(age &lt; 5 or age &gt;= 65)
print(not has_ticket)</pre>`,
        quiz: [
          {
            q: 'What does this print when <code>n = 10</code>?<pre>if n &gt; 5:\n    print("A")\nelif n &gt; 8:\n    print("B")\nelse:\n    print("C")</pre>',
            options: ['A', 'B', 'A then B', 'C'],
            answer: 0,
            explain: 'Only the first true branch runs. n > 5 is true, so the elif is never checked.',
          },
          {
            q: 'Which expression is True only when <code>x</code> is between 1 and 10 inclusive?',
            options: ['x >= 1 or x <= 10', 'x >= 1 and x <= 10', 'x > 1 and x < 10', 'not x == 10'],
            answer: 1,
            explain: 'Both conditions must hold, so use and. The or version is true for every number.',
          },
        ],
        lab: {
          id: 'lab-py-if',
          title: 'Ticket prices',
          prompt: `<p>Write <code>ticket_price(age)</code> that returns the price of a cinema ticket.</p>
<table class="ref"><tr><th>Age</th><th>Price</th></tr>
<tr><td>Under 5</td><td>0</td></tr>
<tr><td>5 to 17</td><td>8</td></tr>
<tr><td>18 to 64</td><td>12</td></tr>
<tr><td>65 and over</td><td>6</td></tr></table>`,
          starter: `def ticket_price(age):\n    # use if / elif / else to return the right price\n    pass\n\n\nprint(ticket_price(15))\n`,
          solution: `def ticket_price(age):\n    if age < 5:\n        return 0\n    elif age < 18:\n        return 8\n    elif age < 65:\n        return 12\n    else:\n        return 6\n\n\nprint(ticket_price(15))\n`,
          hints: [
            'Start with the youngest group: <code>if age &lt; 5: return 0</code>',
            'Because branches are checked in order, the next one can simply be <code>elif age &lt; 18:</code>',
          ],
          tests: [
            { name: 'Under 5 is free', code: `assert ticket_price(3) == 0, f"ticket_price(3) returned {ticket_price(3)}"` },
            { name: 'A 5 year old pays 8', code: `assert ticket_price(5) == 8, f"ticket_price(5) returned {ticket_price(5)}"` },
            { name: 'A 17 year old pays 8', code: `assert ticket_price(17) == 8, f"ticket_price(17) returned {ticket_price(17)}"` },
            { name: 'An 18 year old pays 12', code: `assert ticket_price(18) == 12, f"ticket_price(18) returned {ticket_price(18)}"` },
            { name: 'A 64 year old pays 12', code: `assert ticket_price(64) == 12, f"ticket_price(64) returned {ticket_price(64)}"` },
            { name: '65 and over pays 6', code: `assert ticket_price(65) == 6 and ticket_price(90) == 6, f"ticket_price(65) returned {ticket_price(65)}"` },
          ],
        },
      },
    ],
  },

  /* ================= UNIT 3 ================= */
  {
    id: 'loops',
    title: 'Loops',
    lang: 'python',
    blurb: 'Repeat work with while and for loops instead of copying code.',
    lessons: [
      {
        id: 'py-while',
        title: 'while loops',
        minutes: 12,
        content: `
<p>A <code>while</code> loop repeats its body for as long as its condition stays true.</p>
<pre data-run="python">count = 3
while count &gt; 0:
    print(count)
    count = count - 1
print("Lift off!")</pre>
<p>Trace it by hand: <code>count</code> is 3, then 2, then 1. When it reaches 0 the condition is false and the loop ends.</p>
<h3>Infinite loops</h3>
<p>If nothing inside the loop ever makes the condition false, it runs forever. Delete the line <code>count = count - 1</code> above and press Run to see what happens. This app stops any program that runs longer than 10 seconds.</p>
<h3>Loops that count something</h3>
<p>A common pattern is to keep a counter and update it each time round.</p>
<pre data-run="python">def halvings(n):
    steps = 0
    while n &gt; 1:
        n = n // 2
        steps = steps + 1
    return steps

print(halvings(64))   # 64, 32, 16, 8, 4, 2, 1</pre>`,
        quiz: [
          {
            q: 'How many times does this loop print?<pre>i = 0\nwhile i &lt; 4:\n    print(i)\n    i = i + 1</pre>',
            options: ['3', '4', '5', 'Forever'],
            answer: 1,
            explain: 'It prints for i = 0, 1, 2 and 3. When i becomes 4 the condition is false.',
          },
          {
            q: 'What is wrong with this loop?<pre>n = 10\nwhile n &gt; 0:\n    print(n)</pre>',
            options: ['Nothing', 'n is never changed, so it never ends', 'while needs an else', 'It prints nothing'],
            answer: 1,
            explain: 'n stays 10 forever, so the condition is always true.',
          },
        ],
        lab: {
          id: 'lab-py-while',
          title: 'The Collatz puzzle',
          prompt: `<p>Pick any positive whole number and repeat this rule:</p>
<ul><li>If the number is <b>even</b>, halve it.</li><li>If it is <b>odd</b>, multiply by 3 and add 1.</li></ul>
<p>Nobody has ever found a starting number that does not eventually reach 1. Starting from 6 the sequence is 6, 3, 10, 5, 16, 8, 4, 2, 1, which takes <b>8 steps</b>.</p>
<p>Write <code>collatz_steps(n)</code> that returns how many steps it takes to reach 1.</p>`,
          starter: `def collatz_steps(n):\n    steps = 0\n    # keep applying the rule until n is 1\n\n    return steps\n\n\nprint(collatz_steps(6))\n`,
          solution: `def collatz_steps(n):\n    steps = 0\n    while n != 1:\n        if n % 2 == 0:\n            n = n // 2\n        else:\n            n = 3 * n + 1\n        steps = steps + 1\n    return steps\n\n\nprint(collatz_steps(6))\n`,
          hints: [
            'The loop should keep going while n is not 1: <code>while n != 1:</code>',
            'A number is even when <code>n % 2 == 0</code>. Use <code>n // 2</code> to halve it so it stays a whole number.',
            'Add 1 to <code>steps</code> inside the loop, once per rule applied.',
          ],
          tests: [
            { name: 'collatz_steps(1) is 0', code: `assert collatz_steps(1) == 0, f"collatz_steps(1) returned {collatz_steps(1)}"` },
            { name: 'collatz_steps(2) is 1', code: `assert collatz_steps(2) == 1, f"collatz_steps(2) returned {collatz_steps(2)}"` },
            { name: 'collatz_steps(6) is 8', code: `assert collatz_steps(6) == 8, f"collatz_steps(6) returned {collatz_steps(6)}"` },
            { name: 'collatz_steps(27) is 111', code: `assert collatz_steps(27) == 111, f"collatz_steps(27) returned {collatz_steps(27)}"` },
          ],
        },
      },
      {
        id: 'py-for',
        title: 'for loops and range',
        minutes: 12,
        content: `
<p>A <code>for</code> loop visits each item in a sequence, one at a time. It is the right choice when you know what you want to go through.</p>
<pre data-run="python">for letter in "code":
    print(letter)</pre>
<h3>range</h3>
<p><code>range(n)</code> produces the numbers 0 up to <b>but not including</b> n. <code>range(a, b)</code> starts at a.</p>
<pre data-run="python">for i in range(3):
    print("lap", i)

for n in range(1, 6):
    print(n, "squared is", n * n)</pre>
<h3>The accumulator pattern</h3>
<p>Start a variable before the loop, update it inside the loop, and use it afterwards. This one pattern solves a huge number of problems: totals, counts, building up strings.</p>
<pre data-run="python">def count_letter(text, target):
    count = 0
    for ch in text:
        if ch == target:
            count = count + 1
    return count

print(count_letter("mississippi", "s"))</pre>`,
        quiz: [
          {
            q: 'Which numbers does <code>range(2, 5)</code> produce?',
            options: ['2, 3, 4, 5', '2, 3, 4', '3, 4, 5', '0, 1, 2, 3, 4'],
            answer: 1,
            explain: 'range starts at the first number and stops before the second.',
          },
          {
            q: 'What does this print?<pre>total = 0\nfor n in range(4):\n    total = total + n\nprint(total)</pre>',
            options: ['4', '10', '6', '0'],
            answer: 2,
            explain: 'range(4) gives 0, 1, 2, 3 and those add up to 6.',
          },
        ],
        lab: {
          id: 'lab-py-for',
          title: 'Totals and counts',
          prompt: `<p>Use the accumulator pattern to write two functions.</p>
<ol><li><code>sum_to(n)</code> returns 1 + 2 + ... + n. For example <code>sum_to(4)</code> is 10, and <code>sum_to(0)</code> is 0.</li>
<li><code>count_vowels(text)</code> returns how many of the letters a, e, i, o, u appear in the text. Capital letters count too.</li></ol>`,
          starter: `def sum_to(n):\n    total = 0\n    # add up 1, 2, ..., n\n\n    return total\n\n\ndef count_vowels(text):\n    count = 0\n    # check every character\n\n    return count\n\n\nprint(sum_to(4))\nprint(count_vowels("banana"))\n`,
          solution: `def sum_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total = total + i\n    return total\n\n\ndef count_vowels(text):\n    count = 0\n    for ch in text.lower():\n        if ch in "aeiou":\n            count = count + 1\n    return count\n\n\nprint(sum_to(4))\nprint(count_vowels("banana"))\n`,
          hints: [
            'To include n itself, loop over <code>range(1, n + 1)</code>.',
            '<code>ch in "aeiou"</code> is True when ch is a vowel.',
            'Handle capitals by looping over <code>text.lower()</code>.',
          ],
          tests: [
            { name: 'sum_to(4) is 10', code: `assert sum_to(4) == 10, f"sum_to(4) returned {sum_to(4)}"` },
            { name: 'sum_to(100) is 5050', code: `assert sum_to(100) == 5050, f"sum_to(100) returned {sum_to(100)}"` },
            { name: 'sum_to(0) is 0', code: `assert sum_to(0) == 0, f"sum_to(0) returned {sum_to(0)}"` },
            { name: 'count_vowels("banana") is 3', code: `assert count_vowels("banana") == 3, f'count_vowels("banana") returned {count_vowels("banana")}'` },
            { name: 'count_vowels("rhythm") is 0', code: `assert count_vowels("rhythm") == 0, f'count_vowels("rhythm") returned {count_vowels("rhythm")}'` },
            { name: 'Capital letters count', code: `assert count_vowels("AEIOU and you") == 8, f'count_vowels("AEIOU and you") returned {count_vowels("AEIOU and you")}, expected 8'` },
          ],
        },
      },
    ],
  },

  /* ================= UNIT 4 ================= */
  {
    id: 'collections',
    title: 'Lists and dictionaries',
    lang: 'python',
    blurb: 'Store many values together and look them up quickly.',
    lessons: [
      {
        id: 'py-lists',
        title: 'Lists',
        minutes: 12,
        content: `
<p>A <b>list</b> holds many values in order. Like strings, lists are indexed from 0, but unlike strings they can be changed.</p>
<pre data-run="python">scores = [72, 95, 88]
print(scores[0])
print(len(scores))

scores.append(60)     # add to the end
scores[0] = 75        # replace an item
print(scores)</pre>
<h3>Looping over a list</h3>
<pre data-run="python">scores = [72, 95, 88]
total = 0
for s in scores:
    total = total + s
print("Total:", total)</pre>
<h3>Building a new list</h3>
<p>Start with an empty list <code>[]</code> and append the items you want to keep. This is the accumulator pattern again.</p>
<pre data-run="python">def passing(scores):
    result = []
    for s in scores:
        if s &gt;= 70:
            result.append(s)
    return result

print(passing([72, 55, 95, 68]))</pre>`,
        quiz: [
          {
            q: 'After this runs, what is <code>len(items)</code>?<pre>items = ["a", "b"]\nitems.append("c")\nitems.append("d")</pre>',
            options: ['2', '3', '4', '5'],
            answer: 2,
            explain: 'The list started with 2 items and two more were appended.',
          },
          {
            q: 'If <code>nums = [5, 10, 15]</code>, which expression gives the last item?',
            options: ['nums[3]', 'nums[-1]', 'nums[len(nums)]', 'nums.last'],
            answer: 1,
            explain: 'Index -1 is the last item. nums[3] is an error because the indexes are 0, 1 and 2.',
          },
        ],
        lab: {
          id: 'lab-py-lists',
          title: 'Averages and evens',
          prompt: `<p>Write two list functions.</p>
<ol><li><code>average(nums)</code> returns the mean of a list of numbers. For an empty list, return <code>0</code>.</li>
<li><code>evens(nums)</code> returns a <b>new list</b> containing only the even numbers, in the same order.</li></ol>`,
          starter: `def average(nums):\n    # return the mean, or 0 for an empty list\n    pass\n\n\ndef evens(nums):\n    result = []\n    # append the even numbers\n\n    return result\n\n\nprint(average([2, 4, 9]))\nprint(evens([1, 2, 3, 4]))\n`,
          solution: `def average(nums):\n    if len(nums) == 0:\n        return 0\n    total = 0\n    for n in nums:\n        total = total + n\n    return total / len(nums)\n\n\ndef evens(nums):\n    result = []\n    for n in nums:\n        if n % 2 == 0:\n            result.append(n)\n    return result\n\n\nprint(average([2, 4, 9]))\nprint(evens([1, 2, 3, 4]))\n`,
          hints: [
            'Check for the empty list first, because dividing by <code>len(nums)</code> would be dividing by zero.',
            'The mean is the total divided by <code>len(nums)</code>.',
            'A number is even when <code>n % 2 == 0</code>.',
          ],
          tests: [
            { name: 'average([2, 4, 9]) is 5', code: `assert average([2, 4, 9]) == 5, f"average([2, 4, 9]) returned {average([2, 4, 9])}"` },
            { name: 'average([1, 2]) is 1.5', code: `assert average([1, 2]) == 1.5, f"average([1, 2]) returned {average([1, 2])}"` },
            { name: 'average([]) is 0', code: `assert average([]) == 0, f"average([]) returned {average([])}"` },
            { name: 'evens([1, 2, 3, 4]) is [2, 4]', code: `assert evens([1, 2, 3, 4]) == [2, 4], f"evens([1, 2, 3, 4]) returned {evens([1, 2, 3, 4])}"` },
            { name: 'evens([7, 9]) is []', code: `assert evens([7, 9]) == [], f"evens([7, 9]) returned {evens([7, 9])}"` },
            { name: 'evens does not change the original list', code: `_orig = [1, 2, 3, 4]\nevens(_orig)\nassert _orig == [1, 2, 3, 4], "evens should build a new list and leave the original alone"` },
          ],
        },
      },
      {
        id: 'py-dicts',
        title: 'Dictionaries',
        minutes: 12,
        content: `
<p>A <b>dictionary</b> stores pairs: a <b>key</b> and the <b>value</b> that goes with it. Instead of asking "what is at position 2?", you ask "what goes with this key?".</p>
<pre data-run="python">ages = {"Ada": 36, "Alan": 41}
print(ages["Ada"])

ages["Grace"] = 85      # add a new pair
ages["Ada"] = 37        # change a value
print(ages)</pre>
<h3>Checking and looping</h3>
<p>Asking for a key that is not there causes a <code>KeyError</code>, so check with <code>in</code> first.</p>
<pre data-run="python">stock = {"apples": 4, "pears": 0}
if "kiwis" in stock:
    print(stock["kiwis"])
else:
    print("We do not sell kiwis")

for item in stock:
    print(item, "-&gt;", stock[item])</pre>
<h3>Counting with a dictionary</h3>
<pre data-run="python">votes = ["red", "blue", "red", "red"]
tally = {}
for v in votes:
    if v in tally:
        tally[v] = tally[v] + 1
    else:
        tally[v] = 1
print(tally)</pre>`,
        quiz: [
          {
            q: 'What does this print?<pre>d = {"a": 1, "b": 2}\nd["a"] = d["a"] + d["b"]\nprint(d["a"])</pre>',
            options: ['1', '2', '3', '12'],
            answer: 2,
            explain: 'The value for "a" is replaced with 1 + 2.',
          },
          {
            q: 'What happens when you run <code>print(d["z"])</code> and the key "z" is not in <code>d</code>?',
            options: ['It prints None', 'It prints 0', 'A KeyError', 'It adds "z" to d'],
            answer: 2,
            explain: 'Reading a missing key is an error. Check with "z" in d first.',
          },
        ],
        lab: {
          id: 'lab-py-dicts',
          title: 'Word counter',
          prompt: `<p>Write <code>word_count(text)</code> that returns a dictionary saying how many times each word appears.</p>
<ul><li>Words are separated by spaces. <code>text.split()</code> gives you a list of them.</li>
<li>Ignore capitals: <code>"Go"</code> and <code>"go"</code> are the same word, stored in lowercase.</li></ul>
<p>Example: <code>word_count("the cat and the hat")</code> returns <code>{"the": 2, "cat": 1, "and": 1, "hat": 1}</code></p>`,
          starter: `def word_count(text):\n    counts = {}\n    # loop over the words and update counts\n\n    return counts\n\n\nprint(word_count("the cat and the hat"))\n`,
          solution: `def word_count(text):\n    counts = {}\n    for word in text.lower().split():\n        if word in counts:\n            counts[word] = counts[word] + 1\n        else:\n            counts[word] = 1\n    return counts\n\n\nprint(word_count("the cat and the hat"))\n`,
          hints: [
            'Loop with <code>for word in text.lower().split():</code>',
            'If the word is already a key, add 1 to its value. Otherwise set it to 1.',
          ],
          tests: [
            { name: 'Counts repeated words', code: `_r = word_count("the cat and the hat")\nassert _r == {"the": 2, "cat": 1, "and": 1, "hat": 1}, f"Returned {_r}"` },
            { name: 'Ignores capitals', code: `_r = word_count("Go go GO")\nassert _r == {"go": 3}, f'word_count("Go go GO") returned {_r}'` },
            { name: 'Empty text gives an empty dictionary', code: `_r = word_count("")\nassert _r == {}, f'word_count("") returned {_r}'` },
          ],
        },
      },
    ],
  },

  /* ================= UNIT 5 ================= */
  {
    id: 'algorithms',
    title: 'Algorithms',
    lang: 'python',
    blurb: 'Search data step by step and see why some methods are much faster.',
    lessons: [
      {
        id: 'algo-linear',
        title: 'Linear search',
        minutes: 12,
        content: `
<p>An <b>algorithm</b> is a precise set of steps for solving a problem. Python has built-in tools such as <code>max()</code> and <code>.index()</code>, but writing them yourself shows how they work and what they cost.</p>
<h3>Checking every item</h3>
<p><b>Linear search</b> looks at items one by one until it finds the target.</p>
<pre data-run="python">def contains(items, target):
    for item in items:
        if item == target:
            return True     # found it, stop early
    return False            # looked at everything

print(contains([4, 8, 15, 16], 15))
print(contains([4, 8, 15, 16], 23))</pre>
<p>Notice where <code>return False</code> sits: <b>after</b> the loop, not inside it. You can only say "not found" once you have looked at everything.</p>
<h3>When you need the position</h3>
<pre data-run="python">names = ["Ava", "Ben", "Cara"]
for i in range(len(names)):
    print(i, names[i])</pre>
<h3>How much work is it?</h3>
<p>With 10 items, linear search needs at most 10 checks. With a million items, up to a million. The work grows in step with the size of the data. Computer scientists write this as <b>O(n)</b>, read "order n".</p>`,
        quiz: [
          {
            q: 'A linear search looks for a value in a list of 500 items, and the value is not there. How many items does it check?',
            options: ['1', '250', '500', '9'],
            answer: 2,
            explain: 'It can only be sure the value is missing after checking every item.',
          },
          {
            q: 'To find the largest number in a list by hand, what should you remember as you go?',
            options: ['The first item only', 'The largest value seen so far', 'Every value', 'The length of the list'],
            answer: 1,
            explain: 'Keep the best so far and replace it whenever you meet something bigger.',
          },
        ],
        lab: {
          id: 'lab-algo-linear',
          title: 'Build your own search tools',
          prompt: `<p>Write these two functions <b>without</b> using Python's built-in <code>max()</code> or <code>.index()</code>.</p>
<ol><li><code>find_max(nums)</code> returns the largest number in a non-empty list.</li>
<li><code>index_of(items, target)</code> returns the index of the first item equal to <code>target</code>, or <code>-1</code> if it is not in the list.</li></ol>`,
          starter: `def find_max(nums):\n    largest = nums[0]\n    # compare largest with every number\n\n    return largest\n\n\ndef index_of(items, target):\n    # return the index of target, or -1\n    pass\n\n\nprint(find_max([3, 9, 4]))\nprint(index_of(["a", "b", "c"], "c"))\n`,
          solution: `def find_max(nums):\n    largest = nums[0]\n    for n in nums:\n        if n > largest:\n            largest = n\n    return largest\n\n\ndef index_of(items, target):\n    for i in range(len(items)):\n        if items[i] == target:\n            return i\n    return -1\n\n\nprint(find_max([3, 9, 4]))\nprint(index_of(["a", "b", "c"], "c"))\n`,
          hints: [
            'In find_max, loop over the numbers and update <code>largest</code> whenever you see a bigger one.',
            'In index_of, loop with <code>for i in range(len(items)):</code> so you know the position.',
            'Put <code>return -1</code> after the loop, not inside it.',
          ],
          tests: [
            { name: 'find_max([3, 9, 4]) is 9', code: `assert find_max([3, 9, 4]) == 9, f"find_max([3, 9, 4]) returned {find_max([3, 9, 4])}"` },
            { name: 'find_max works with negative numbers', code: `assert find_max([-5, -2, -9]) == -2, f"find_max([-5, -2, -9]) returned {find_max([-5, -2, -9])}"` },
            { name: 'find_max works when the largest is last', code: `assert find_max([1, 2, 3, 40]) == 40, f"find_max([1, 2, 3, 40]) returned {find_max([1, 2, 3, 40])}"` },
            { name: 'index_of finds the position', code: `assert index_of(["a", "b", "c"], "c") == 2, f'index_of(["a", "b", "c"], "c") returned {index_of(["a", "b", "c"], "c")}'` },
            { name: 'index_of returns the first match', code: `assert index_of([7, 5, 7], 7) == 0, f"index_of([7, 5, 7], 7) returned {index_of([7, 5, 7], 7)}"` },
            { name: 'index_of returns -1 when missing', code: `assert index_of([1, 2, 3], 9) == -1, f"index_of([1, 2, 3], 9) returned {index_of([1, 2, 3], 9)}"` },
            { name: 'No built-in max() or .index()', code: `import re\nassert not re.search(r"(?<![A-Za-z0-9_])max\\(", source), "Write the loop yourself instead of calling max()"\nassert ".index(" not in source, "Write the loop yourself instead of calling .index()"` },
          ],
        },
      },
      {
        id: 'algo-binary',
        title: 'Binary search',
        minutes: 15,
        content: `
<p>Think of a number-guessing game from 1 to 100 where you are told "higher" or "lower". You would not guess 1, 2, 3... You would guess 50, and throw away half the numbers with every answer.</p>
<p>That is <b>binary search</b>. It only works on <b>sorted</b> data, but it is extremely fast.</p>
<h3>The idea</h3>
<ol><li>Keep two markers, <code>low</code> and <code>high</code>, around the part of the list that could still contain the target.</li>
<li>Look at the middle item.</li>
<li>If it is the target, you are done. If it is too small, move <code>low</code> past the middle. If it is too big, move <code>high</code> before the middle.</li>
<li>Repeat until the markers cross, which means the target is not there.</li></ol>
<pre data-run="python">nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
low = 0
high = len(nums) - 1

while low &lt;= high:
    mid = (low + high) // 2
    print("low", low, "high", high, "-&gt; looking at", nums[mid])
    if nums[mid] == target:
        print("Found at index", mid)
        break
    elif nums[mid] &lt; target:
        low = mid + 1
    else:
        high = mid - 1</pre>
<p>Change <code>target</code> and run it again to watch the markers move.</p>
<h3>Why it matters</h3>
<p>Each step halves what is left. A million sorted items need at most about 20 looks, where linear search might need a million. This is written <b>O(log n)</b>.</p>`,
        quiz: [
          {
            q: 'What must be true of a list before you can binary search it?',
            options: ['It has an even length', 'It is sorted', 'It contains no duplicates', 'It contains only numbers'],
            answer: 1,
            explain: 'Throwing away half the list is only safe when the items are in order.',
          },
          {
            q: 'Roughly how many items does binary search look at, at most, in a sorted list of 1,000 items?',
            options: ['10', '100', '500', '1,000'],
            answer: 0,
            explain: 'Halving 1,000 ten times gets you down to 1 (2 to the power 10 is 1,024).',
          },
        ],
        lab: {
          id: 'lab-algo-binary',
          title: 'Implement binary search',
          prompt: `<p>Write <code>binary_search(nums, target)</code>.</p>
<ul><li><code>nums</code> is a list of numbers sorted from smallest to largest.</li>
<li>Return the <b>index</b> of <code>target</code>, or <code>-1</code> if it is not in the list.</li></ul>
<p>The last test searches a list of 1,000 numbers and counts how many items you look at, so a linear search will not pass.</p>`,
          starter: `def binary_search(nums, target):\n    low = 0\n    high = len(nums) - 1\n    # repeat while low <= high\n\n    return -1\n\n\nprint(binary_search([2, 5, 8, 12, 16], 12))\n`,
          solution: `def binary_search(nums, target):\n    low = 0\n    high = len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\n\nprint(binary_search([2, 5, 8, 12, 16], 12))\n`,
          hints: [
            'Find the middle index with <code>mid = (low + high) // 2</code>.',
            'If <code>nums[mid]</code> is too small, the target must be to the right: <code>low = mid + 1</code>.',
            'If it is too big, the target must be to the left: <code>high = mid - 1</code>.',
          ],
          tests: [
            { name: 'Finds a value in the middle', code: `assert binary_search([2, 5, 8, 12, 16], 8) == 2, f"binary_search([2, 5, 8, 12, 16], 8) returned {binary_search([2, 5, 8, 12, 16], 8)}"` },
            { name: 'Finds the first and last values', code: `assert binary_search([2, 5, 8, 12, 16], 2) == 0, "Did not find the first item"\nassert binary_search([2, 5, 8, 12, 16], 16) == 4, "Did not find the last item"` },
            { name: 'Returns -1 when the value is missing', code: `assert binary_search([2, 5, 8, 12, 16], 9) == -1, f"Searching for 9 returned {binary_search([2, 5, 8, 12, 16], 9)}"\nassert binary_search([], 3) == -1, "An empty list should give -1"` },
            { name: 'Looks at very few items in a list of 1,000', code: `class _Spy(list):
    looks = 0
    def __getitem__(self, i):
        _Spy.looks += 1
        return list.__getitem__(self, i)
    def __iter__(self):
        _Spy.looks += 100000
        return list.__iter__(self)
    def __contains__(self, x):
        _Spy.looks += 100000
        return list.__contains__(self, x)
    def index(self, *a):
        _Spy.looks += 100000
        return list.index(self, *a)
_data = _Spy(range(0, 2000, 2))
_Spy.looks = 0
_got = binary_search(_data, 1338)
assert _got == 669, f"Expected index 669 but got {_got}"
assert _Spy.looks <= 40, f"Your search looked at far too many items. Halve the search range each step."` },
          ],
        },
      },
    ],
  },

  /* ================= UNIT 6 ================= */
  {
    id: 'javascript',
    title: 'A second language: JavaScript',
    lang: 'javascript',
    blurb: 'See the same ideas in the language that runs in every web browser.',
    lessons: [
      {
        id: 'js-basics',
        title: 'JavaScript basics',
        minutes: 12,
        content: `
<p>Once you know one programming language, the second is much easier, because the ideas are the same and only the spelling changes. JavaScript is the language built into every web browser.</p>
<table class="ref"><tr><th>Idea</th><th>Python</th><th>JavaScript</th></tr>
<tr><td>Output</td><td><code>print(x)</code></td><td><code>console.log(x);</code></td></tr>
<tr><td>Variable</td><td><code>score = 10</code></td><td><code>let score = 10;</code></td></tr>
<tr><td>Blocks</td><td>indentation</td><td>curly braces <code>{ }</code></td></tr>
<tr><td>Equal to</td><td><code>==</code></td><td><code>===</code></td></tr>
<tr><td>and / or / not</td><td><code>and or not</code></td><td><code>&amp;&amp; || !</code></td></tr></table>
<pre data-run="javascript">let score = 10;
const name = "Sam";      // const cannot be reassigned
score = score + 5;
console.log(name + " has " + score + " points");</pre>
<h3>Functions and if</h3>
<pre data-run="javascript">function describe(temp) {
  if (temp &gt;= 30) {
    return "hot";
  } else if (temp &gt;= 15) {
    return "mild";
  } else {
    return "cold";
  }
}

console.log(describe(34));
console.log(describe(2));</pre>
<h3>Loops</h3>
<p>A JavaScript <code>for</code> loop spells out the start, the condition to keep going, and the step.</p>
<pre data-run="javascript">for (let i = 1; i &lt;= 3; i++) {
  console.log("lap " + i);
}</pre>`,
        quiz: [
          {
            q: 'Which line declares a variable whose value can be changed later?',
            options: ['const lives = 3;', 'let lives = 3;', 'lives := 3', 'def lives = 3;'],
            answer: 1,
            explain: 'let allows reassignment. const does not.',
          },
          {
            q: 'What does this print?<pre>for (let i = 0; i &lt; 3; i++) {\n  console.log(i);\n}</pre>',
            options: ['1 2 3', '0 1 2', '0 1 2 3', '3'],
            answer: 1,
            explain: 'i starts at 0 and the loop continues while i is less than 3.',
          },
        ],
        lab: {
          id: 'lab-js-basics',
          title: 'FizzBuzz',
          prompt: `<p>FizzBuzz is a classic warm-up. Write <code>fizzBuzz(n)</code> that returns:</p>
<ul><li><code>"FizzBuzz"</code> if n is divisible by both 3 and 5</li>
<li><code>"Fizz"</code> if n is divisible by 3</li>
<li><code>"Buzz"</code> if n is divisible by 5</li>
<li>otherwise the number <code>n</code> itself</li></ul>
<p>The <code>%</code> operator works the same as in Python.</p>`,
          starter: `function fizzBuzz(n) {\n  // return "Fizz", "Buzz", "FizzBuzz" or n\n\n}\n\nfor (let i = 1; i <= 15; i++) {\n  console.log(fizzBuzz(i));\n}\n`,
          solution: `function fizzBuzz(n) {\n  if (n % 15 === 0) {\n    return "FizzBuzz";\n  } else if (n % 3 === 0) {\n    return "Fizz";\n  } else if (n % 5 === 0) {\n    return "Buzz";\n  }\n  return n;\n}\n\nfor (let i = 1; i <= 15; i++) {\n  console.log(fizzBuzz(i));\n}\n`,
          hints: [
            'n is divisible by 3 when <code>n % 3 === 0</code>.',
            'Check the "both" case first, otherwise 15 will be caught by the Fizz branch.',
          ],
          tests: [
            { name: 'fizzBuzz(3) is "Fizz"', code: `assertEqual(fizzBuzz(3), "Fizz", "fizzBuzz(3)"); assertEqual(fizzBuzz(9), "Fizz", "fizzBuzz(9)");` },
            { name: 'fizzBuzz(5) is "Buzz"', code: `assertEqual(fizzBuzz(5), "Buzz", "fizzBuzz(5)"); assertEqual(fizzBuzz(20), "Buzz", "fizzBuzz(20)");` },
            { name: 'fizzBuzz(15) is "FizzBuzz"', code: `assertEqual(fizzBuzz(15), "FizzBuzz", "fizzBuzz(15)"); assertEqual(fizzBuzz(30), "FizzBuzz", "fizzBuzz(30)");` },
            { name: 'Other numbers are returned unchanged', code: `assertEqual(fizzBuzz(7), 7, "fizzBuzz(7)"); assertEqual(fizzBuzz(1), 1, "fizzBuzz(1)");` },
          ],
        },
      },
      {
        id: 'js-arrays',
        title: 'Arrays and objects',
        minutes: 12,
        content: `
<p>JavaScript's version of a list is an <b>array</b>, and its version of a dictionary is an <b>object</b>.</p>
<pre data-run="javascript">const scores = [72, 95, 88];
scores.push(60);                 // like append
console.log(scores.length);      // like len()
console.log(scores[0]);

let total = 0;
for (const s of scores) {        // like "for s in scores"
  total = total + s;
}
console.log("Total: " + total);</pre>
<h3>Objects</h3>
<pre data-run="javascript">const student = { name: "Ava", grade: 9 };
console.log(student.name);
student.grade = 10;
student.club = "Robotics";       // add a new property
console.log(student);</pre>
<h3>Arrays of objects</h3>
<p>Real data is very often an array of objects, such as a list of students or products.</p>
<pre data-run="javascript">const students = [
  { name: "Ava", gpa: 3.8 },
  { name: "Dev", gpa: 2.7 },
  { name: "Cara", gpa: 3.9 },
];

for (const s of students) {
  if (s.gpa &gt;= 3.5) {
    console.log(s.name + " is on the honour roll");
  }
}</pre>`,
        quiz: [
          {
            q: 'What is logged?<pre>const a = [10, 20];\na.push(30);\nconsole.log(a.length);</pre>',
            options: ['2', '3', '30', 'An error, because a is const'],
            answer: 1,
            explain: 'const stops you reassigning a, but you can still change what is inside the array.',
          },
          {
            q: 'Given <code>const pet = { name: "Rex", legs: 4 };</code> how do you read the number of legs?',
            options: ['pet[legs]', 'pet.legs', 'pet->legs', 'legs(pet)'],
            answer: 1,
            explain: 'Use a dot followed by the property name. pet["legs"] also works.',
          },
        ],
        lab: {
          id: 'lab-js-arrays',
          title: 'Array workout',
          prompt: `<p>Write two functions.</p>
<ol><li><code>sumEvens(nums)</code> returns the total of the even numbers in an array. An empty array gives <code>0</code>.</li>
<li><code>longestWord(words)</code> returns the longest string in an array. If two are equally long, return the one that comes first. An empty array gives <code>""</code>.</li></ol>`,
          starter: `function sumEvens(nums) {\n  let total = 0;\n  // add up the even numbers\n\n  return total;\n}\n\nfunction longestWord(words) {\n  let longest = "";\n  // find the longest word\n\n  return longest;\n}\n\nconsole.log(sumEvens([1, 2, 3, 4]));\nconsole.log(longestWord(["bit", "byte", "kilobyte"]));\n`,
          solution: `function sumEvens(nums) {\n  let total = 0;\n  for (const n of nums) {\n    if (n % 2 === 0) {\n      total = total + n;\n    }\n  }\n  return total;\n}\n\nfunction longestWord(words) {\n  let longest = "";\n  for (const w of words) {\n    if (w.length > longest.length) {\n      longest = w;\n    }\n  }\n  return longest;\n}\n\nconsole.log(sumEvens([1, 2, 3, 4]));\nconsole.log(longestWord(["bit", "byte", "kilobyte"]));\n`,
          hints: [
            'Loop with <code>for (const n of nums) { ... }</code>',
            'A string\'s length is <code>w.length</code>. Replace <code>longest</code> only when the new word is strictly longer.',
          ],
          tests: [
            { name: 'sumEvens([1, 2, 3, 4]) is 6', code: `assertEqual(sumEvens([1, 2, 3, 4]), 6, "sumEvens([1, 2, 3, 4])");` },
            { name: 'sumEvens handles no evens and empty arrays', code: `assertEqual(sumEvens([1, 3, 5]), 0, "sumEvens([1, 3, 5])"); assertEqual(sumEvens([]), 0, "sumEvens([])");` },
            { name: 'longestWord finds the longest', code: `assertEqual(longestWord(["bit", "byte", "kilobyte"]), "kilobyte", "longestWord");` },
            { name: 'longestWord returns the first when tied', code: `assertEqual(longestWord(["red", "blue", "gold"]), "blue", 'longestWord(["red", "blue", "gold"])');` },
            { name: 'longestWord([]) is ""', code: `assertEqual(longestWord([]), "", "longestWord([])");` },
          ],
        },
      },
    ],
  },

  /* ================= UNIT 7 ================= */
  {
    id: 'sql',
    title: 'Data and SQL',
    lang: 'sql',
    blurb: 'Ask questions of a real database: filter, sort, summarise and join tables.',
    lessons: [
      {
        id: 'sql-select',
        title: 'SELECT and WHERE',
        minutes: 10,
        content: `
<p>Most of the world's data lives in <b>databases</b>, organised into <b>tables</b> of rows and columns. <b>SQL</b> is the language for asking them questions. Instead of describing steps, you describe the result you want.</p>
<p>This unit uses a small school database with three tables:</p>
${SCHOOL_SCHEMA}
<pre data-run="sql">SELECT * FROM students;</pre>
<p><code>*</code> means "every column". Usually you name the columns you want:</p>
<pre data-run="sql">SELECT name, grade FROM students;</pre>
<h3>Filtering rows with WHERE</h3>
<pre data-run="sql">SELECT name, gpa
FROM students
WHERE grade = 9;</pre>
<p>Conditions can be combined with <code>AND</code> and <code>OR</code>. Text values go in <b>single quotes</b>, and SQL uses a single <code>=</code> for "equal to".</p>
<pre data-run="sql">SELECT name, grade, gpa
FROM students
WHERE grade &gt;= 10 AND gpa &gt; 3.4;</pre>`,
        quiz: [
          {
            q: 'Which query shows only the titles of courses worth 4 credits?',
            options: [
              'SELECT * FROM courses;',
              'SELECT title FROM courses WHERE credits = 4;',
              'SELECT credits FROM courses WHERE title = 4;',
              'WHERE credits = 4 SELECT title;',
            ],
            answer: 1,
            explain: 'SELECT picks the column, FROM picks the table, WHERE filters the rows.',
          },
          {
            q: 'What does <code>SELECT *</code> mean?',
            options: ['Select every row', 'Select every column', 'Multiply the results', 'Select nothing'],
            answer: 1,
            explain: 'The star stands for all columns. WHERE is what limits the rows.',
          },
        ],
        lab: {
          id: 'lab-sql-select',
          title: 'Honour roll',
          setup: SCHOOL_DB,
          prompt: `<p>The head teacher wants a list for the honour roll.</p>
<p>Write a query that returns the <code>name</code> and <code>gpa</code> of every student whose GPA is <b>3.5 or higher</b>.</p>${SCHOOL_SCHEMA}`,
          starter: `-- name and gpa of students with a gpa of 3.5 or more\nSELECT * FROM students;\n`,
          solution: `SELECT name, gpa FROM students WHERE gpa >= 3.5;`,
          hints: [
            'Replace <code>*</code> with the two columns: <code>SELECT name, gpa</code>',
            'Add a filter: <code>WHERE gpa &gt;= 3.5</code>',
          ],
          tests: [{ name: 'Returns the right rows and columns' }],
        },
      },
      {
        id: 'sql-order',
        title: 'Sorting and limiting',
        minutes: 10,
        content: `
<p>A database does not promise any particular row order unless you ask for one with <code>ORDER BY</code>.</p>
<pre data-run="sql">SELECT name, gpa
FROM students
ORDER BY gpa DESC;</pre>
<p><code>DESC</code> means descending, largest first. The default is <code>ASC</code>, ascending. You can sort by a second column to break ties:</p>
<pre data-run="sql">SELECT name, grade, gpa
FROM students
ORDER BY grade ASC, name ASC;</pre>
<h3>LIMIT</h3>
<p><code>LIMIT</code> keeps only the first few rows, which makes "top N" questions easy.</p>
<pre data-run="sql">SELECT name, gpa
FROM students
ORDER BY gpa ASC
LIMIT 2;</pre>
<h3>The order of the clauses</h3>
<p>The clauses must always be written in this order: <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>, <code>ORDER BY</code>, <code>LIMIT</code>.</p>
<pre data-run="sql">SELECT score
FROM enrollments
WHERE course_id = 1
ORDER BY score DESC
LIMIT 1;</pre>`,
        quiz: [
          {
            q: 'Which clause sorts students from the highest GPA to the lowest?',
            options: ['ORDER BY gpa', 'ORDER BY gpa DESC', 'SORT gpa DOWN', 'LIMIT gpa'],
            answer: 1,
            explain: 'ORDER BY sorts, and DESC puts the largest values first.',
          },
          {
            q: 'Which query is written with its clauses in a valid order?',
            options: [
              'SELECT name FROM students LIMIT 3 ORDER BY name;',
              'SELECT name FROM students ORDER BY name WHERE grade = 9;',
              'SELECT name FROM students WHERE grade = 9 ORDER BY name LIMIT 3;',
              'FROM students SELECT name ORDER BY name;',
            ],
            answer: 2,
            explain: 'The order is SELECT, FROM, WHERE, ORDER BY, LIMIT.',
          },
        ],
        lab: {
          id: 'lab-sql-order',
          title: 'Top three',
          setup: SCHOOL_DB,
          prompt: `<p>Find the <b>three students with the highest GPA</b>.</p>
<ul><li>Return <code>name</code> and <code>gpa</code>.</li>
<li>Highest GPA first.</li>
<li>When two students have the same GPA, list them alphabetically by name.</li></ul>${SCHOOL_SCHEMA}`,
          starter: `-- the three students with the highest gpa\nSELECT name, gpa\nFROM students;\n`,
          solution: `SELECT name, gpa FROM students ORDER BY gpa DESC, name ASC LIMIT 3;`,
          hints: [
            'Sort with <code>ORDER BY gpa DESC</code>.',
            'Break ties by adding a second sort column: <code>ORDER BY gpa DESC, name ASC</code>',
            'Finish with <code>LIMIT 3</code>.',
          ],
          tests: [{ name: 'Returns the top three in the right order', ordered: true }],
        },
      },
      {
        id: 'sql-aggregate',
        title: 'Counting and grouping',
        minutes: 12,
        content: `
<p><b>Aggregate functions</b> squash many rows into a single answer.</p>
<pre data-run="sql">SELECT COUNT(*), AVG(gpa), MAX(gpa), MIN(gpa)
FROM students;</pre>
<p>You can rename a column in the result with <code>AS</code>:</p>
<pre data-run="sql">SELECT COUNT(*) AS ninth_graders
FROM students
WHERE grade = 9;</pre>
<h3>GROUP BY</h3>
<p><code>GROUP BY</code> splits the rows into groups and runs the aggregate once per group. Read this one as "for each course, count the enrolments and average the score".</p>
<pre data-run="sql">SELECT course_id, COUNT(*) AS students, AVG(score) AS average
FROM enrollments
GROUP BY course_id;</pre>
<p>A handy rule: every column in your SELECT should either be inside an aggregate function or be listed in the GROUP BY.</p>`,
        quiz: [
          {
            q: 'What does <code>SELECT COUNT(*) FROM courses;</code> return?',
            options: ['Every course', 'The number of rows in courses', 'The number of columns in courses', 'The total credits'],
            answer: 1,
            explain: 'COUNT(*) counts rows.',
          },
          {
            q: 'You want the highest score in each course. Which clause do you need?',
            options: ['ORDER BY course_id', 'GROUP BY course_id', 'WHERE course_id', 'LIMIT course_id'],
            answer: 1,
            explain: 'GROUP BY makes one group per course so MAX(score) is worked out for each.',
          },
        ],
        lab: {
          id: 'lab-sql-aggregate',
          title: 'Year group report',
          setup: SCHOOL_DB,
          prompt: `<p>Produce a report with <b>one row per grade</b> showing three columns:</p>
<ol><li>the <code>grade</code></li><li>how many students are in it</li><li>their average GPA</li></ol>
<p>Sort the report by grade, lowest first.</p>${SCHOOL_SCHEMA}`,
          starter: `-- grade, number of students, average gpa\nSELECT grade\nFROM students;\n`,
          solution: `SELECT grade, COUNT(*) AS students, AVG(gpa) AS avg_gpa FROM students GROUP BY grade ORDER BY grade;`,
          hints: [
            'Select three things: <code>grade, COUNT(*), AVG(gpa)</code>',
            'Add <code>GROUP BY grade</code> so the count and average are worked out per grade.',
            'Finish with <code>ORDER BY grade</code>.',
          ],
          tests: [{ name: 'One correct row per grade, sorted by grade', ordered: true }],
        },
      },
      {
        id: 'sql-join',
        title: 'Joining tables',
        minutes: 15,
        content: `
<p>Look at the <code>enrollments</code> table. It stores ID numbers, not names:</p>
<pre data-run="sql">SELECT * FROM enrollments LIMIT 4;</pre>
<p>Storing each fact in exactly one place avoids mistakes. If a course is renamed, only one row changes. To see names next to scores, you <b>join</b> the tables back together.</p>
<h3>JOIN ... ON</h3>
<p>The <code>ON</code> part says how the rows match up: an enrolment belongs to the student whose <code>id</code> equals its <code>student_id</code>.</p>
<pre data-run="sql">SELECT students.name, enrollments.score
FROM enrollments
JOIN students ON students.id = enrollments.student_id;</pre>
<p>Writing <code>table.column</code> makes it clear which table a column comes from. It is required when two tables both have a column with the same name, such as <code>id</code>.</p>
<h3>Joining three tables</h3>
<pre data-run="sql">SELECT students.name, courses.title, enrollments.score
FROM enrollments
JOIN students ON students.id = enrollments.student_id
JOIN courses ON courses.id = enrollments.course_id
WHERE courses.title = 'Biology';</pre>`,
        quiz: [
          {
            q: 'What does the ON part of a JOIN do?',
            options: ['Sorts the result', 'Says which rows from the two tables belong together', 'Chooses the columns', 'Limits the number of rows'],
            answer: 1,
            explain: 'ON gives the matching rule, usually an id in one table equal to a reference in the other.',
          },
          {
            q: 'Why does <code>enrollments</code> store <code>student_id</code> rather than the student\'s name?',
            options: ['Numbers look tidier', 'So each fact is stored in only one place', 'SQL cannot store text', 'To hide the names'],
            answer: 1,
            explain: 'If a name changes, it only has to be updated in the students table.',
          },
        ],
        lab: {
          id: 'lab-sql-join',
          title: 'Top marks',
          setup: SCHOOL_DB,
          prompt: `<p>List every result with a <b>score of 90 or more</b>.</p>
<ul><li>Return three columns: the student's <code>name</code>, the course <code>title</code>, and the <code>score</code>.</li>
<li>Highest score first.</li></ul>
<p>You will need to join all three tables.</p>${SCHOOL_SCHEMA}`,
          starter: `-- name, title and score for scores of 90 or more\nSELECT students.name, enrollments.score\nFROM enrollments\nJOIN students ON students.id = enrollments.student_id;\n`,
          solution: `SELECT students.name, courses.title, enrollments.score FROM enrollments JOIN students ON students.id = enrollments.student_id JOIN courses ON courses.id = enrollments.course_id WHERE enrollments.score >= 90 ORDER BY enrollments.score DESC;`,
          hints: [
            'Add a second join: <code>JOIN courses ON courses.id = enrollments.course_id</code>',
            'Add <code>courses.title</code> to the SELECT, between the name and the score.',
            'Filter and sort: <code>WHERE enrollments.score &gt;= 90 ORDER BY enrollments.score DESC</code>',
          ],
          tests: [{ name: 'Returns the right results, highest score first', ordered: true }],
        },
      },
    ],
  },
];

const PLAYGROUND_STARTERS = {
  python: `# Python playground. Write anything you like and press Run.\nfor i in range(1, 6):\n    print("*" * i)\n`,
  javascript: `// JavaScript playground\nconst words = ["ace", "computer", "science"];\nfor (const w of words) {\n  console.log(w.toUpperCase());\n}\n`,
  sql: `-- SQL playground: the school database (students, courses, enrollments)\nSELECT name, grade, gpa\nFROM students\nORDER BY gpa DESC;\n`,
};
