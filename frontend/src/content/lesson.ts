import type { LessonSection, QuizQuestion } from "./types";
export const lesson = {
  id: "first-program",
  level: 1,
  title: "Your First Python Program",
  subtitle: "Meet Python. Understand every symbol. Make something happen.",
  sections: [
    {
      id: "a",
      title: "Introduction to Python",
      intro:
        "A program is a set of instructions a computer follows. Programming means writing those instructions clearly.",
      paragraphs: [
        "Python is a programming language: a shared set of words and rules for giving a computer instructions. It is used to automate repeated work, analyze information, build websites and tools, and support scientific research. You do not need to know any of those fields to start.",
        "An interpreter is the software that reads Python instructions and carries them out. In this course, a real Python interpreter runs inside your browser. Think of a program as a recipe and the interpreter as the cook following it. Unlike a person, a computer cannot reliably guess what you meant.",
        "Code is the text of those instructions. The editor is where you write it. The console is where this lesson shows output (the information a program displays) and errors (messages explaining what could not be done). Run Code asks the interpreter to execute, or carry out, your instructions.",
        "Python reads ordinary instructions from the top of the file downward. Some punctuation or spelling mistakes stop a program before any instruction can run. Later lessons introduce ways to repeat instructions or choose between them.",
      ],
      mistakes:
        "The computer does not understand a plain English sentence as an instruction. It needs valid Python syntax: the rules for writing code.",
      practice:
        "Locate the lesson outline and continue to the first program. The next sections explain the instruction before you experiment with it.",
    },
    {
      id: "b",
      title: "Your first program",
      intro: "One line is enough to tell Python to display a message.",
      paragraphs: [
        'In print("Hello, World!"), print is the name of an existing action. The parentheses ask Python to perform that action. The quoted text is the message you give it. The output appears without the quotation marks because the marks are code, not part of the message.',
        "The comma and exclamation mark inside this quoted message are ordinary text. They are displayed as written. Spaces inside the quotes are part of the message too.",
        "With two print calls on separate lines, Python runs the first call, then the second. Each print call normally adds a newline: it moves the next output to the next console line. A newline is like pressing Enter in a document.",
      ],
      code: 'print("Hello, World!")\nprint("I am learning Python.")'.replaceAll(
        "\\n",
        "\n",
      ),
      output: "Hello, World!\nI am learning Python.".replaceAll("\\n", "\n"),
      mistakes:
        "Write each instruction on its own line. Do not paste the console output back into the code editor as an instruction.",
      practice:
        "Change only the text inside the first pair of quotes. Run it and compare the output.",
    },
    {
      id: "c",
      title: "Understanding functions",
      intro:
        "A function is a named, reusable action. You ask for that action by calling it.",
      paragraphs: [
        "Imagine a labeled button on a printer. Pressing it starts a familiar task without you repeating every internal step. A function gives programmers a similar shortcut: one name for behavior that can be reused.",
        "A built-in function is provided by Python itself. You can use it without first writing its internal instructions. print is a built-in function that writes a readable representation of information to standard output, which this app shows in the console.",
        'Calling a function means asking it to run. Writing its name followed by parentheses makes a call. An argument is information supplied inside those parentheses for the function to use. In print("Hello"), the string "Hello" is an argument.',
        "Functions help avoid copying the same low-level work again and again. In later lessons you will write your own functions; here you only call one that already exists.",
      ],
      code: 'print("Hello")',
      output: "Hello",
      mistakes:
        "Python names are case-sensitive: print and Print are different names. The built-in function is spelled with a lowercase p.",
      practice: "Call print twice with a different message each time.",
    },
    {
      id: "d",
      title: "Understanding syntax",
      intro:
        "Syntax is the grammar of code. Small symbols tell Python where each instruction starts and ends.",
      paragraphs: [
        "Read the annotated line below from left to right. print identifies the function. The opening parenthesis begins its arguments. The first double quote starts a string. Hello is the text in that string. The second quote ends the string. The closing parenthesis ends the call.",
        "A string is a value containing text. Quotation marks tell Python to treat the characters between them as text instead of searching for a name or instruction.",
        "Single quotes work too: print('Hello') displays the same message. Use matching opening and closing quotes. A double quote cannot close a string opened with a single quote.",
        "The spelling, capitalization and matching punctuation matter. A computer follows these rules rather than interpreting intent like a human reader.",
      ],
      code: 'print("Hello")',
      output: "Hello",
      mistakes:
        "print(Hello) does not mean the message Hello. It asks Python to find a name called Hello. We have not given that name a value.",
      practice:
        "Try single quotes instead of double quotes. Keep both ends matching.",
    },
    {
      id: "e",
      title: "Parentheses and arguments",
      intro:
        "Parentheses distinguish a function name from a request to perform its action.",
      paragraphs: [
        "print by itself refers to the function but does not call it. In this file-style editor it produces no output. Some interactive Python shells display a description of the function instead; that is not print displaying your message.",
        'print() calls the function with no arguments. It displays an empty line. print("Hello") calls it with one string argument and displays Hello followed by a newline.',
        "An opening ( begins the call and a closing ) ends it. Python needs to know where the call stops. Leaving off the closing parenthesis usually produces SyntaxError with a message such as “( was never closed”.",
        'An argument is the value you hand to a function, like a document handed to a printer. You can give print more than one argument, separated by commas outside strings: print("Hello", "Python"). print displays those values with a space between them by default. A comma inside quotes remains part of the text.',
      ],
      code: 'print\nprint()\nprint("Hello")'.replaceAll("\\n", "\n"),
      output: "\nHello".replaceAll("\\n", "\n"),
      mistakes:
        "Empty parentheses do not mean an error. They mean no information was supplied. A missing closing parenthesis is different: the instruction is incomplete.",
      practice: "Run all three forms. Notice the blank line before Hello.",
    },
    {
      id: "f",
      title: "Strings and numbers",
      intro:
        "A value is a piece of information. Its type describes what kind of information it is.",
      paragraphs: [
        'An integer is a whole number, such as 25, with no fractional part. print(25) receives an integer. print("25") receives a string containing the characters 2 and 5. Both look like 25 when displayed, but Python treats them differently.',
        "The + symbol is an operator: a symbol that asks Python to perform an operation. With two numbers, + adds them. Five plus five means putting two groups of five together, making ten. Python evaluates (works out) 5 + 5 before giving the result to print.",
        'With two strings, + joins their text together. This is called concatenation. "5" + "5" makes "55", like placing two letter tiles beside each other. It does not do arithmetic because both values are text.',
        'Python strings can also hold Unicode characters. Unicode is a shared system for representing text from many languages and symbols. A snake character inside quotes is text too: print("Python 🐍") displays Python 🐍. Missing quotes would make Python try to interpret it as code.',
        'Trying to add a number and a string, such as 5 + "5", produces TypeError: the operation is not defined for that combination of types. TypeError is Python telling you the kinds of information do not fit the operation. Later you will learn deliberate type conversion; do not assume Python will guess.',
      ],
      code: 'print(25)\nprint("25")\nprint(5 + 5)\nprint("5" + "5")'.replaceAll(
        "\\n",
        "\n",
      ),
      output: "25\n25\n10\n55".replaceAll("\\n", "\n"),
      mistakes:
        "Identical-looking output does not guarantee identical types. For the integer lab task, supply a number without quotes.",
      practice:
        "Predict each output before running. Then try a different pair of whole numbers.",
    },
    {
      id: "g",
      title: "Comments",
      intro:
        "A comment is a note for people reading code. Python does not execute that note.",
      paragraphs: [
        "The # symbol starts a comment outside a string. Everything from # to the end of that line is ignored by Python. A new line ends the comment, so instructions on following lines can still run.",
        "Comments explain a reason, record an observation, or label a section of a program. Think of them as margin notes on a recipe. They can make code easier to understand when you return later.",
        "You can write a comment on its own line or after an instruction. Inside quotation marks, # is ordinary string text and is displayed. Putting # before an entire print call disables that call for now: Python treats it as a comment.",
      ],
      code: '# A greeting for the reader\nprint("Welcome") # Display the message\nprint("# is text here")'.replaceAll(
        "\\n",
        "\n",
      ),
      output: "Welcome\n# is text here".replaceAll("\\n", "\n"),
      mistakes:
        "A comment does not display in the console. Use print if you want a message to appear as output.",
      practice:
        "Add your own comment above a print call. Run it to confirm only the printed message appears.",
    },
    {
      id: "h",
      title: "Read an error. Find a clue.",
      intro:
        "An error is information about what Python could not do. It is a clue you can use, not a verdict on your ability.",
      paragraphs: [
        "NameError means Python tried to find a name that was not defined. A name is a label for an object or action. Built-in print is defined; Print is not. print(Hello) also searches for a name Hello instead of using text. Put intended text in quotes.",
        "Missing quotes do not always produce SyntaxError. In print(Coding is fun), Python can parse the unquoted words as code, but then reports NameError because the name Coding has no definition. Put the intended message inside quotes. Read the actual error rather than guessing its type from the mistake.",
        "SyntaxError means the code does not follow Python’s grammar. A missing closing quote can produce “unterminated string literal”; a missing parenthesis can produce “was never closed”. Exact error wording varies between Python versions.",
        "Python checks the syntax of the whole program before executing it. A syntax mistake on a later line can prevent earlier print calls from running. A NameError happens during execution, so earlier successful output may already be visible.",
        "A traceback is the error report showing where a failure happened. Read its final line for the error type and message, then look for the indicated line number in your code. Start with spelling, matching quotes and matching parentheses. Change one thing and run again.",
        "An undefined name is a label Python does not know yet. Later you will learn variables, which let you assign values to names. For this lesson, do not invent an unquoted word and expect Python to read it as a message.",
      ],
      code: 'Print("Welcome")',
      mistakes:
        "Do not fix an error by deleting everything immediately. Identify the error type and the smallest relevant change first.",
      practice:
        "Run this broken example, read the real NameError, then correct its capitalization without changing the message.",
    },
  ] satisfies LessonSection[],
};
export const quiz: QuizQuestion[] = [
  {
    id: "q1",
    question: "What does a program do?",
    correct: 1,
    options: [
      {
        text: "Guesses what a person intended.",
        explanation:
          "Computers need precise instructions. They do not reliably guess your intent.",
      },
      {
        text: "Gives a computer instructions to follow.",
        explanation:
          "A program is a set of instructions. Python’s interpreter carries them out.",
      },
      {
        text: "Always builds a website.",
        explanation:
          "Programs can do many kinds of work; displaying a message is a program too.",
      },
    ],
  },
  {
    id: "q2",
    question: "Which line displays the message Hello?",
    correct: 0,
    options: [
      {
        text: 'print("Hello")',
        explanation:
          "The lowercase function name, matching parentheses and quoted string make a valid call.",
      },
      {
        text: 'Print("Hello")',
        explanation:
          "Python is case-sensitive. Print is not the built-in name print.",
      },
      {
        text: "print(Hello)",
        explanation:
          "Without quotes, Hello is a name Python tries to look up, not a text value.",
      },
    ],
  },
  {
    id: "q3",
    question: 'What do the parentheses in print("Hello") do?',
    correct: 2,
    options: [
      {
        text: "Make Hello a string.",
        explanation:
          "Quotation marks make Hello a string; parentheses have a different job.",
      },
      {
        text: "Start a comment.",
        explanation: "The # symbol outside a string starts a comment.",
      },
      {
        text: "Call the function and enclose its arguments.",
        explanation:
          "Parentheses ask the function to run; the value inside is information it receives.",
      },
    ],
  },
  {
    id: "q4",
    question: 'What does print("5" + "5") display?',
    correct: 1,
    options: [
      {
        text: "10",
        explanation:
          "Unquoted numbers add to 10. These quoted values are strings, so + joins their text.",
      },
      {
        text: "55",
        explanation:
          "Both values are strings. Concatenation places their characters next to each other.",
      },
      {
        text: "Nothing",
        explanation:
          "This is a valid print call. It joins the strings and displays the result.",
      },
    ],
  },
  {
    id: "q5",
    question: "What happens when you write print()?",
    correct: 0,
    options: [
      {
        text: "It outputs an empty line.",
        explanation:
          "The function is called with no arguments, and its normal newline is still written.",
      },
      {
        text: "It causes NameError.",
        explanation:
          "print is a defined built-in name. A missing argument is allowed here.",
      },
      {
        text: "It displays the word print.",
        explanation:
          'The function name is code. To display that word you would supply the string "print".',
      },
    ],
  },
];
export const syntaxTokens = [
  {
    token: "print",
    label: "Function name",
    detail: "Find Python’s built-in action for displaying information.",
  },
  {
    token: "(",
    label: "Open the call",
    detail: "Ask the function to run; begin the argument area.",
  },
  {
    token: '"',
    label: "Start the string",
    detail: "Tell Python that text starts here.",
  },
  {
    token: "Hello",
    label: "Text content",
    detail: "These five characters form the message.",
  },
  {
    token: '"',
    label: "End the string",
    detail: "Match the opening quotation mark.",
  },
  {
    token: ")",
    label: "Close the call",
    detail: "End the arguments and complete the function call.",
  },
];
