// tests/enter.routes.test.js — integration tests for /enter and the honeypot.
process.env.SESSION_SECRET = "test-secret";
process.env.ADMIN_PASSWORD_HASH = require("bcrypt").hashSync("testpw", 4);

const request = require("supertest");
const app = require("../app");
const db = require("./db");

beforeAll(db.connect);
afterAll(db.disconnect);
afterEach(db.clearAll);

describe("GET /enter", () => {
  it("renders without requiring a session", async () => {
    const res = await request(app).get("/enter");
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Enter/);
  });
});

describe("gatekeeper flow", () => {
  it("redirects fresh visitors from / to /enter", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/enter");
  });

  it("lets visitors through after POST /enter with empty honeypot", async () => {
    const agent = request.agent(app);
    const submit = await agent
      .post("/enter")
      .type("form")
      .send({ website: "" });
    expect(submit.status).toBe(302);
    expect(submit.headers.location).toBe("/");

    const home = await agent.get("/");
    expect(home.status).toBe(200);
  });

  it("returns 403 and does NOT set the session when honeypot is filled", async () => {
    const agent = request.agent(app);
    const submit = await agent
      .post("/enter")
      .type("form")
      .send({ website: "http://spam.io" });
    expect(submit.status).toBe(403);

    // confirm session wasn't set — visitor still gets gated
    const home = await agent.get("/");
    expect(home.status).toBe(302);
    expect(home.headers.location).toBe("/enter");
  });

  it("handles POST /enter cleanly when session is already entered", async () => {
    const agent = request.agent(app);
    await agent.post("/enter").type("form").send({ website: "" });
    const second = await agent
      .post("/enter")
      .type("form")
      .send({ website: "" });
    expect(second.status).toBe(302);
    expect(second.headers.location).toBe("/");
  });
});
