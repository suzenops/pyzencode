import { describe, it, expect } from "vitest";
import { lesson, quiz, syntaxTokens } from "../src/content/lesson";
import { exercises } from "../src/content/exercises";
import { curriculum } from "../src/content/curriculum";
describe("beginner content", () => {
  it("loads all eight authored sections and the five-question check", () => {
    expect(lesson.sections.map((s) => s.id)).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
    ]);
    expect(quiz).toHaveLength(5);
    for (const s of lesson.sections) {
      expect(s.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(s.practice).toBeTruthy();
      expect(s.mistakes).toBeTruthy();
    }
  });
  it("annotates every component of the first call", () =>
    expect(syntaxTokens.map((s) => s.token).join("")).toBe('print("Hello")'));
  it("loads ten exercises and real multiline examples", () => {
    expect(exercises).toHaveLength(10);
    expect(exercises[3].expected).toBe("Hello\nPython");
    expect(lesson.sections[1].code).toContain("\nprint(");
    expect(exercises[0].starter.endsWith("\n")).toBe(true);
  });
  it("marks a seven-level planned curriculum without implemented future exercises", () => {
    expect(curriculum).toHaveLength(7);
    expect(curriculum[6].topics).toContain(
      "Introductory cybersecurity exercises",
    );
    expect(exercises.every((e) => e.id.startsWith("lab-"))).toBe(true);
  });
});
