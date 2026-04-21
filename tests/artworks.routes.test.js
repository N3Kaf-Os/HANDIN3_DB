process.env.SESSION_SECRET = "test-secret";
process.env.ADMIN_PASSWORD_HASH = require("bcrypt").hashSync("testpw", 4);

const request = require("supertest");
const app = require("../app");
const Artwork = require("../models/Artwork");
const db = require("./db");

beforeAll(db.connect);
afterAll(db.disconnect);
afterEach(db.clearAll);

async function enteredAgent() {
  const agent = request.agent(app);
  await agent.post("/enter").type("form").send({ website: "" });
  return agent;
}

describe("GET /artworks/:slug", () => {
  it("returns 404 for an unknown slug", async () => {
    const agent = await enteredAgent();
    const res = await agent.get("/artworks/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns 200 for a valid slug", async () => {
    const agent = await enteredAgent();
    await Artwork.create({
      title: "Blue Wave",
      imagePath: "uploads/blue.jpg",
      slug: "blue-wave",
    });
    const res = await agent.get("/artworks/blue-wave");
    expect(res.status).toBe(200);
  });
});
