const request = require("supertest");
const app = require("../app");
const Artwork = require("../models/Artwork");
const db = require("./db");

beforeAll(db.connect);
afterAll(db.disconnect);
afterEach(db.clearAll);

describe("GET /artworks/:slug", () => {
  it("returns 404 for an unknown slug", async () => {
    const res = await request(app).get("/artworks/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns 200 for a valid slug", async () => {
    await Artwork.create({
      title: "Blue Wave",
      imagePath: "uploads/blue.jpg",
      slug: "blue-wave",
    });
    const res = await request(app).get("/artworks/blue-wave");
    expect(res.status).toBe(200);
  });
});
