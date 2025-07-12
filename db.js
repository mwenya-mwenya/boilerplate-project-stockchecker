const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri =  process.env.DB;

let dbInstance = null; // This will cache the connected DB

module.exports = async function getDB() {
  if (!uri) throw new Error('MongoDB connection string is missing in .env');

  // Return existing connection if it exists
  if (dbInstance) return dbInstance;

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('stockChecker');

    // Create index once on initial connection
    await db.collection('LIKES').createIndex(
      { hash: 1, stockSymbol: 1 },
      { unique: true }
    );

    console.log(`Connected to ${db.databaseName} successfully`);
    dbInstance = db; // Cache the DB instance
    return dbInstance;
  } catch (err) {
    console.error('DB connection error:', err);
    return null;
  }
};
