import { expect, test } from "@playwright/test";
import {
  lessons,
  phase2Lessons,
  sectionKey,
  lessonPath,
  labPath,
} from "../../src/content/lessons";
import { emptyProgress, STORAGE_KEY } from "../../src/progress/store";
import solutions from "../fixtures/phase2-solutions.json" with { type: "json" };
const answers = solutions as Record<string, string>;
for (const lesson of phase2Lessons) {
  test(`${lesson.id}: reading, quiz feedback, actual Python assessment, persistence and successor unlock`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await page.goto("/");
    const earlier = lessons.slice(0, lessons.indexOf(lesson));
    const p = {
      ...emptyProgress(),
      completedLessons: earlier.map((l) => l.id),
      drafts: { "lab-1": "# preserved legacy work" },
    };
    await page.evaluate(
      ([key, value]) =>
        localStorage.setItem(String(key), JSON.stringify(value)),
      [STORAGE_KEY, p],
    );
    await page.goto(lessonPath(lesson));
    for (const section of lesson.sections) {
      await expect(
        page.getByRole("heading", { name: section.title, exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Mark as read & continue" })
        .click();
    }
    for (const question of lesson.quiz) {
      const group = page.locator(`input[name="${question.id}"]`);
      await group.nth((question.correct + 1) % question.options.length).check();
      await expect(
        page.getByText(
          `Try again. ${question.options[(question.correct + 1) % question.options.length].explanation}`,
          { exact: true },
        ),
      ).toBeVisible();
      await group.nth(question.correct).check();
    }
    for (let i = 0; i < lesson.exercises.length; i++) {
      const exercise = lesson.exercises[i];
      await page.goto(labPath(lesson, i + 1));
      const editor = page.getByRole("textbox", { name: "Python code editor" });
      await editor.click();
      await page.keyboard.press("ControlOrMeta+a");
      if (i === 0) {
        await page.keyboard.insertText('print("wrong")');
        await page
          .getByRole("button", { name: "Check Answer", exact: true })
          .click();
        await expect(
          page.getByText("Keep investigating", { exact: true }),
        ).toBeVisible({ timeout: 45000 });
        await editor.click();
        await page.keyboard.press("ControlOrMeta+a");
      }
      await page.keyboard.insertText(answers[exercise.id]);
      await page
        .getByRole("button", { name: "Check Answer", exact: true })
        .click();
      await expect(
        page.getByText("Requirements met. Your working solution is saved."),
      ).toBeVisible({ timeout: 45000 });
    }
    await page.reload();
    const stored = await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!),
      STORAGE_KEY,
    );
    expect(stored.completedLessons).toContain(lesson.id);
    expect(stored.drafts["lab-1"]).toBe("# preserved legacy work");
    expect(stored.sections).toEqual(
      expect.arrayContaining(
        lesson.sections.map((s) => sectionKey(lesson, s.id)),
      ),
    );
    expect(stored.completed).toEqual(
      expect.arrayContaining(lesson.exercises.map((e) => e.id)),
    );
    const next = lessons[lessons.indexOf(lesson) + 1];
    if (next) {
      await page.goto(lessonPath(next));
      await expect(
        page.getByRole("heading", {
          name: next.sections[0].title,
          exact: true,
        }),
      ).toBeVisible();
    }
  });
}
test("module cards, locked deep links, prepared input and responsive navigation", async ({
  page,
}) => {
  await page.goto("/lessons/operators/a");
  await expect(
    page.getByRole("heading", { name: "Complete Lesson 3 to continue." }),
  ).toBeVisible();
  await page.goto("/curriculum");
  await page.getByText("Module 4: Strings", { exact: false }).click();
  await expect(
    page.getByRole("link", { name: "Index and slice a sequence", exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto("/playground");
  await page.getByText("Prepared input for input()", { exact: true }).click();
  await page.getByLabel("One input value per line").fill("Ada\n20");
  const editor = page.getByRole("textbox", { name: "Python code editor" });
  await editor.click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.insertText(
    'name = input()\nage = int(input())\nprint(f"{name}: {age + 1}")',
  );
  await page.getByRole("button", { name: "Run Code", exact: true }).click();
  await expect(page.getByTestId("python-output")).toHaveText("Ada: 21", {
    timeout: 45000,
  });
  await page.getByLabel("One input value per line").fill("Ada");
  await page.getByRole("button", { name: "Run Code", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "No prepared input remains",
    { timeout: 45000 },
  );
});
