const { MongoClient } = require('mongodb');
const logger = require('./logger');

let client = null;

async function connectDB() {
  try {
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      logger.info('MongoDB connected successfully');
    }
    return client.db();
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = {
  connectDB,
}; 