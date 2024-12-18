const mongoose = require('mongoose');

// 定义集合名称常量
const COLLECTIONS = {
  LOGS: 'logs',
  TODOS: 'todos'
};

// 连接数据库
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    return conn;
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  COLLECTIONS
}; 