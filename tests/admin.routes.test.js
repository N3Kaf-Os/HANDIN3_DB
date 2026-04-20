// tests/admin.routes.test.js — integration tests for the authenticated admin routes.
const bcrypt = require("bcrypt");

// set env BEFORE requiring app so session middleware picks up the secret
process.env.SESSION_SECRET = "test-secret";
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync("testpw", 4);

const request = require("supertest");
const app = require("../app");
const Artwork = require("../models/Artwork");
const db = require("./db");

beforeAll(db.connect);
afterAll(db.disconnect);
afterEach(db.clearAll);

// minimal valid PNG buffer — passes multer's fileFilter
const fakePng = Buffer.from(
  "89504e470d0a1a0a0000000d49484452000000010000000108000000003a7e9b55" +
    "0000000a49444154789c6260000000020001e221bc330000000049454e44ae426082",
  "hex",
);

// authenticated supertest agent — reuses the session cookie across requests
async function loginAgent() {
  const agent = request.agent(app);
  const res = await agent
    .post("/admin/login")
    .type("form")
    .send({ password: "testpw" });
  expect(res.status).toBe(302); // sanity: login actually worked
  return agent;
}

describe("POST /admin (authenticated)", () => {
  it("creates an artwork and redirects", async () => {
    const agent = await loginAgent();
    const res = await agent
      .post("/admin")
      .field("title", "Test Upload")
      .field("slug", "test-upload")
      .attach("image", fakePng, {
        filename: "test.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(302);
    const doc = await Artwork.findOne({ slug: "test-upload" });
    expect(doc).not.toBeNull();
    expect(doc.title).toBe("Test Upload");
  });

  it("fails (500) when no file is attached", async () => {
    const agent = await loginAgent();
    const res = await agent
      .post("/admin")
      .field("title", "No File")
      .field("slug", "no-file");
    expect(res.status).toBe(500);
  });
});

describe("POST /admin slug collision (authenticated)", () => {
  it("rejects a second artwork whose auto-generated slug collides", async () => {
    const agent = await loginAgent();

    const first = await agent
      .post("/admin")
      .field("title", "Blue Wave")
      .field("slug", "")
      .attach("image", fakePng, { filename: "a.png", contentType: "image/png" });
    expect(first.status).toBe(302);

    const second = await agent
      .post("/admin")
      .field("title", "blue  wave")
      .field("slug", "")
      .attach("image", fakePng, { filename: "b.png", contentType: "image/png" });

    expect(second.status).toBeGreaterThanOrEqual(400);
    const count = await Artwork.countDocuments({ slug: "blue-wave" });
    expect(count).toBe(1);
  });
});

describe("DELETE /admin/:id (authenticated)", () => {
  it("removes the document and redirects", async () => {
    const agent = await loginAgent();
    const artwork = await Artwork.create({
      title: "To Delete",
      imagePath: "uploads/del.jpg",
      slug: "to-delete",
    });

    const res = await agent.delete(`/admin/${artwork._id}`);
    expect(res.status).toBe(302);

    const doc = await Artwork.findById(artwork._id);
    expect(doc).toBeNull();
  });
});

describe("admin routes without a session", () => {
  it("GET /admin redirects to /admin/login", async () => {
    const res = await request(app).get("/admin");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/admin/login");
  });

  it("POST /admin redirects to /admin/login", async () => {
    const res = await request(app).post("/admin").field("title", "x");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/admin/login");
  });

  it("DELETE /admin/:id redirects to /admin/login", async () => {
    const res = await request(app).delete("/admin/000000000000000000000000");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/admin/login");
  });
});

describe("POST /admin/login", () => {
  it("re-renders with error on wrong password (200)", async () => {
    const res = await request(app)
      .post("/admin/login")
      .type("form")
      .send({ password: "nope" });
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/invalid/i);
  });

  it("redirects to /admin on correct password (302)", async () => {
    const res = await request(app)
      .post("/admin/login")
      .type("form")
      .send({ password: "testpw" });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/admin");
  });
});

describe("POST /admin/logout", () => {
  it("destroys the session and redirects to login", async () => {
    const agent = await loginAgent();
    const res = await agent.post("/admin/logout");
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("/admin/login");

    // after logout, a protected route must redirect
    const after = await agent.get("/admin");
    expect(after.status).toBe(302);
    expect(after.headers.location).toBe("/admin/login");
  });
});
