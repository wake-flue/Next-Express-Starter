const mongoose = require('mongoose');

const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/next-express-starter',
  options: {
    maxPoolSize: 10,
    minPoolSize: 2,
    writeConcern: {
      w: 1,
      j: true
    }
  },
  collections: {
    LOGS: process.env.MONGODB_COLLECTION_LOGS || 'logs',
    TODOS: process.env.MONGODB_COLLECTION_TODOS || 'todos'
  },
  connectDB: async () => {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
  }
};

module.exports = dbConfig; 