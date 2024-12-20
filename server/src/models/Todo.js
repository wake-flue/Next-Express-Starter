const mongoose = require('mongoose');
const config = require('../config');
const COLLECTIONS = config.db.collections;

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新 updatedAt 字段
todoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Todo = mongoose.model(COLLECTIONS.TODOS, todoSchema);

module.exports = Todo; 