const { MongoClient } = require("mongodb");

let client = null;
let db = null;

/**
 * Connects to MongoDB. The app keeps running even if the database
 * is unavailable, so the API can still be started during development.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
  const dbName = process.env.DB_NAME || "saloone";

  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
    await client.connect();
    db = client.db(dbName);
    console.log(`MongoDB connected: ${dbName}`);
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn("Server will keep running without a database.");
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database is not connected");
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = { connectDB, getDB, closeDB };
