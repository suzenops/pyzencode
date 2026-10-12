import type { LessonContent } from "./types";
export const variablesLesson: LessonContent = {
  id: "variables",
  number: 2,
  level: 1,
  title: "Variables and Data Types",
  subtitle: "Store information. Give it a name. Let your program use it.",
  time: "25–35 minutes, excluding the lab",
  prerequisite: "first-program",
  sections: [
    {
      id: "a",
      title: "What is a variable?",
      intro:
        "A variable is a name associated with a value. It lets you refer to information without writing the value every time.",
      paragraphs: [
        'A value is a piece of information, such as the whole number 10 or the text "Alex". Python represents values as objects: things the interpreter can work with. A variable name refers to one of those objects. Assignment means establishing or changing that reference.',
        "A labeled-container analogy can help: imagine a label saying hours attached to your study-time information. But Python variables are not literal physical boxes. The name is a reference to an object; changing the name’s assignment can point it to a different object.",
        "In hours = 10, hours is the name you choose, = is the assignment operator, and 10 is an integer (a whole number). An operator is a symbol asking Python to perform an operation. Here = asks Python to associate the name on the left with the value on the right. Spaces around = improve readability but do not change its meaning.",
        "Python evaluates the right-hand side (works out its value), then binds the name on the left to that value. A binding is this name-to-object association. Once hours has been assigned, print(hours) looks up its value and displays 10. This is a call to the built-in print function: a reusable action already supplied by Python, with hours as its argument (the information passed to it).",
        'Quotation marks change the instruction. print("hours") displays the text hours; print(hours) looks up a name and displays its value. Without an earlier assignment, that lookup raises NameError: Python cannot find the name.',
      ],
      code: 'hours = 10\nprint(hours)\nprint("hours")',
      output: "10\nhours",
      mistakes:
        "Do not put the variable name in quotes when you want its value. Assign the name before using it.",
      practice:
        "Change 10 to 12. Which output line changes, and which stays the same?",
      breakdown: [
        {
          token: "hours",
          label: "Variable name",
          detail: "A descriptive label used to look up a value.",
        },
        {
          token: "=",
          label: "Assignment",
          detail:
            "Associate the left-hand name with the evaluated right-hand value.",
        },
        {
          token: "10",
          label: "Integer value",
          detail: "A whole-number object.",
        },
        {
          token: "print(hours)",
          label: "Look up and display",
          detail:
            "Pass the value associated with hours to print, without quoting the name.",
        },
      ],
      examples: [
        {
          id: "two-names",
          title: "A second stored value",
          code: "days = 3\nprint(days)\nprint(days)",
          output: "3\n3",
          notes: "The same name can be looked up more than once.",
        },
      ],
      quickCheck: {
        id: "l2-quick-a",
        question: 'What does print("hours") display after hours = 10?',
        options: [
          {
            text: "10",
            explanation:
              "Without quotes, hours is a name lookup. Here the quotes make it text.",
          },
          {
            text: "hours",
            explanation:
              "Quotes make a string containing the word hours, not a lookup of the variable.",
          },
        ],
        correct: 1,
      },
    },
    {
      id: "b",
      title: "Why do programmers use variables?",
      intro:
        "Variables help you store information, reuse it and explain what a program’s values mean.",
      paragraphs: [
        "Descriptive names make programs readable: study_hours communicates what 10 represents, while the number alone gives little context. Readability means how easily another person—or your future self—can understand the code.",
        'Reusability means using the same information in several places without repeating its literal value. A literal is a value written directly in code, such as 10 or "Alex". Once student refers to "Alex", several print calls can use the name student.',
        "Storing information means keeping a reference available for later instructions in this program. Like a contact label used throughout a planner, the name gives you a consistent way to find the current value. This does not automatically save it to disk or keep it after this browser interpreter restarts.",
        'Change student to "Morgan" and hours to 12, then run the example again. Every later lookup of these names uses their newly assigned values. You edit the source of the information rather than hunting through repeated hardcoded messages.',
        "Hardcoding means writing a fixed value where a program should use stored information. It is fine to assign an initial value; it is less useful to repeat a whole sentence that should depend on a variable.",
      ],
      code: 'student = "Alex"\nhours = 10\nprint(student)\nprint(hours)\nprint(student)',
      output: "Alex\n10\nAlex",
      mistakes:
        'Writing print("student") repeats a label, not the stored name. Changing a variable affects name lookups, not unrelated quoted text.',
      practice:
        "Try another fictional student name and number of hours. Predict all three output lines before running.",
      examples: [
        {
          id: "change-information",
          title: "Change information in one place",
          code: 'student = "Morgan"\nhours = 12\nprint(student)\nprint(hours)',
          output: "Morgan\n12",
          notes: "Changing the assignments changes the values printed later.",
        },
      ],
      quickCheck: {
        id: "l2-quick-b",
        question:
          'Why use print(student) twice instead of hardcoding "Alex" twice?',
        options: [
          {
            text: "Both calls use the value currently associated with student.",
            explanation:
              "Exactly: one stored value can be reused, making future changes easier.",
          },
          {
            text: "A variable permanently saves the value on your computer.",
            explanation:
              "An assignment keeps information in this running program; it does not automatically save a file.",
          },
        ],
        correct: 0,
      },
    },
    {
      id: "c",
      title: "Assignment and changing values",
      intro:
        "In Python, = performs assignment. It does not assert that two things are mathematically equal.",
      paragraphs: [
        "Read score = 50 as “associate the name score with the value 50”. Read score = 80 as “now associate score with 80”. The second assignment replaces the reference held by this name; it does not print both values or keep a history by itself.",
        "Think of moving the label score from one score card to another. The name stays the same, but its current value changes. When print(score) runs after both assignments, Python looks up the latest association and displays 80.",
        "You can compute a new value from the old one. In points = points + 3, Python first looks up points on the right (5), adds 3 to get 8, and only then reassigns points on the left to 8. Addition combines quantities: a group of five plus a group of three makes eight. The + symbol is the addition operator for numbers.",
        "A right-hand side is the expression after =; an expression is code that evaluates to a value. The left-hand side here is the name being assigned. This order explains why points must already exist before points = points + 3 can work.",
        "Writing 10 = hours is invalid: you cannot assign a new meaning to a literal number. Python reports SyntaxError, meaning the instruction breaks its grammar. Equality comparisons use a different operator introduced in a future lesson; = here is not a question about equality.",
      ],
      code: "score = 50\nscore = 80\nprint(score)",
      output: "80",
      mistakes:
        "In an update, the old value must exist first. Otherwise the right-hand lookup fails with NameError.",
      practice:
        "Add print(score) between the assignments to see the old and new values separately.",
      examples: [
        {
          id: "update-points",
          title: "Use the old value to compute a new value",
          code: "points = 5\npoints = points + 3\nprint(points)",
          output: "8",
          notes:
            "The right-hand expression is evaluated before the name is rebound.",
        },
      ],
      breakdown: [
        {
          token: "points",
          label: "Name to update",
          detail: "The left side will refer to the computed result.",
        },
        {
          token: "=",
          label: "Assign after evaluating",
          detail: "This is an instruction, not a mathematical equality claim.",
        },
        {
          token: "points + 3",
          label: "Read the old value first",
          detail: "Look up 5, add 3 and compute 8 before assignment.",
        },
      ],
      quickCheck: {
        id: "l2-quick-c",
        question:
          "After score = 50 followed by score = 80, what does print(score) display?",
        options: [
          {
            text: "50",
            explanation:
              "The first assignment has been replaced for this name.",
          },
          {
            text: "80",
            explanation:
              "The latest assignment determines the value found by this lookup.",
          },
          {
            text: "50 and 80",
            explanation:
              "Assignment does not automatically display values or keep both under one name.",
          },
        ],
        correct: 1,
      },
    },
    {
      id: "d",
      title: "What are data types?",
      intro:
        "A data type describes what kind of information a value represents and which operations make sense for it.",
      paragraphs: [
        "An integer, abbreviated int in Python, is a whole number with no fractional part. Examples are 10, -5 and 0. Positive numbers are above zero; negative numbers are below zero. In -5, the leading minus sign makes the number negative rather than subtracting one number from another.",
        "A float, abbreviated float, is a number represented using floating-point arithmetic. It is commonly used for values with a decimal part, such as 92.5 or 3.14. The decimal point separates whole and fractional parts: 92.5 is ninety-two and one half. 10.0 is also a float even though its quantity is a whole number.",
        "Floating-point is a finite way of representing numbers using a scaled representation. A useful analogy is a measuring tool with limited precision. Many decimal fractions cannot be represented exactly in the computer’s binary number system, so calculations can show small rounding differences. Binary means representing numbers using two digits, 0 and 1; you do not need to calculate in binary here.",
        'A string, abbreviated str, represents text. Matching quotation marks tell Python where it begins and ends; the marks are not part of the value. "Hello", "Python" and "123" are strings. Single or double quotes work as long as they match.',
        '123 is an integer you can add to another number. "123" is text containing digit characters. For numbers, + adds quantities; for strings, + joins text (concatenation). Like a quantity of tickets versus the digits printed on a ticket, similar-looking output can mean different kinds of information.',
        "Different types are useful for different purposes: a count of hours may be an integer, a fractional grade a float, and a student name a string. Python does not guess how you want to add text and a number directly; that combination raises TypeError, which says the kinds of values do not fit the operation.",
      ],
      code: 'print(10)\nprint(-5)\nprint(0)\nprint(92.5)\nprint(10.0)\nprint("123")',
      output: "10\n-5\n0\n92.5\n10.0\n123",
      mistakes:
        "An output that looks like a number can still come from a string. Keep numeric values unquoted when you need numeric behavior.",
      practice:
        'Compare print(123 + 1) with print("123" + "1"). Why does one display 124 and the other 1231?',
      table: {
        headers: ["Type", "Meaning", "Examples"],
        rows: [
          ["int", "Whole numbers", "10, -5, 0"],
          ["float", "Floating-point numbers", "92.5, 3.14, 10.0"],
          ["str", "Text", '"Hello", "Python", "123"'],
        ],
      },
      examples: [
        {
          id: "types-change-behavior",
          title: "Similar digits, different behavior",
          code: 'print(123 + 1)\nprint("123" + "1")',
          output: "124\n1231",
          notes: "Numbers add; strings concatenate.",
        },
        {
          id: "rounding",
          title: "Floating-point rounding is visible",
          code: "print(0.1 + 0.2)",
          output: "0.30000000000000004",
          notes:
            "This is a representation limitation, not a typing mistake. A later lesson will cover appropriate rounding and precise decimal calculations.",
        },
      ],
      quickCheck: {
        id: "l2-quick-d",
        question: "Which value is a float?",
        options: [
          {
            text: "10",
            explanation: "Without a decimal point, this example is an int.",
          },
          {
            text: "10.0",
            explanation:
              "The decimal-point notation makes this a float, even though the quantity is whole.",
          },
          {
            text: '"10.0"',
            explanation: "Quotation marks make this text, so its type is str.",
          },
        ],
        correct: 1,
      },
    },
    {
      id: "e",
      title: "Checking types with type()",
      intro:
        "The built-in type() function tells you the type of a value rather than making you guess from its appearance.",
      paragraphs: [
        "A function is a named, reusable action. A built-in function comes with Python. Just as print displays information, type examines a value and returns its type. Return means give a result back to the code that called the function.",
        "Parentheses call a function and enclose its arguments: information supplied for the action to use. In type(hours), hours is looked up first and its value is passed as the argument. You could pass a literal directly, as in type(10), but variables let you inspect stored information.",
        "The nested call print(type(hours)) has one call inside another. Python evaluates the inner type(hours) first, then passes the resulting type object to print. The inner pair of parentheses belongs to type; the outer pair belongs to print. Both pairs must close.",
        "A class is Python’s definition of a kind of object. The display <class 'int'> says this value belongs to the int type. Similarly, <class 'float'> names floating-point values and <class 'str'> names text. Angle brackets and the word class here are Python’s printed description, not something you need to type to create an integer.",
        'Calling type("hours") checks a string containing a label; it does not inspect the variable hours. This is the same quoted-text versus name-lookup distinction you already learned. print(type(123)) and print(type("123")) make the otherwise hidden type difference visible.',
      ],
      code: 'hours = 10\ngrade = 92.5\nname = "Alex"\nprint(type(hours))\nprint(type(grade))\nprint(type(name))',
      output: "<class 'int'>\n<class 'float'>\n<class 'str'>",
      mistakes:
        "Match both pairs of parentheses in print(type(hours)). Check an unquoted variable name when you mean its stored value.",
      practice:
        'Try changing hours to 10.0, then to "10". Predict the type before each run.',
      examples: [
        {
          id: "inspect-lookalikes",
          title: "Two values that look the same when printed",
          code: 'print(type(123))\nprint(type("123"))',
          output: "<class 'int'>\n<class 'str'>",
          notes: "type exposes the difference that ordinary output hides.",
        },
      ],
      breakdown: [
        {
          token: "print(",
          label: "Outer function call",
          detail: "Display the result of the inner call.",
        },
        {
          token: "type(",
          label: "Inner function call",
          detail: "Inspect the type of the supplied value.",
        },
        {
          token: "hours",
          label: "Argument lookup",
          detail: "Read the value associated with this name.",
        },
        {
          token: "))",
          label: "Two closing parentheses",
          detail: "Close the inner call, then the outer one.",
        },
      ],
      quickCheck: {
        id: "l2-quick-e",
        question: 'What does type("123") examine?',
        options: [
          {
            text: "An integer",
            explanation: "Quotation marks mean the argument is text.",
          },
          {
            text: "A string",
            explanation: "It examines the quoted text, not a numeric value.",
          },
        ],
        correct: 1,
      },
    },
    {
      id: "f",
      title: "Give names a clear shape",
      intro:
        "Python has rules for valid names. Conventions then help you choose readable names within those rules.",
      paragraphs: [
        "A name can contain letters, digits and underscores, but it cannot start with a digit. The underscore character _ joins words without a space. Python also supports many non-English letters in names; these beginner examples use familiar English letters for clarity.",
        "Spaces separate parts of Python code, so they cannot be inside a single variable name. study_hours is one name; study hours is not. Starting a name with a number, as in 2hours, commonly causes SyntaxError with an “invalid decimal literal” message. study hours = 10 also causes SyntaxError.",
        "Names are case-sensitive: hours, Hours and HOURS are different names. Assigning hours does not define Hours. A lookup with the wrong capitalization can therefore raise NameError.",
        'A keyword is a word reserved by Python for a special language instruction, rather than a name you are free to choose. The word class is reserved, so class = "Python" causes SyntaxError. You will learn its instruction in a future lesson; use course or class_name for your label now.',
        "snake_case is the standard convention for ordinary variable names: use lowercase words joined by underscores, as in first_name or study_hours. A convention is a shared style choice, not a syntax rule. grade_1 is valid too because its digit is not the first character.",
        "Descriptive names explain intent. first_name is clearer than x for a student’s first name. Avoid replacing useful built-in names such as print or type with your own variables: they are not reserved keywords, but doing so can hide the functions you need.",
      ],
      code: 'first_name = "Alex"\nstudy_hours = 10\ngrade_1 = 92.5\nprint(first_name)\nprint(study_hours)\nprint(grade_1)',
      output: "Alex\n10\n92.5",
      mistakes:
        "Choose a valid name, then use exactly the same spelling everywhere. Renaming only the assignment leaves later lookups undefined.",
      practice:
        "Change study_hours to weekly_hours in both the assignment and the print call.",
      table: {
        headers: ["Example", "Valid?", "Reason"],
        rows: [
          ["study_hours", "Yes", "Words joined with an underscore"],
          ["grade_1", "Yes", "A digit can follow the first character"],
          ["2hours", "No", "Starts with a digit: SyntaxError"],
          ["study hours", "No", "Contains a space: SyntaxError"],
          ["class", "No", "Reserved keyword: SyntaxError"],
          [
            "Hours vs hours",
            "Both valid, different names",
            "Wrong lookup spelling can cause NameError",
          ],
        ],
      },
      examples: [
        {
          id: "descriptive-name",
          title: "A readable name with a digit",
          code: 'lesson_2 = "Variables"\nprint(lesson_2)',
          output: "Variables",
          notes:
            "The digit follows letters and an underscore, so the name is valid.",
        },
      ],
      quickCheck: {
        id: "l2-quick-f",
        question: "Which name follows ordinary snake_case and Python’s rules?",
        options: [
          {
            text: "2study_hours",
            explanation: "A name cannot begin with a digit.",
          },
          {
            text: "study hours",
            explanation: "A space cannot be part of one variable name.",
          },
          {
            text: "study_hours",
            explanation:
              "Lowercase words joined by an underscore are valid and readable.",
          },
        ],
        correct: 2,
      },
    },
    {
      id: "g",
      title: "Print text and values together",
      intro:
        "print() can take several arguments, so a sentence can combine fixed text with stored information.",
      paragraphs: [
        'An argument is a value passed to a function. A comma outside quotation marks separates one argument from the next. In print("I studied", hours, "hours"), there are three arguments: a string, the value looked up through hours, and another string.',
        'Python looks up the variable and passes the resulting value to print. print displays each argument with a space between arguments by default, then adds a newline at the end. You do not need to add a space inside "I studied" for this example.',
        'Compare a comma outside a string with a comma inside one. The outside comma separates arguments in the code. The comma in "Hello, Alex" is ordinary text and appears in the output. A colon inside "Student:" is also ordinary text here, so it is displayed exactly.',
        "This gives you a useful sentence template: the words stay the same, while a variable fills in current information. Like a form with a label and a filled-in answer, the fixed text identifies what the stored value means.",
        'Use multiple arguments to display text and numbers together. "I studied " + hours tries to add a string and an integer, which raises TypeError; Python cannot directly concatenate those different types. A comma is a separator for print arguments, not the + operator. Type conversion and formatted strings will get their own future lessons.',
      ],
      code: 'hours = 10\nprint("I studied", hours, "hours")',
      output: "I studied 10 hours",
      mistakes:
        "Do not quote hours when you mean the variable. Extra spaces inside the strings combine with print’s automatic spaces and can produce doubled spaces.",
      practice:
        "Change the number of hours. The sentence should update without editing its fixed words.",
      examples: [
        {
          id: "profile-line",
          title: "A label and a stored value",
          code: 'student_name = "Alex"\nprint("Student:", student_name)',
          output: "Student: Alex",
          notes:
            "The colon is text inside the quoted label; the outside comma separates arguments.",
        },
      ],
      breakdown: [
        {
          token: '"I studied"',
          label: "Fixed text",
          detail: "The first string argument.",
        },
        {
          token: ",",
          label: "Argument separator",
          detail: "A comma outside a string separates values passed to print.",
        },
        {
          token: "hours",
          label: "Stored information",
          detail: "Look up the number without quoting the name.",
        },
        {
          token: '"hours"',
          label: "Unit as text",
          detail: "A quoted word labels the quantity in the sentence.",
        },
      ],
      quickCheck: {
        id: "l2-quick-g",
        question:
          'With hours = 10, what does print("I studied", hours, "hours") display?',
        options: [
          {
            text: "I studied hours hours",
            explanation:
              "The unquoted middle hours is looked up, not printed as a word.",
          },
          {
            text: "I studied 10 hours",
            explanation:
              "print separates the three displayed arguments with spaces.",
          },
        ],
        correct: 1,
      },
    },
    {
      id: "h",
      title: "Mistakes are useful clues",
      intro:
        "Run a broken example, read its actual result, then change the smallest relevant part.",
      paragraphs: [
        "NameError reports a failed name lookup: an undefined variable, wrong capitalization or unquoted intended text can cause it. SyntaxError reports code that Python cannot parse: invalid names or missing punctuation can cause it. TypeError reports an operation that cannot use the supplied kinds of values.",
        'A program can be wrong without raising an error. print("hours") is valid Python, but displays the label hours instead of the value stored in hours. Compare actual output with the intended output, not just whether execution finished.',
        "Read the final line of the traceback (the error report) and its line number. For a name error, compare names character by character with earlier assignments. For invalid syntax, check spaces, the first character of names, and matching punctuation.",
        "The examples below cover undefined variables, quoted labels, capitalization, digit-leading names, spaces in names, missing string quotes and string-plus-integer addition. Each uses the real interpreter. Hints reveal one clue at a time; Check Answer tests your current correction without revealing a full solution.",
        "The word is in the English sentence Coding is fun can accidentally be parsed as Python code when unquoted; in Lesson 1 it produced NameError for Coding. Do not assume all missing quotes produce SyntaxError. Python’s actual error and your intended data type guide the fix.",
      ],
      code: 'hours = 10\nprint("hours")',
      output: "hours",
      mistakes:
        "An error-free run can still display the wrong information. A target-output comparison catches this semantic mistake: a mistake in meaning rather than Python’s grammar.",
      practice:
        "Work through the seven debugging examples below. Run the original first, then correct it.",
      quickCheck: {
        id: "l2-quick-h",
        question: "Which mistake can run without any Python error?",
        options: [
          {
            text: "Printing an undefined name",
            explanation: "Python raises NameError for that lookup.",
          },
          {
            text: 'Printing "hours" when you intended hours',
            explanation:
              "The string is valid code. It is the intended meaning/output that is wrong.",
          },
          {
            text: "Starting a variable name with a digit",
            explanation:
              "That name breaks Python’s grammar and raises SyntaxError.",
          },
        ],
        correct: 1,
      },
    },
  ],
  quiz: [
    {
      id: "l2-q1",
      question: "What is a Python variable?",
      options: [
        {
          text: "A physical box inside the computer",
          explanation:
            "The container is an analogy. A variable is a name referring to an object.",
        },
        {
          text: "A name associated with a value",
          explanation:
            "Correct: assignment binds a name to the object representing the value.",
        },
        {
          text: "Only a number",
          explanation:
            "Variables can refer to numbers, text and many other objects.",
        },
      ],
      correct: 1,
    },
    {
      id: "l2-q2",
      question: "What happens in points = points + 3 after points = 5?",
      options: [
        {
          text: "Python checks whether 5 equals 8",
          explanation:
            "Here = assigns; it is not a mathematical equality check.",
        },
        {
          text: "The new value is assigned before the right side is read",
          explanation:
            "The right-hand expression must be evaluated first using the old value.",
        },
        {
          text: "Python computes 5 + 3, then associates points with 8",
          explanation:
            "The old value is read, the expression is evaluated, and then the name is rebound.",
        },
      ],
      correct: 2,
    },
    {
      id: "l2-q3",
      question: "Which pairing is correct?",
      options: [
        {
          text: '10 is int; 10.0 is float; "10" is str',
          explanation:
            "These literal forms represent three different types, even though their display can look similar.",
        },
        {
          text: "All three are int",
          explanation:
            "A decimal-point form is float, and quotation marks make text.",
        },
        {
          text: "Anything with digits is a number",
          explanation:
            "Quoted digit characters are a string, not a numeric value.",
        },
      ],
      correct: 0,
    },
    {
      id: "l2-q4",
      question: "Which variable name is valid and follows snake_case?",
      options: [
        {
          text: "2study_hours",
          explanation: "Names cannot start with a digit.",
        },
        {
          text: "study hours",
          explanation: "Spaces cannot be inside one variable name.",
        },
        {
          text: "study_hours",
          explanation:
            "Lowercase words joined by underscores are valid and descriptive.",
        },
        {
          text: "class",
          explanation:
            "class is a reserved Python keyword, not an available variable name.",
        },
      ],
      correct: 2,
    },
    {
      id: "l2-q5",
      question:
        'After city = "New York", what does print("City:", city) display?',
      options: [
        {
          text: "City: city",
          explanation: "The unquoted city argument looks up the stored string.",
        },
        {
          text: "City: New York",
          explanation:
            "print displays the label, a default separating space, and the variable’s value.",
        },
        {
          text: "City:New York",
          explanation:
            "Multiple print arguments are separated by a space by default.",
        },
      ],
      correct: 1,
    },
  ],
  exercises: [
    {
      id: "l2-lab-1",
      title: "My first variable",
      description:
        "Create age, assign the integer 20 and print the variable’s value.",
      starter: "# Create age, then display its value\n",
      expected: "20",
      hints: [
        "Assignment associates a name with a value.",
        "Use an unquoted whole number for the integer.",
        "Print the unquoted variable name so the output follows its value.",
      ],
      explanation:
        "age refers to an integer; printing the variable looks up that value.",
      variables: [
        {
          name: "age",
          type: "int",
          value: "20",
        },
      ],
      cases: [
        {
          name: "age changes",
          overrides: {
            age: 21,
          },
          expected: "21",
        },
      ],
    },
    {
      id: "l2-lab-2",
      title: "Store a name",
      description:
        'Create student_name containing the string "Alex", then print the variable. This is fictional practice information.',
      starter: "",
      expected: "Alex",
      hints: [
        "The name contains an underscore, not a space.",
        "Text values need matching quotation marks.",
        "Use the variable in the print call rather than repeating the literal.",
      ],
      explanation:
        "A descriptive name stores a reference to text that can be reused.",
      variables: [
        {
          name: "student_name",
          type: "str",
          value: "Alex",
        },
      ],
      cases: [
        {
          name: "student changes",
          overrides: {
            student_name: "Morgan",
          },
          expected: "Morgan",
        },
      ],
    },
    {
      id: "l2-lab-3",
      title: "Integer and float",
      description:
        "Create hours = 10 and grade = 92.5. Print hours and grade on separate lines.",
      starter: "",
      expected: "10\n92.5",
      hints: [
        "The whole number should be an int; the decimal-point value a float.",
        "Assign both names before printing them.",
        "Separate print calls normally give separate lines.",
      ],
      explanation: "The stored values have distinct int and float types.",
      variables: [
        {
          name: "hours",
          type: "int",
          value: "10",
        },
        {
          name: "grade",
          type: "float",
          value: "92.5",
        },
      ],
      cases: [
        {
          name: "both values change",
          overrides: {
            hours: 12,
            grade: 88.5,
          },
          expected: "12\n88.5",
        },
      ],
    },
    {
      id: "l2-lab-4",
      title: "Print a sentence",
      description:
        'Create language containing "Python". Display I am learning Python using language, rather than hardcoding the complete sentence.',
      starter: "",
      expected: "I am learning Python",
      hints: [
        "Keep the course name in a string variable.",
        "Use fixed text and a variable as separate print arguments.",
        "print inserts a space between arguments by default.",
      ],
      explanation:
        "The sentence follows the stored language, not a fixed full-line literal.",
      variables: [
        {
          name: "language",
          type: "str",
          value: "Python",
        },
      ],
      cases: [
        {
          name: "language changes",
          overrides: {
            language: "Rust",
          },
          expected: "I am learning Rust",
        },
      ],
    },
    {
      id: "l2-lab-5",
      title: "Update a variable",
      description:
        "Assign score the integer 50, update score to the integer 80 and print its final value.",
      starter: "# Assign, update, then display\n",
      expected: "80",
      hints: [
        "The first assignment must happen before the update.",
        "An assignment can replace the value associated with the same name.",
        "Print score after the update; use the name, not fixed text.",
      ],
      explanation:
        "The recorded assignments show 50 before 80; the final lookup uses the updated value.",
      variables: [
        {
          name: "score",
          type: "int",
          value: "80",
          history: ["50", "80"],
        },
      ],
      cases: [
        {
          name: "final score is used",
          overrides: {
            score: 81,
          },
          expected: "81",
        },
      ],
    },
    {
      id: "l2-lab-6",
      title: "Variable names",
      description:
        "Correct the program using the valid variable name study_hours, assigned the integer 10. Use that name when printing.",
      starter: "2hours = 10\nprint(2hours)",
      expected: "10",
      hints: [
        "A name cannot start with a digit.",
        "Use the required descriptive name with an underscore.",
        "Change both the assignment and the later lookup to match.",
      ],
      explanation:
        "study_hours is valid snake_case. Consistent spelling makes the lookup work.",
      variables: [
        {
          name: "study_hours",
          type: "int",
          value: "10",
        },
      ],
      cases: [
        {
          name: "hours change",
          overrides: {
            study_hours: 12,
          },
          expected: "12",
        },
      ],
    },
    {
      id: "l2-lab-7",
      title: "String versus variable",
      description:
        "Fix the program to print the value stored in city, not the word city.",
      starter: 'city = "New York"\nprint("city")',
      expected: "New York",
      hints: [
        "The program runs, but compare its meaning with the target.",
        "Quotation marks make a label into literal text.",
        "A name lookup in a print call uses an unquoted variable.",
      ],
      explanation: "city is looked up rather than displayed as a quoted label.",
      variables: [
        {
          name: "city",
          type: "str",
          value: "New York",
        },
      ],
      cases: [
        {
          name: "city changes",
          overrides: {
            city: "Boston",
          },
          expected: "Boston",
        },
      ],
    },
    {
      id: "l2-lab-8",
      typeOf: "price",
      title: "Check a data type",
      description:
        "Create price = 19.99. Use type() to print the data type of the value associated with price.",
      starter: "",
      expected: "<class 'float'>",
      hints: [
        "A decimal-point value is a float.",
        "type receives the variable as its argument.",
        "Display the type function’s result with print; close both calls.",
      ],
      explanation:
        "The inner call examines price; the outer call displays its type.",
      variables: [
        {
          name: "price",
          type: "float",
          value: "19.99",
        },
      ],
      cases: [
        {
          name: "a different stored type",
          overrides: {
            price: "sample",
          },
          expected: "<class 'str'>",
        },
      ],
    },
    {
      id: "l2-lab-9",
      title: "Calculate study hours",
      description:
        "Create monday_hours = 3 and tuesday_hours = 4. Add those two variables, store the result in total_hours and print total_hours. Addition combines quantities: three hours plus four hours makes seven. + asks Python to add numeric values.",
      starter: "",
      expected: "7",
      hints: [
        "Both source variables must hold integers.",
        "Compute the right-hand sum from the two variable names.",
        "Store the result in total_hours before printing that name.",
      ],
      explanation:
        "The sum is computed from the stored values, so changing them changes the total.",
      variables: [
        {
          name: "monday_hours",
          type: "int",
          value: "3",
        },
        {
          name: "tuesday_hours",
          type: "int",
          value: "4",
        },
        {
          name: "total_hours",
          type: "int",
          value: "7",
        },
      ],
      cases: [
        {
          name: "both days change",
          overrides: {
            monday_hours: 5,
            tuesday_hours: 6,
          },
          expected: "11",
        },
        {
          name: "the total is used",
          overrides: {
            total_hours: 9,
          },
          expected: "9",
        },
      ],
    },
    {
      id: "l2-lab-10",
      title: "Mini-project: Student profile",
      description:
        'Create student_name = "Alex", age = 20, course = "Python" and study_hours = 10. Display the four labeled lines shown, using each variable’s value rather than hardcoding entire lines. A colon inside quoted text is simply part of that label.',
      starter:
        "# Store the four profile values\n# Then display each labeled value\n",
      expected: "Student: Alex\nAge: 20\nCourse: Python\nStudy hours: 10",
      hints: [
        "Start by assigning all four required names with the right types.",
        "Use fixed labels and variable values as print arguments.",
        "Check capitalization, colons, spacing and line order against the target.",
      ],
      explanation:
        "Each labeled line uses stored information. Updating the profile changes the displayed values.",
      variables: [
        {
          name: "student_name",
          type: "str",
          value: "Alex",
        },
        {
          name: "age",
          type: "int",
          value: "20",
        },
        {
          name: "course",
          type: "str",
          value: "Python",
        },
        {
          name: "study_hours",
          type: "int",
          value: "10",
        },
      ],
      cases: [
        {
          name: "all profile values change",
          overrides: {
            student_name: "Morgan",
            age: 21,
            course: "Rust",
            study_hours: 12,
          },
          expected: "Student: Morgan\nAge: 21\nCourse: Rust\nStudy hours: 12",
        },
      ],
    },
  ],
  debugExercises: [
    {
      id: "l2-debug-1",
      title: "An undefined variable",
      description:
        "Define hours as the integer 10 before its lookup. Read the NameError first.",
      starter: "print(hours)",
      expected: "10",
      hints: [
        "Was this name ever assigned?",
        "Python runs statements top to bottom.",
        "Define the value before the print call.",
      ],
      explanation: "The name was undefined when Python tried to look it up.",
      variables: [
        {
          name: "hours",
          type: "int",
          value: "10",
        },
      ],
    },
    {
      id: "l2-debug-2",
      title: "A label instead of its value",
      description: "Keep hours = 10 and print its value, not the text hours.",
      starter: 'hours = 10\nprint("hours")',
      expected: "10",
      hints: [
        "No exception does not always mean the intended result.",
        "Quoted text is not a variable lookup.",
        "Compare the argument with the name you assigned.",
      ],
      explanation:
        "The original code was valid but printed literal text rather than a stored value.",
      variables: [
        {
          name: "hours",
          type: "int",
          value: "10",
        },
      ],
      cases: [
        {
          name: "lookup rather than text",
          overrides: {
            hours: 12,
          },
          expected: "12",
        },
      ],
    },
    {
      id: "l2-debug-3",
      title: "A different capital letter",
      description:
        "The assigned variable is hours = 10. Fix the lookup’s capitalization.",
      starter: "hours = 10\nprint(Hours)",
      expected: "10",
      hints: [
        "Read the undefined name in the error.",
        "Python distinguishes upper- and lowercase letters.",
        "The spelling must match the assignment exactly.",
      ],
      explanation:
        "Hours and hours are separate names; only the lowercase one was assigned.",
      variables: [
        {
          name: "hours",
          type: "int",
          value: "10",
        },
      ],
    },
    {
      id: "l2-debug-4",
      title: "A digit at the start",
      description:
        "Rename the invalid variable to study_hours everywhere, keeping its integer value 10.",
      starter: "2hours = 10\nprint(2hours)",
      expected: "10",
      hints: [
        "The first character cannot be a digit.",
        "An underscore can join descriptive words.",
        "Update the assignment and lookup together.",
      ],
      explanation:
        "The invalid decimal literal message came from the digit-leading name.",
      variables: [
        {
          name: "study_hours",
          type: "int",
          value: "10",
        },
      ],
    },
    {
      id: "l2-debug-5",
      title: "A space inside a name",
      description:
        "Use study_hours consistently instead of the space-separated name.",
      starter: "study hours = 10\nprint(study hours)",
      expected: "10",
      hints: [
        "Python uses spaces to separate parts of code.",
        "A single variable name cannot contain a space.",
        "Join the words with an underscore.",
      ],
      explanation: "study_hours is one valid name; study hours was not.",
      variables: [
        {
          name: "study_hours",
          type: "int",
          value: "10",
        },
      ],
    },
    {
      id: "l2-debug-6",
      title: "Text without boundaries",
      description: 'Keep name as the variable and assign it the string "Alex".',
      starter: "name = Alex\nprint(name)",
      expected: "Alex",
      hints: [
        "Python tries to look up an unquoted word.",
        "Was Alex defined, or did you intend text?",
        "Use a matching pair of quotes around the string value.",
      ],
      explanation:
        "The unquoted Alex was an undefined name. Quoting it creates the intended text value.",
      variables: [
        {
          name: "name",
          type: "str",
          value: "Alex",
        },
      ],
    },
    {
      id: "l2-debug-7",
      title: "Text plus a number",
      description:
        "Keep hours = 10. Display Hours: 10 without adding the string and integer directly. Use print’s multiple arguments.",
      starter: 'hours = 10\nprint("Hours: " + hours)',
      expected: "Hours: 10",
      hints: [
        "Read the TypeError: which two types were combined?",
        "Multiple print arguments can display different types together.",
        "print inserts a space between arguments; avoid doubled spaces inside a label.",
      ],
      explanation:
        "A comma separates print arguments instead of trying to add incompatible string and integer values.",
      variables: [
        {
          name: "hours",
          type: "int",
          value: "10",
        },
      ],
    },
  ],
};
