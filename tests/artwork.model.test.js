const Artwork = require("../models/Artwork");
const db = require("./db");

// test isolation
beforeAll(db.connect);
afterAll(db.disconnect);
afterEach(db.clearAll);

describe("Artwork model", () => {
  it("saves a valid artwork", async () => {
    const doc = await Artwork.create({
      // confirms required fields and mongoose creates _id
      title: "Blue Wave",
      imagePath: "uploads/blue.jpg",
      slug: "blue-wave",
    });
    expect(doc._id).toBeDefined();
  });

  it("rejects missing title", async () => {
    await expect(
      Artwork.create({ imagePath: "uploads/x.jpg", slug: "no-title" }),
    ).rejects.toThrow(); // test for expected failures in async code, asserting that the Promise rejects (throws an error)
  });

  it("rejects missing imagePath", async () => {
    await expect(
      Artwork.create({ title: "No Image", slug: "no-image" }),
    ).rejects.toThrow();
  });

  it("rejects duplicate slug", async () => { // Uniqueness constraint ; bc slug: { unique: true }
    await Artwork.create({
      title: "First",
      imagePath: "uploads/a.jpg",
      slug: "same",
    });
    await expect(
      Artwork.create({
        title: "Second",
        imagePath: "uploads/b.jpg",
        slug: "same",
      }),
    ).rejects.toThrow();
  });
});
