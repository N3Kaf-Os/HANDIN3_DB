const bcrypt = require("bcrypt");
process.env.SESSION_SECRET = "test-secret";
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync("testpw", 4);

const request = require("supertest");
const app = require("../app");

describe("POST /admin/login rate limit", () => {
  it("returns 429 after 10 failed attempts within the window", async () => {
    for (let i = 0; i < 10; i++) {
      const res = await request(app)
        .post("/admin/login")
        .type("form")
        .send({ password: "nope" });
      expect(res.status).toBe(200); // re-render with error
    }
    const blocked = await request(app)
      .post("/admin/login")
      .type("form")
      .send({ password: "nope" });
    expect(blocked.status).toBe(429);
  });
});
