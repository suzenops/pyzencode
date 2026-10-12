import { test, expect, type Page } from "@playwright/test";
import { firstLesson, sectionKey } from "../../src/content/lessons";
import { variablesLesson } from "../../src/content/variables";
import { emptyProgress } from "../../src/progress/store";
const firstComplete = () => ({
  ...emptyProgress(),
  sections: firstLesson.sections.map((s) => sectionKey(firstLesson, s.id)),
  answers: Object.fromEntries(firstLesson.quiz.map((q) => [q.id, q.correct])),
  completed: firstLesson.exercises.map((e) => e.id),
  drafts: { "lab-4": 'print("Hello")\nprint("Python")' },
});
async function seed(page: Page, p = firstComplete()) {
  await page.goto("/");
  await page.evaluate(
    (p) => localStorage.setItem("pyzencode.progress.v1", JSON.stringify(p)),
    p,
  );
}
async function edit(page: Page, code: string) {
  await page.getByRole("textbox", { name: "Python code editor" }).click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.insertText(code);
}
async function submit(page: Page, code: string, pass: boolean) {
  await edit(page, code);
  await page.getByRole("button", { name: "Check Answer", exact: true }).click();
  await expect(
    page.getByText(pass ? "Solved" : "Keep investigating", { exact: true }),
  ).toBeVisible({ timeout: 50000 });
}
test("Lesson 2 unlocks after an actual final Lesson 1 pass, preserving legacy drafts", async ({
  page,
}) => {
  const p = firstComplete();
  p.completed = p.completed.slice(0, 9);
  await seed(page, p);
  await page.goto("/lessons/variables/a");
  await expect(
    page.getByRole("heading", { name: "Complete Lesson 1 to continue." }),
  ).toBeVisible();
  await page.goto("/labs/variables/1");
  await expect(
    page.getByRole("button", { name: "Run Code", exact: true }),
  ).toHaveCount(0);
  await page.goto("/lab/10");
  await submit(
    page,
    'print("PyZenCode")\nprint("Learn Python")\nprint("Start coding!")',
    true,
  );
  await page.goto("/dashboard");
  await page
    .getByRole("link", { name: "Continue learning", exact: true })
    .click();
  await expect(page).toHaveURL(/lessons\/variables\/a$/);
  await expect(
    page.getByRole("heading", { name: "Variables and Data Types" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "What is a variable?" }),
  ).toBeVisible();
  await page.goto("/lab/4");
  await expect(
    page.getByRole("textbox", { name: "Python code editor" }),
  ).toContainText('print("Hello")');
});
test("all ten Lesson 2 tasks execute real Python, reject wrong or hardcoded solutions and persist 100 new points", async ({
  page,
}) => {
  test.setTimeout(360000);
  await seed(page);
  const valid = [
    "age: int = 20\nprint(age)",
    'student_name = "Al" + "ex"\nprint(student_name)',
    "hours, grade = (5 + 5, 185 / 2)\nprint(hours)\nprint(grade)",
    'language = "Python"\nprint("I am learning " + language)',
    "score = 50\nscore += 30\nprint(score)",
    "study_hours = 10\nprint(study_hours)",
    'city = "New York"\nprint(city)',
    "price = 19.99\ninspect = type\nkind = inspect(price)\nprint(kind)",
    "monday_hours = 3\ntuesday_hours = 4\ntotal_hours = sum((monday_hours,tuesday_hours))\nprint(total_hours)",
    'student_name = "Alex"\nage = 20\ncourse = "Python"\nstudy_hours = 10\nprint("Student:",student_name)\nprint("Age:",age)\nprint("Course:",course)\nprint("Study hours:",study_hours)',
  ];
  const invalid = [
    "print(20)",
    'student_name = "Alex"\nprint("Alex")',
    'hours=10\ngrade="92.5"\nprint(hours)\nprint(grade)',
    'language="Python"\nprint("I am learning Python")',
    "score=80\nprint(score)",
    "hours=10\nprint(hours)",
    'city="New York"\nprint("New York")',
    "price=19.99\nprint(type(19.99))",
    "monday_hours=3\ntuesday_hours=4\ntotal_hours=7\nprint(total_hours)",
    'student_name="Alex"\nage=20\ncourse="Python"\nstudy_hours=10\nprint("Student: Alex\\nAge: 20\\nCourse: Python\\nStudy hours: 10")',
  ];
  for (let i = 0; i < 10; i++) {
    await page.goto(`/labs/variables/${i + 1}`);
    await submit(page, invalid[i], false);
    expect(
      await page.evaluate(
        () =>
          JSON.parse(
            localStorage.getItem("pyzencode.progress.v1")!,
          ).completed.filter((id: string) => id.startsWith("l2-lab-")).length,
      ),
    ).toBe(i);
    if (i === 7) {
      await submit(page, "price=19.99\nprint(price.__class__)", false);
      await expect(
        page.getByText(/Use the built-in type\(\) function to inspect/),
      ).toBeVisible();
    }
    await submit(page, valid[i], true);
  }
  await page.getByRole("button", { name: "Check Answer", exact: true }).click();
  await expect(page.getByText("Solved", { exact: true })).toBeVisible({
    timeout: 50000,
  });
  await page.goto("/progress");
  await expect(page.locator(".stat").first().locator("strong")).toHaveText(
    "200",
  );
  await page.reload();
  await expect(page.locator(".stat").first().locator("strong")).toHaveText(
    "200",
  );
  await page.goto("/labs/variables/10");
  await expect(
    page.getByRole("textbox", { name: "Python code editor" }),
  ).toContainText("student_name");
});
test("lesson content, real examples, quick checks, data types and final knowledge check work", async ({
  page,
}) => {
  test.setTimeout(180000);
  await seed(page);
  for (const [section, expected] of [
    ["a", "10\nhours\n"],
    ["b", "Alex\n10\nAlex\n"],
    ["c", "80\n"],
    ["d", "10\n-5\n0\n92.5\n10.0\n123\n"],
    ["e", "<class 'int'>\n<class 'float'>\n<class 'str'>\n"],
    ["f", "Alex\n10\n92.5\n"],
    ["g", "I studied 10 hours\n"],
  ]) {
    await page.goto(`/lessons/variables/${section}`);
    await page
      .getByRole("button", { name: "Run Code", exact: true })
      .first()
      .click();
    await expect(page.getByTestId("python-output").first()).toBeVisible({
      timeout: 50000,
    });
    expect(await page.getByTestId("python-output").first().textContent()).toBe(
      expected,
    );
    await page.getByRole("button", { name: "Mark as read & continue" }).click();
  }
  await page.goto("/lessons/variables/a");
  await expect(
    page.getByLabel("Annotated breakdown: What is a variable?"),
  ).toBeVisible();
  await page.getByText("10", { exact: true }).last().click();
  await expect(page.getByText(/Try again. Without quotes/)).toBeVisible();
  await page.getByText("hours", { exact: true }).last().click();
  await expect(page.getByText(/Correct. Quotes make a string/)).toBeVisible();
  await page.goto("/lessons/variables/quiz");
  for (const q of variablesLesson.quiz) {
    await page.locator(`input[name="${q.id}"]`).nth(q.correct).check();
  }
  await expect(page.getByText("5 / 5 correct")).toBeVisible();
  await page.reload();
  await expect(page.getByText("5 / 5 correct")).toBeVisible();
});
test("seven debugging examples show real errors or mismatched output and can be corrected", async ({
  page,
}) => {
  test.setTimeout(180000);
  await seed(page);
  await page.goto("/lessons/variables/h");
  const workspaces = page.locator(".additional-example");
  const fixes = [
    "hours=10\nprint(hours)",
    "hours=10\nprint(hours)",
    "hours=10\nprint(hours)",
    "study_hours=10\nprint(study_hours)",
    "study_hours=10\nprint(study_hours)",
    'name="Alex"\nprint(name)',
    'hours=10\nprint("Hours:",hours)',
  ];
  for (let i = 0; i < 7; i++) {
    const workspace = workspaces.nth(i);
    await workspace
      .getByRole("button", { name: "Run Code", exact: true })
      .click();
    if (i === 1) {
      await expect(workspace.getByTestId("python-output")).toHaveText("hours", {
        timeout: 50000,
      });
    } else {
      await expect(workspace.locator(".error-block")).toBeVisible({
        timeout: 50000,
      });
    }
    await workspace
      .getByRole("textbox", { name: "Python code editor" })
      .click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.insertText(fixes[i]);
    await workspace
      .getByRole("button", { name: "Check Answer", exact: true })
      .click();
    await expect(workspace.getByText("Solved", { exact: true })).toBeVisible({
      timeout: 50000,
    });
  }
  expect(
    await page.evaluate(
      () =>
        JSON.parse(
          localStorage.getItem("pyzencode.progress.v1")!,
        ).completed.filter((id: string) => id.startsWith("l2-lab-")).length,
    ),
  ).toBe(0);
});
test("shared output comparison explains capitalization and fits mobile screens", async ({
  page,
}) => {
  await page.goto("/lab/10");
  await submit(
    page,
    'print("PyZenCode")\nprint("Learn Python")\nprint("Start Coding!")',
    false,
  );
  await expect(page.getByLabel("Expected versus actual output")).toBeVisible();
  await expect(
    page.getByText(/Capitalization differs at line 3, character 7/).first(),
  ).toBeVisible();
  await seed(page);
  await page.goto("/labs/variables/4");
  await submit(
    page,
    'language="Python"\nprint("I am learning",language+"!")',
    false,
  );
  await expect(page.getByLabel("Expected versus actual output")).toBeVisible();
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lessons/variables/d");
  await expect(page.getByRole("table")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
