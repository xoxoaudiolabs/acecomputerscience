/* Ace Computer Science study data: domains, flashcards and the practice-test bank.
   The lesson quizzes in curriculum.js are added to the bank automatically. */

const DOMAINS = {
  prog: { label: 'Programming basics', color: '#6366f1' },
  control: { label: 'Functions and control flow', color: '#0ea5e9' },
  data: { label: 'Data structures', color: '#10b981' },
  algo: { label: 'Algorithms', color: '#f59e0b' },
  js: { label: 'JavaScript and the web', color: '#ca8a04' },
  db: { label: 'Databases and SQL', color: '#14b8a6' },
  systems: { label: 'Computers and data', color: '#ec4899' },
};

/* Which domain each course unit's quiz questions belong to. */
const UNIT_DOMAIN = { foundations: 'prog', functions: 'control', loops: 'control', collections: 'data', algorithms: 'algo', javascript: 'js', sql: 'db' };

const XP_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600, 6000, 8000];

const FLASHCARDS = [
  /* ===== Programming basics ===== */
  { term: 'Variable', def: 'A name that refers to a stored value. The value can be read and replaced while the program runs.', domain: 'prog' },
  { term: 'Assignment', def: 'Storing a value under a name, written with a single equals sign: score = 10.', domain: 'prog' },
  { term: 'Data type', def: 'The kind of a value, such as integer, float, string or Boolean. It decides what you can do with the value.', domain: 'prog' },
  { term: 'Integer', def: 'A whole number with no decimal point, such as 7 or -12.', domain: 'prog' },
  { term: 'Float', def: 'A number with a decimal point, such as 3.14. Short for floating-point number.', domain: 'prog' },
  { term: 'String', def: 'A sequence of characters (text), written inside quotes.', domain: 'prog' },
  { term: 'Boolean', def: 'A value that is either True or False. Named after the mathematician George Boole.', domain: 'prog' },
  { term: 'Expression', def: 'A piece of code that produces a value, such as 2 + 3 or len(name).', domain: 'prog' },
  { term: 'Operator', def: 'A symbol that performs a calculation or comparison, such as +, *, == or <.', domain: 'prog' },
  { term: 'Modulo', def: 'The remainder operator, written %. 17 % 5 is 2. Often used to test whether a number is even.', domain: 'prog' },
  { term: 'Integer division', def: 'Division that throws away the fraction, written // in Python. 7 // 2 is 3.', domain: 'prog' },
  { term: 'Concatenation', def: 'Joining strings end to end, usually with +. "ab" + "cd" gives "abcd".', domain: 'prog' },
  { term: 'Index', def: 'The position of an item in a string or list. Counting starts at 0.', domain: 'prog' },
  { term: 'Slice', def: 'A copy of part of a string or list, written [start:end]. The end position is not included.', domain: 'prog' },
  { term: 'Comment', def: 'A note in the code for humans that the computer ignores. In Python it starts with #.', domain: 'prog' },
  { term: 'Syntax error', def: 'A mistake in the spelling or grammar of code that stops the program from running at all.', domain: 'prog' },
  { term: 'Type conversion', def: 'Changing a value from one type to another, such as str(42) or int("7").', domain: 'prog' },
  { term: 'f-string', def: 'A Python string starting with f that fills in the values of expressions written inside curly braces.', domain: 'prog' },

  /* ===== Functions and control flow ===== */
  { term: 'Function', def: 'A named block of code that performs one job and can be run whenever it is needed.', domain: 'control' },
  { term: 'Parameter', def: 'A variable named in a function definition that receives a value when the function is called.', domain: 'control' },
  { term: 'Argument', def: 'The actual value passed to a function when it is called.', domain: 'control' },
  { term: 'Return value', def: 'The result a function hands back to the code that called it.', domain: 'control' },
  { term: 'Function call', def: 'Running a function by writing its name followed by brackets, such as area(3, 4).', domain: 'control' },
  { term: 'Scope', def: 'The part of a program where a variable can be used. A variable made inside a function exists only there.', domain: 'control' },
  { term: 'Condition', def: 'An expression that is either true or false, used to decide what the program does next.', domain: 'control' },
  { term: 'if statement', def: 'Runs a block of code only when its condition is true.', domain: 'control' },
  { term: 'else', def: 'The branch that runs when none of the earlier conditions in an if statement were true.', domain: 'control' },
  { term: 'Comparison operator', def: 'An operator that compares two values and gives True or False: ==, !=, <, >, <=, >=.', domain: 'control' },
  { term: 'Logical operator', def: 'An operator that combines conditions: and, or, not.', domain: 'control' },
  { term: 'Loop', def: 'A structure that repeats a block of code.', domain: 'control' },
  { term: 'while loop', def: 'A loop that repeats for as long as its condition stays true.', domain: 'control' },
  { term: 'for loop', def: 'A loop that runs once for each item in a sequence.', domain: 'control' },
  { term: 'Iteration', def: 'One pass through the body of a loop.', domain: 'control' },
  { term: 'Infinite loop', def: 'A loop whose condition never becomes false, so it never stops.', domain: 'control' },
  { term: 'Accumulator', def: 'A variable created before a loop and updated inside it to build up a total, count or list.', domain: 'control' },
  { term: 'Indentation', def: 'The spaces at the start of a line. Python uses it to show which lines belong to a block.', domain: 'control' },

  /* ===== Data structures ===== */
  { term: 'Data structure', def: 'A way of organising values so they can be stored and used efficiently.', domain: 'data' },
  { term: 'List', def: 'An ordered, changeable collection of values, written in square brackets.', domain: 'data' },
  { term: 'Element', def: 'A single item stored in a list or array.', domain: 'data' },
  { term: 'Append', def: 'To add an item to the end of a list.', domain: 'data' },
  { term: 'Mutable', def: 'Able to be changed after it is created. Lists are mutable; strings are not.', domain: 'data' },
  { term: 'Dictionary', def: 'A collection of key and value pairs. You look a value up by its key.', domain: 'data' },
  { term: 'Key', def: 'The unique label used to look up a value in a dictionary.', domain: 'data' },
  { term: 'KeyError', def: 'The Python error raised when you read a dictionary key that does not exist.', domain: 'data' },
  { term: 'Nested list', def: 'A list that contains other lists, often used for grids and tables.', domain: 'data' },
  { term: 'Tuple', def: 'An ordered collection that cannot be changed after it is created, written in round brackets.', domain: 'data' },
  { term: 'Set', def: 'An unordered collection that holds each value at most once.', domain: 'data' },
  { term: 'Stack', def: 'A collection where the last item added is the first removed (last in, first out).', domain: 'data' },
  { term: 'Queue', def: 'A collection where the first item added is the first removed (first in, first out).', domain: 'data' },
  { term: 'Length', def: 'The number of items in a collection, found with len() in Python.', domain: 'data' },

  /* ===== Algorithms ===== */
  { term: 'Algorithm', def: 'A precise, step-by-step method for solving a problem.', domain: 'algo' },
  { term: 'Linear search', def: 'Checking items one by one from the start until the target is found.', domain: 'algo' },
  { term: 'Binary search', def: 'Finding a value in sorted data by repeatedly looking at the middle and discarding half.', domain: 'algo' },
  { term: 'Big-O notation', def: 'A way of describing how the work an algorithm does grows as its input grows.', domain: 'algo' },
  { term: 'O(1)', def: 'Constant time: the work stays the same however large the input is.', domain: 'algo' },
  { term: 'O(n)', def: 'Linear time: the work grows in step with the size of the input.', domain: 'algo' },
  { term: 'O(log n)', def: 'Logarithmic time: doubling the input adds only one more step. Binary search is an example.', domain: 'algo' },
  { term: 'O(n²)', def: 'Quadratic time: doubling the input makes roughly four times the work. Typical of a loop inside a loop.', domain: 'algo' },
  { term: 'Sorting', def: 'Putting items into order, such as smallest to largest or alphabetical.', domain: 'algo' },
  { term: 'Bubble sort', def: 'A simple sort that repeatedly swaps neighbouring items that are in the wrong order.', domain: 'algo' },
  { term: 'Recursion', def: 'A function solving a problem by calling itself on a smaller version of the problem.', domain: 'algo' },
  { term: 'Base case', def: 'The simple case in a recursive function that is answered directly, which stops the recursion.', domain: 'algo' },
  { term: 'Pseudocode', def: 'An informal description of an algorithm written for people, not for a particular language.', domain: 'algo' },
  { term: 'Trace', def: 'To follow a program by hand, line by line, writing down how each variable changes.', domain: 'algo' },

  /* ===== JavaScript and the web ===== */
  { term: 'JavaScript', def: 'The programming language built into every web browser.', domain: 'js' },
  { term: 'let', def: 'The JavaScript keyword that declares a variable whose value can be changed.', domain: 'js' },
  { term: 'const', def: 'The JavaScript keyword that declares a name that cannot be reassigned.', domain: 'js' },
  { term: 'console.log', def: 'The JavaScript function that prints a value to the console.', domain: 'js' },
  { term: 'Strict equality', def: 'The === operator in JavaScript, which is true only when both the value and the type match.', domain: 'js' },
  { term: 'Array', def: 'JavaScript\'s ordered collection, similar to a Python list.', domain: 'js' },
  { term: 'Object', def: 'A JavaScript collection of named properties, similar to a Python dictionary.', domain: 'js' },
  { term: 'Property', def: 'A named value stored in an object, read with a dot: student.name.', domain: 'js' },
  { term: 'push', def: 'The JavaScript array method that adds an item to the end.', domain: 'js' },
  { term: 'for...of', def: 'The JavaScript loop that visits each item of an array in turn.', domain: 'js' },
  { term: 'HTML', def: 'HyperText Markup Language: describes the structure and content of a web page.', domain: 'js' },
  { term: 'CSS', def: 'Cascading Style Sheets: describes how a web page looks, such as colours and layout.', domain: 'js' },
  { term: 'DOM', def: 'Document Object Model: the browser\'s live, tree-shaped model of a page that JavaScript can change.', domain: 'js' },
  { term: 'Browser', def: 'A program that fetches and displays web pages and runs their JavaScript.', domain: 'js' },

  /* ===== Databases and SQL ===== */
  { term: 'Database', def: 'An organised collection of data that can be searched and updated.', domain: 'db' },
  { term: 'Table', def: 'A set of data arranged in rows and columns, holding one kind of thing.', domain: 'db' },
  { term: 'Row', def: 'One record in a table, such as a single student.', domain: 'db' },
  { term: 'Column', def: 'One field that every row in a table has, such as name or grade.', domain: 'db' },
  { term: 'SQL', def: 'Structured Query Language: the standard language for asking questions of a database.', domain: 'db' },
  { term: 'Query', def: 'A request for data from a database.', domain: 'db' },
  { term: 'SELECT', def: 'The SQL keyword that chooses which columns to return.', domain: 'db' },
  { term: 'WHERE', def: 'The SQL clause that keeps only the rows matching a condition.', domain: 'db' },
  { term: 'ORDER BY', def: 'The SQL clause that sorts the result. Add DESC for largest first.', domain: 'db' },
  { term: 'LIMIT', def: 'The SQL clause that keeps only the first few rows of the result.', domain: 'db' },
  { term: 'Aggregate function', def: 'A function that turns many rows into one value, such as COUNT, SUM, AVG, MIN or MAX.', domain: 'db' },
  { term: 'GROUP BY', def: 'The SQL clause that splits rows into groups so an aggregate is worked out for each group.', domain: 'db' },
  { term: 'JOIN', def: 'Combining rows from two tables that match on a condition given with ON.', domain: 'db' },
  { term: 'Primary key', def: 'A column whose value uniquely identifies each row in a table.', domain: 'db' },
  { term: 'Foreign key', def: 'A column that refers to the primary key of another table, linking the two.', domain: 'db' },
  { term: 'NULL', def: 'The marker a database uses for a missing or unknown value.', domain: 'db' },

  /* ===== Computers and data ===== */
  { term: 'Bit', def: 'The smallest unit of data: a single 0 or 1.', domain: 'systems' },
  { term: 'Byte', def: 'A group of 8 bits. One byte can hold 256 different values.', domain: 'systems' },
  { term: 'Binary', def: 'The base-2 number system, using only the digits 0 and 1. Computers store everything in it.', domain: 'systems' },
  { term: 'Hexadecimal', def: 'The base-16 number system, using 0 to 9 and A to F. A compact way to write binary.', domain: 'systems' },
  { term: 'ASCII', def: 'An early standard that gives each English letter, digit and symbol a number from 0 to 127.', domain: 'systems' },
  { term: 'Unicode', def: 'The standard that gives a number to every character in every writing system, including emoji.', domain: 'systems' },
  { term: 'CPU', def: 'Central Processing Unit: the chip that carries out a program\'s instructions.', domain: 'systems' },
  { term: 'RAM', def: 'Random Access Memory: fast, temporary memory that is cleared when the power goes off.', domain: 'systems' },
  { term: 'Storage', def: 'Where data is kept permanently, such as an SSD or hard drive.', domain: 'systems' },
  { term: 'Operating system', def: 'The software that manages the hardware and runs other programs, such as Windows, macOS or Linux.', domain: 'systems' },
  { term: 'Compiler', def: 'A program that translates all of the source code into machine code before it is run.', domain: 'systems' },
  { term: 'Interpreter', def: 'A program that reads and carries out source code directly, one statement at a time.', domain: 'systems' },
  { term: 'Source code', def: 'The human-readable text of a program, as written by a programmer.', domain: 'systems' },
  { term: 'Bug', def: 'A mistake in a program that makes it behave in a way that was not intended.', domain: 'systems' },
  { term: 'Debugging', def: 'Finding and fixing the mistakes in a program.', domain: 'systems' },
  { term: 'Logic error', def: 'A mistake where the program runs without crashing but produces the wrong result.', domain: 'systems' },
  { term: 'Runtime error', def: 'An error that happens while the program is running, such as dividing by zero.', domain: 'systems' },
  { term: 'IP address', def: 'The numeric address that identifies a device on a network.', domain: 'systems' },
  { term: 'Encryption', def: 'Scrambling data so that only someone with the right key can read it.', domain: 'systems' },
];

const EXTRA_QUESTIONS = [
  /* ===== Programming basics ===== */
  { domain: 'prog', q: 'What is the data type of the value <code>"42"</code>?', options: ['Integer', 'Float', 'String', 'Boolean'], answer: 2, explain: 'The quotes make it text, so it is a string, even though it looks like a number.' },
  { domain: 'prog', q: 'What does <code>print("3" + "4")</code> display?', options: ['7', '34', '"3" + "4"', 'An error'], answer: 1, explain: 'Adding two strings joins them (concatenation).' },
  { domain: 'prog', q: 'Which of these is a valid Python variable name?', options: ['2nd_place', 'second place', 'second_place', 'second-place'], answer: 2, explain: 'Names cannot start with a digit or contain spaces or hyphens.' },
  { domain: 'prog', q: 'What is the value of <code>2 + 3 * 2 ** 2</code>?', options: ['14', '20', '100', '16'], answer: 0, explain: 'Powers first (4), then multiply (12), then add (14).' },
  { domain: 'prog', q: 'What does <code>len("hello world")</code> return?', options: ['10', '11', '2', '12'], answer: 1, explain: 'The space counts as a character: 5 + 1 + 5.' },
  { domain: 'prog', q: 'A program stops before running any line and reports a missing bracket. What kind of error is this?', options: ['Logic error', 'Runtime error', 'Syntax error', 'Rounding error'], answer: 2, explain: 'Syntax errors are grammar mistakes found before the program runs.' },

  /* ===== Functions and control flow ===== */
  { domain: 'control', q: 'In <code>def area(w, h):</code> what are <code>w</code> and <code>h</code>?', options: ['Arguments', 'Parameters', 'Return values', 'Keywords'], answer: 1, explain: 'Parameters are the names in the definition. Arguments are the values passed in a call.' },
  { domain: 'control', q: 'What does this print?<pre>def f(x):\n    x = x + 1\n    return x\n\nn = 5\nf(n)\nprint(n)</pre>', options: ['5', '6', 'None', 'An error'], answer: 0, explain: 'The result of f(n) is thrown away and n itself is never changed.' },
  { domain: 'control', q: 'Which value of <code>x</code> makes <code>x &gt; 3 and x != 5</code> true?', options: ['3', '5', '4', '2'], answer: 2, explain: '4 is greater than 3 and is not 5.' },
  { domain: 'control', q: 'What does <code>not (True or False)</code> evaluate to?', options: ['True', 'False', 'None', 'An error'], answer: 1, explain: 'True or False is True, and not True is False.' },
  { domain: 'control', q: 'How many stars does this print?<pre>for i in range(3):\n    for j in range(2):\n        print("*")</pre>', options: ['3', '5', '6', '2'], answer: 2, explain: 'The inner loop runs 2 times for each of the 3 outer passes.' },
  { domain: 'control', q: 'Which loop is the best fit for "keep asking until the password is correct"?', options: ['A for loop over a range', 'A while loop', 'No loop is needed', 'A nested for loop'], answer: 1, explain: 'You do not know in advance how many tries it will take, so loop while a condition holds.' },

  /* ===== Data structures ===== */
  { domain: 'data', q: 'Which data structure is the best fit for looking up a phone number by a person\'s name?', options: ['List', 'Dictionary', 'String', 'Integer'], answer: 1, explain: 'A dictionary maps a key (the name) straight to a value (the number).' },
  { domain: 'data', q: 'What does this print?<pre>a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))</pre>', options: ['3', '4', '7', 'An error'], answer: 1, explain: 'a and b are two names for the same list, so the change shows through both.' },
  { domain: 'data', q: 'You add plates to a pile and always take the top one. Which structure works this way?', options: ['Queue', 'Stack', 'Dictionary', 'Set'], answer: 1, explain: 'A stack is last in, first out.' },
  { domain: 'data', q: 'What is <code>[10, 20, 30, 40][1:3]</code>?', options: ['[10, 20, 30]', '[20, 30]', '[20, 30, 40]', '[10, 20]'], answer: 1, explain: 'The slice starts at index 1 and stops before index 3.' },
  { domain: 'data', q: 'Which of these cannot be changed after it is created?', options: ['A list', 'A dictionary', 'A string', 'A set'], answer: 2, explain: 'Strings are immutable. Methods like upper() return a new string.' },

  /* ===== Algorithms ===== */
  { domain: 'algo', q: 'A loop inside a loop, each running n times, does roughly how much work?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], answer: 3, explain: 'n passes of n steps each is n times n.' },
  { domain: 'algo', q: 'Reading the first item of a list takes the same time whether the list has 10 or 10 million items. This is:', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], answer: 0, explain: 'Constant time does not depend on the size of the input.' },
  { domain: 'algo', q: 'What must every recursive function have to avoid running forever?', options: ['A loop', 'A base case', 'Two parameters', 'A print statement'], answer: 1, explain: 'The base case is answered directly and stops the chain of calls.' },
  { domain: 'algo', q: 'You have an unsorted list and need to search it once. Which approach is sensible?', options: ['Binary search', 'Linear search', 'Neither will work', 'Bubble search'], answer: 1, explain: 'Binary search needs sorted data. For a single search, sorting first costs more than just looking.' },
  { domain: 'algo', q: 'Binary search checks the middle of [1, 4, 6, 9, 12, 15, 20] for the target 15. The middle is 9. What happens next?', options: ['Search the left half', 'Search the right half', 'Stop: not found', 'Start again from index 0'], answer: 1, explain: '15 is larger than 9, so it can only be in the right half.' },

  /* ===== JavaScript and the web ===== */
  { domain: 'js', q: 'Which language describes the structure and content of a web page?', options: ['CSS', 'HTML', 'SQL', 'Python'], answer: 1, explain: 'HTML gives structure, CSS gives style, JavaScript gives behaviour.' },
  { domain: 'js', q: 'What does <code>"5" === 5</code> evaluate to in JavaScript?', options: ['true', 'false', '10', 'An error'], answer: 1, explain: 'Strict equality also compares types, and a string is not a number.' },
  { domain: 'js', q: 'What is logged?<pre>const nums = [3, 6, 9];\nconsole.log(nums[nums.length - 1]);</pre>', options: ['3', '6', '9', 'undefined'], answer: 2, explain: 'length is 3, so index 2 is the last item.' },
  { domain: 'js', q: 'What marks the start and end of a block of code in JavaScript?', options: ['Indentation', 'Curly braces', 'Square brackets', 'Colons'], answer: 1, explain: 'JavaScript uses { and }. Indentation is only for readability.' },
  { domain: 'js', q: 'Which statement about <code>const</code> is true?', options: ['The name cannot be reassigned', 'The value must be a number', 'It makes arrays impossible to change', 'It is the same as let'], answer: 0, explain: 'const fixes the name to its value, but the contents of an array or object can still change.' },

  /* ===== Databases and SQL ===== */
  { domain: 'db', q: 'What is the job of a primary key?', options: ['To sort the table', 'To uniquely identify each row', 'To encrypt the data', 'To count the rows'], answer: 1, explain: 'No two rows share a primary key value, so it always picks out exactly one row.' },
  { domain: 'db', q: 'Which query counts the students in grade 10?', options: ['SELECT COUNT(*) FROM students WHERE grade = 10;', 'SELECT grade = 10 FROM students;', 'COUNT students WHERE grade = 10;', 'SELECT * FROM students LIMIT 10;'], answer: 0, explain: 'WHERE filters to grade 10 and COUNT(*) counts the rows that are left.' },
  { domain: 'db', q: 'In SQL, how are text values written?', options: ['In single quotes', 'In square brackets', 'With a # in front', 'In curly braces'], answer: 0, explain: 'For example: WHERE title = \'Biology\'.' },
  { domain: 'db', q: 'A column in one table that holds the id of a row in another table is called a:', options: ['Primary key', 'Foreign key', 'Aggregate', 'Query'], answer: 1, explain: 'Foreign keys link tables together and are what JOIN conditions usually match on.' },
  { domain: 'db', q: 'Which clause would you add to get the average score <b>for each</b> course?', options: ['ORDER BY course_id', 'LIMIT 1', 'GROUP BY course_id', 'WHERE course_id'], answer: 2, explain: 'GROUP BY makes one group per course so AVG is calculated for each.' },

  /* ===== Computers and data ===== */
  { domain: 'systems', q: 'How many bits are in one byte?', options: ['2', '4', '8', '16'], answer: 2, explain: 'A byte is 8 bits, enough for 256 different values.' },
  { domain: 'systems', q: 'What is the binary number <code>1010</code> in decimal?', options: ['5', '10', '12', '1010'], answer: 1, explain: '8 + 0 + 2 + 0 = 10.' },
  { domain: 'systems', q: 'What is the decimal number 5 in binary?', options: ['101', '110', '011', '111'], answer: 0, explain: '4 + 0 + 1 = 5, which is 101.' },
  { domain: 'systems', q: 'Which part of a computer carries out a program\'s instructions?', options: ['RAM', 'CPU', 'SSD', 'Monitor'], answer: 1, explain: 'The CPU fetches and executes instructions. RAM and the SSD only hold data.' },
  { domain: 'systems', q: 'What happens to the contents of RAM when the computer is switched off?', options: ['They are saved automatically', 'They are lost', 'They move to the CPU', 'They are compressed'], answer: 1, explain: 'RAM is temporary (volatile) memory. Storage keeps data without power.' },
  { domain: 'systems', q: 'A program runs without crashing but gives the wrong answer. What kind of error is this?', options: ['Syntax error', 'Runtime error', 'Logic error', 'Hardware error'], answer: 2, explain: 'The code is valid but does not do what was intended.' },
  { domain: 'systems', q: 'What is the difference between a compiler and an interpreter?', options: ['A compiler translates the whole program first; an interpreter runs it statement by statement', 'A compiler is for websites only', 'An interpreter is always faster', 'There is no difference'], answer: 0, explain: 'Compilers produce machine code ahead of time. Interpreters execute the source directly.' },
  { domain: 'systems', q: 'How many different values can 3 bits represent?', options: ['3', '6', '8', '9'], answer: 2, explain: 'Each extra bit doubles the count: 2 × 2 × 2 = 8.' },
  { domain: 'systems', q: 'Which standard can represent characters from every language, plus emoji?', options: ['ASCII', 'Unicode', 'Binary', 'HTML'], answer: 1, explain: 'ASCII covers only 128 characters. Unicode covers well over 100,000.' },
  { domain: 'systems', q: 'What is the hexadecimal digit <code>F</code> in decimal?', options: ['10', '15', '16', '6'], answer: 1, explain: 'Hex digits run 0 to 9 and then A = 10 up to F = 15.' },
];
