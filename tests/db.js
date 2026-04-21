const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongod;

//creates a fresh in-memory MongoDB and connects Mongoose to it. Called once before the test suite starts.
async function connect() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  // Force all registered models to build their indexes now.
  // Without this, `unique: true` indexes build lazily and duplicate-key
  // tests can race — the second insert lands before the index exists.
  await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
}

//shut down after all tests finish.
async function disconnect() {
  await mongoose.disconnect();
  await mongod.stop();
}

//"writing tests that have reproducible results" => fresh start for each test.
//wipes every collection between individual tests. 
//without it, data from one test would bleed into the next, making tests order-dependent and unreliable.
async function clearAll() {
  for (const key in mongoose.connection.collections) {
    await mongoose.connection.collections[key].deleteMany({});
  }
}

module.exports = { connect, disconnect, clearAll };
