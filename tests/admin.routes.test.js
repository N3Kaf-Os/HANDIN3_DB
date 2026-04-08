const request = require("supertest");
const app = require("../app");
const Artwork = require("../models/Artwork");
const db = require("./db");

beforeAll(db.connect);
afterAll(db.disconnect);
afterEach(db.clearAll);

// A minimal valid PNG buffer — passes multer's fileFilter
const fakePng = Buffer.from(
  "89504e470d0a1a0a0000000d49484452000000010000000108000000003a7e9b55" +
    "0000000a49444154789c6260000000020001e221bc330000000049454e44ae426082",
  "hex",
);

describe("POST /admin", () => {
  it("creates an artwork and redirects", async () => {
    const res = await request(app)
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
    const res = await request(app)
      .post("/admin")
      .field("title", "No File")
      .field("slug", "no-file");

    expect(res.status).toBe(500);
  });
});

describe("DELETE /admin/:id", () => {
  it("removes the document and redirects", async () => {
    const artwork = await Artwork.create({
      title: "To Delete",
      imagePath: "uploads/del.jpg",
      slug: "to-delete",
    });

    const res = await request(app).delete(`/admin/${artwork._id}`);
    expect(res.status).toBe(302);

    const doc = await Artwork.findById(artwork._id);
    expect(doc).toBeNull();
  });
});
