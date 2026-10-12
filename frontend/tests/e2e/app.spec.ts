import { test, expect, type Page } from "@playwright/test";
async function edit(page: Page, source: string) {
  const editor = page.getByRole("textbox", { name: "Python code editor" });
  await editor.click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.insertText(source);
}
async function check(page: Page, source: string) {
  await edit(page, source);
  await page.getByRole("button", { name: "Check Answer", exact: true }).click();
  await expect(
    page.getByText("Requirements met. Your working solution is saved."),
  ).toBeVisible({ timeout: 45000 });
}
test("landing, lesson navigation, knowledge check and accessible mobile navigation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Understand the code/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Start learning", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Introduction to Python" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Mark as read & continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Your first program", exact: true }),
  ).toBeVisible();
  await page.goto("/lesson/d");
  await expect(
    page.getByLabel("Annotated breakdown of print Hello"),
  ).toBeVisible();
  await page.goto("/lesson/quiz");
  await page.getByText("Always builds a website.", { exact: true }).click();
  await expect(
    page.getByText(/Try again. Programs can do many kinds/),
  ).toBeVisible();
  await page
    .getByText("Gives a computer instructions to follow.", { exact: true })
    .click();
  await expect(page.getByText(/Correct. A program/)).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page.getByRole("link", { name: "Curriculum", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A foundation. Then possibility." }),
  ).toBeVisible();
  await expect(page.getByText("Coming soon").first()).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("all ten tasks execute actual Python, grade alternatives and persist exactly 100 points", async ({
  page,
}) => {
  test.setTimeout(240000);
  const solutions = [
    "print('Hello, World!')",
    'print("My name is " + "Alex")',
    "print(50 + 50)",
    'print("Hello")\nprint("Python")',
    'print("Welcome")',
    'print("Coding is fun")',
    'print("Keep learning")',
    'print("Python 🐍")',
    'print("Learn")\nprint("Practice")\nprint("Grow")',
    'print("PyZenCode")\nprint("Learn Python")\nprint("Start coding!")',
  ];
  await page.goto("/lab/1");
  await edit(page, 'print("Hello, World!")');
  await page.getByRole("button", { name: "Run Code", exact: true }).click();
  await expect(page.getByTestId("python-output")).toHaveText("Hello, World!", {
    timeout: 45000,
  });
  await edit(page, 'print("Wrong")');
  await page.getByRole("button", { name: "Check Answer", exact: true }).click();
  await expect(
    page.getByText("Keep investigating", { exact: true }),
  ).toBeVisible({ timeout: 45000 });
  await page.goto("/progress");
  expect(
    await page.locator(".stat").first().locator("strong").textContent(),
  ).toBe("0");
  for (let i = 0; i < solutions.length; i++) {
    await page.goto(`/lab/${i + 1}`);
    if (i === 2) {
      await edit(page, 'print("100")');
      await page
        .getByRole("button", { name: "Check Answer", exact: true })
        .click();
      await expect(
        page.getByText(
          "The output looks right, but the value must be an integer rather than quoted text.",
        ),
      ).toBeVisible({ timeout: 45000 });
    }
    if (i === 3) {
      await edit(page, 'print("Hello\\nPython")');
      await page
        .getByRole("button", { name: "Check Answer", exact: true })
        .click();
      await expect(
        page.getByText(
          "The output matches, but this task asks for 2 separate print calls. Try that structure.",
        ),
      ).toBeVisible({ timeout: 45000 });
    }
    await check(page, solutions[i]);
  }
  await page.getByRole("button", { name: "Check Answer", exact: true }).click();
  await expect(
    page.getByText("Requirements met. Your working solution is saved."),
  ).toBeVisible({ timeout: 45000 });
  await page.goto("/progress");
  await expect(page.locator(".stat").first().locator("strong")).toHaveText(
    "100",
  );
  await page.reload();
  await expect(page.locator(".stat").first().locator("strong")).toHaveText(
    "100",
  );
  await page.goto("/lab/10");
  await expect(
    page.getByRole("textbox", { name: "Python code editor" }),
  ).toContainText("Start coding!");
});
test("real error, hints, correction, output limit, infinite loop termination and fresh retry", async ({
  page,
}) => {
  await page.goto("/debug/1");
  await page.getByRole("button", { name: "Run Code", exact: true }).click();
  await expect(
    page.getByText("NameError · line 1", { exact: true }),
  ).toBeVisible({ timeout: 45000 });
  await page.getByText("Real Python error details").click();
  await expect(page.locator(".error-block pre")).toContainText(
    "name 'Print' is not defined",
  );
  await page.getByRole("button", { name: "Get a hint" }).click();
  await expect(
    page.getByText("Look at the last line of the error report."),
  ).toBeVisible();
  await check(page, 'print("Welcome")');
  await page.goto("/playground");
  await edit(page, 'print("x" * 10000)');
  await page.getByRole("button", { name: "Run Code", exact: true }).click();
  await expect(
    page.getByText("OutputLimitError · line 1", { exact: true }),
  ).toBeVisible({ timeout: 45000 });
  expect((await page.getByTestId("python-output").textContent())!.length).toBe(
    8192,
  );
  await edit(page, "while True: pass");
  await page.getByRole("button", { name: "Run Code", exact: true }).click();
  await expect(page.getByText("TimeoutError", { exact: true })).toBeVisible({
    timeout: 45000,
  });
  await edit(page, 'print("Fresh interpreter")');
  await page.getByRole("button", { name: "Run Code", exact: true }).click();
  await expect(page.getByTestId("python-output")).toHaveText(
    "Fresh interpreter",
    { timeout: 45000 },
  );
});

test("failed runtime initialization is visible and a retry executes real Python", async ({
  page,
}) => {
  await page.route("**/python/pyodide.js", (route) => route.abort());
  await page.goto("/playground");
  await page.getByRole("button", { name: "Run Code", exact: true }).click();
  await expect(
    page.getByText("InitializationError", { exact: true }),
  ).toBeVisible({ timeout: 45000 });
  await page.unroute("**/python/pyodide.js");
  await page
    .getByRole("button", { name: "Retry execution", exact: true })
    .click();
  await expect(page.getByTestId("python-output")).toHaveText("Hello, World!", {
    timeout: 45000,
  });
});
test("damaged storage is preserved until an explicit reset", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("pyzencode.progress.v1", "{broken"),
  );
  await page.reload();
  await expect(
    page.getByText(/Saved progress could not be read/),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("pyzencode.progress.v1")),
  ).toBe("{broken");
  page.on("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Reset saved progress", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: /Understand the code/ }),
  ).toBeVisible();
});

test("lesson examples and real missing-quote/parenthesis errors execute in Python", async ({
  page,
}) => {
  for (const [section, expected] of [
    ["b", "Hello, World!\nI am learning Python.\n"],
    ["e", "\nHello\n"],
    ["f", "25\n25\n10\n55\n"],
    ["g", "Welcome\n# is text here\n"],
  ]) {
    await page.goto(`/lesson/${section}`);
    await page.getByRole("button", { name: "Run Code", exact: true }).click();
    await expect(page.getByTestId("python-output")).toBeVisible({
      timeout: 45000,
    });
    expect(await page.getByTestId("python-output").textContent()).toBe(
      expected,
    );
  }
  for (const [number, type] of [
    [2, "NameError"],
    [3, "SyntaxError"],
  ] as const) {
    await page.goto(`/debug/${number}`);
    await page.getByRole("button", { name: "Run Code", exact: true }).click();
    await expect(
      page.getByText(`${type} · line 1`, { exact: true }),
    ).toBeVisible({ timeout: 45000 });
  }
  await page.goto("/playground");
  await edit(page, 'print("Hello)');
  await page.getByRole("button", { name: "Run Code", exact: true }).click();
  await expect(
    page.getByText("SyntaxError · line 1", { exact: true }),
  ).toBeVisible({ timeout: 45000 });
});

test("all eight areas fit small phone and tablet viewports without page errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      "/",
      "/dashboard",
      "/curriculum",
      "/lesson/d",
      "/playground",
      "/lab/1",
      "/debug/1",
      "/progress",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});
