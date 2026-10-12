import type { Exercise } from "./types";
export const exercises: Exercise[] = [
  {
    id: "lab-1",
    title: "Say hello",
    description: "Display exactly Hello, World! on one line.",
    starter: "# Write your first print call below\n",
    expected: "Hello, World!",
    hints: [
      "Choose the built-in function that displays a message.",
      "Put the message inside matching quotation marks, inside the function’s parentheses.",
      "Check the capital H and W, the comma, space and exclamation mark.",
    ],
    explanation: "A print call displays a string and adds a newline.",
  },
  {
    id: "lab-2",
    title: "A small introduction",
    description:
      "Display exactly My name is Alex. This is fictional practice text, not a request for your real name.",
    starter: "",
    expected: "My name is Alex",
    hints: [
      "The entire sentence should be one string.",
      "Keep the spaces inside the quotation marks.",
      "Use lowercase name and a capital A in Alex.",
    ],
    explanation:
      "Spaces and capitalization inside a string are part of the displayed message.",
  },
  {
    id: "lab-3",
    title: "A number, not text",
    description:
      "Print the integer 100 without quotation marks. The value given to print must be an integer, not a string.",
    starter: "print()",
    expected: "100",
    integer: 100,
    hints: [
      "An integer is a whole number.",
      "Write the number directly inside the parentheses.",
      "Quotes would change its type to a string, even if the output looked the same.",
    ],
    explanation:
      'The printed value is an integer. Output alone cannot distinguish 100 from "100", so the checker also inspects the argument type.',
  },
  {
    id: "lab-4",
    title: "Two lines, two calls",
    description:
      "Display Hello and Python on separate lines. Use two print calls.",
    starter: "",
    expected: "Hello\nPython",
    minPrints: 2,
    hints: [
      "Each print call normally moves the output to a new line.",
      "Write one call for Hello and a second call for Python.",
      "Both messages are text, so both need matching quotes.",
    ],
    explanation: "Two print calls run in order and each contributes a newline.",
  },
  {
    id: "lab-5",
    title: "The case of the capital P",
    description: "Fix this code so it displays Welcome.",
    starter: 'Print("Welcome")',
    expected: "Welcome",
    hints: [
      "Read the NameError and look at the function name.",
      "Python treats upper- and lowercase letters differently.",
      "The built-in function starts with a lowercase p.",
    ],
    explanation:
      "print exists as a built-in name. Print is a different, undefined name.",
  },
  {
    id: "lab-6",
    title: "Make it a string",
    description: "Fix this code so it displays Coding is fun.",
    starter: "print(Coding is fun)",
    expected: "Coding is fun",
    hints: [
      "The words are meant as text, not Python instructions.",
      "A string needs a matching pair of quotation marks.",
      "Enclose the whole sentence, including its spaces, in one matching pair.",
    ],
    explanation:
      "Quotation marks tell Python to treat the words as a single text value.",
  },
  {
    id: "lab-7",
    title: "Close the call",
    description: "Fix the incomplete instruction so it displays Keep learning.",
    starter: 'print("Keep learning"',
    expected: "Keep learning",
    hints: [
      "Read the SyntaxError. Which symbol was opened but never closed?",
      "The quotation marks already match.",
      "Every opening parenthesis needs a closing parenthesis.",
    ],
    explanation: "The closing parenthesis finishes the function call.",
  },
  {
    id: "lab-8",
    title: "Text beyond the alphabet",
    description:
      "Display exactly Python 🐍. You can copy the snake character from this description.",
    starter: "",
    expected: "Python 🐍",
    hints: [
      "Python strings can contain Unicode characters, including this snake.",
      "Use one space between Python and the snake.",
      "Keep the entire message inside matching quotes.",
    ],
    explanation:
      "Unicode is a system for representing written characters. Python strings can represent this character as text.",
  },
  {
    id: "lab-9",
    title: "A daily rhythm",
    description:
      "Display Learn, Practice and Grow on separate lines, using three print calls.",
    starter: "",
    expected: "Learn\nPractice\nGrow",
    minPrints: 3,
    hints: [
      "Use one call for each word.",
      "Order matters: the program runs top to bottom.",
      "Check capitals and make sure there are exactly three output lines.",
    ],
    explanation: "Separate calls preserve the intended order and line breaks.",
  },
  {
    id: "lab-10",
    title: "Your welcome program",
    description:
      "Display PyZenCode, Learn Python and Start coding! on separate lines.",
    starter: "# Build your welcome program\n",
    expected: "PyZenCode\nLearn Python\nStart coding!",
    hints: [
      "Start with the first message, then add the next two.",
      "Keep the space in Learn Python and the exclamation mark in Start coding!.",
      "Run your code and compare all three lines with the expected output.",
    ],
    explanation:
      "You have built a small program from reusable function calls and carefully written strings.",
  },
].map((e) => ({
  ...e,
  starter: e.starter.replaceAll("\\n", "\n"),
  expected: e.expected.replaceAll("\\n", "\n"),
}));
export const debugExercises: Exercise[] = [
  {
    id: "debug-case",
    title: "A name Python cannot find",
    description:
      "The program should display Welcome. Run it first and use the error as a clue.",
    starter: 'Print("Welcome")',
    expected: "Welcome",
    hints: [
      "Look at the last line of the error report.",
      "Check the function name against the built-in name you learned.",
      "Python treats print and Print as different names.",
    ],
    explanation:
      "NameError occurred because Print was undefined. The built-in function is lowercase print.",
  },
  {
    id: "debug-quotes",
    title: "A message mistaken for code",
    description: "The program should display Coding is fun.",
    starter: "print(Coding is fun)",
    expected: "Coding is fun",
    hints: [
      "Python is reading words where you meant text.",
      "Strings need boundaries.",
      "Check whether both quotation marks are present around the sentence.",
    ],
    explanation:
      "Python parsed the unquoted words as code and raised NameError for the undefined name Coding. Matching quotes make the intended sentence a string argument instead.",
  },
  {
    id: "debug-close",
    title: "An unfinished instruction",
    description: "The program should display Keep learning.",
    starter: 'print("Keep learning"',
    expected: "Keep learning",
    hints: [
      "The error says an opening symbol was never closed.",
      "Count the opening and closing parentheses.",
      "The quoted text is complete; inspect the end of the call.",
    ],
    explanation:
      "The missing closing parenthesis caused a syntax error before the program could execute.",
  },
];
