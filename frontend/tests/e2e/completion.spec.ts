import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";
import { firstLesson, sectionKey } from "../../src/content/lessons";
import {
  emptyProgress,
  STORAGE_KEY,
  BACKUP_KEY,
} from "../../src/progress/store";
const legacy = () => {
  const p = {
    ...emptyProgress(),
    sections: firstLesson.sections.map((s) => sectionKey(firstLesson, s.id)),
    answers: Object.fromEntries(firstLesson.quiz.map((q) => [q.id, q.correct])),
    completed: firstLesson.exercises.map((e) => e.id),
    drafts: { "lab-1": 'print("Hello, World!")' },
  };
  delete p.completedLessons;
  return p;
};
test("legacy completion survives review, reload and a new application session", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const raw = JSON.stringify(legacy());
  await page.evaluate(
    ([key, raw]) => localStorage.setItem(key, raw),
    [STORAGE_KEY, raw],
  );
  await page.goto("/lesson/quiz");
  await page.locator("input[name=q1]").nth(0).check();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).completedLessons,
      STORAGE_KEY,
    ),
  ).toContain("first-program");
  expect(
    await page.evaluate((key) => localStorage.getItem(key), BACKUP_KEY),
  ).toBe(raw);
  await page.reload();
  await page.goto("/lessons/variables/a");
  await expect(
    page.getByRole("heading", { name: "What is a variable?" }),
  ).toBeVisible();
  await page.close();
  const returned = await context.newPage();
  await returned.goto("/lessons/variables/a");
  await expect(
    returned.getByRole("heading", { name: "What is a variable?" }),
  ).toBeVisible();
  expect(
    await returned.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).completed.length,
      STORAGE_KEY,
    ),
  ).toBe(10);
});
test("recover previously recorded successor progress without redoing Lesson 1", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(
    ([key, p]) => localStorage.setItem(String(key), JSON.stringify(p)),
    [
      STORAGE_KEY,
      { ...emptyProgress(), drafts: { "l2-lab-1": "age = 20\nprint(age)" } },
    ],
  );
  await page.goto("/labs/variables/1");
  await expect(
    page.getByRole("textbox", { name: "Python code editor" }),
  ).toContainText("age = 20");
  await page.goto("/progress");
  await expect(page.locator(".stat").first().locator("strong")).toHaveText("0");
});
test("private export/import merges progress; malformed import leaves data intact", async ({
  page,
}) => {
  await page.goto("/progress");
  const input = page.getByLabel("Import progress backup");
  await input.setInputFiles({
    name: "progress.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(legacy())),
  });
  await expect(page.getByText(/Backup merged/)).toBeVisible();
  await page.reload();
  await expect(page.locator(".stat").first().locator("strong")).toHaveText(
    "100",
  );
  const before = await page.evaluate(
    (key) => localStorage.getItem(key),
    STORAGE_KEY,
  );
  await input.setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{broken"),
  });
  await expect(page.getByText(/Backup could not be imported/)).toBeVisible();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY),
  ).toBe(before);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export progress" }).click();
  const downloaded = await download;
  expect(downloaded.suggestedFilename()).toBe("pyzencode-progress.json");
  const backup = await readFile((await downloaded.path())!);
  await page.goto("http://localhost:4173/progress");
  await expect(page.locator(".stat").first().locator("strong")).toHaveText("0");
  await page.getByLabel("Import progress backup").setInputFiles({
    name: "progress.json",
    mimeType: "application/json",
    buffer: backup,
  });
  await expect(page.getByText(/Backup merged/)).toBeVisible();
  await page.reload();
  await expect(page.locator(".stat").first().locator("strong")).toHaveText(
    "100",
  );

  await page.goto("/lessons/variables/a");
  await expect(
    page.getByRole("heading", { name: "What is a variable?" }),
  ).toBeVisible();
});
