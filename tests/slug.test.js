// tests/slug.test.js — contract tests for the slug generator (pure function)
const { generateSlug } = require("../utils/slug");

describe("generateSlug", () => {
  it("lowercases a basic title", () => {
    expect(generateSlug("Blue Wave")).toBe("blue-wave");
  });

  it("lowercases all-caps titles", () => {
    expect(generateSlug("MY TITLE")).toBe("my-title");
  });

  it("strips punctuation and special characters", () => {
    expect(generateSlug("Hello, World!")).toBe("hello-world");
    expect(generateSlug("A & B @ C")).toBe("a-b-c");
  });

  it("collapses double spaces and double hyphens", () => {
    expect(generateSlug("Blue  Wave")).toBe("blue-wave");
    expect(generateSlug("blue--wave")).toBe("blue-wave");
  });

  it("trims leading/trailing whitespace and hyphens", () => {
    expect(generateSlug("  Blue Wave  ")).toBe("blue-wave");
    expect(generateSlug("-blue-wave-")).toBe("blue-wave");
  });

  it("folds accented latin characters (café → cafe)", () => {
    expect(generateSlug("Café Crème")).toBe("cafe-creme");
  });

  it("strips non-latin scripts (contract: strip, not transliterate)", () => {
    // decision: simplest, predictable. Transliteration would need a library.
    expect(generateSlug("Hello مرحبا World")).toBe("hello-world");
  });

  it("throws on empty string", () => {
    expect(() => generateSlug("")).toThrow();
  });

  it("throws when input becomes empty after stripping", () => {
    // decision: fail fast rather than silently insert an empty slug (unique index would fail later anyway)
    expect(() => generateSlug("!!!")).toThrow();
    expect(() => generateSlug("مرحبا")).toThrow();
  });
});
