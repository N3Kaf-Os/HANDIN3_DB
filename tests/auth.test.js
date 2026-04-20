// tests/auth.test.js — contract tests for verifyPassword
const bcrypt = require("bcrypt");
const { verifyPassword } = require("../utils/auth");

describe("verifyPassword", () => {
  let hash;
  beforeAll(async () => {
    hash = await bcrypt.hash("correct-horse", 4); // low rounds = fast in tests
  });

  it("returns true for the correct password", async () => {
    expect(await verifyPassword("correct-horse", hash)).toBe(true);
  });

  it("returns false for the wrong password", async () => {
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("returns false when the hash is undefined (missing env var)", async () => {
    expect(await verifyPassword("anything", undefined)).toBe(false);
  });

  it("returns false when the hash is null", async () => {
    expect(await verifyPassword("anything", null)).toBe(false);
  });

  it("returns false for an empty password", async () => {
    expect(await verifyPassword("", hash)).toBe(false);
  });
});
