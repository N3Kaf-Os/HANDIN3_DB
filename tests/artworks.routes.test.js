const request = require("supertest");
const app = require("../app");
const Artwork = require("../models/Artwork");
const db = require("./db");

// test isolation: each test runs in a clean environment, unaffected by others.
beforeAll(db.connect); // runs once before
afterAll(db.disconnect); // runs once after
afterEach(db.clearAll); // runs after each

// INTEGRATION TESTS : full request-response cycle   
// describe ('test label string', callback function)
describe("GET /artworks/:slug", () => {
  it("returns 404 for an unknown slug", async () => {
    const res = await request(app).get("/artworks/does-not-exist");
    // request(app) => supertest, gives us an object to fire HTTP methods on, no server.
    // .get("/artworks/does-not-exist") => simulates a GET request to that route(path), returns a Promise.
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
