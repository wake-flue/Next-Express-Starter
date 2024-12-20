const Todo = require('../models/Todo');

class TodoService {
  async getAllTodos() {
    return await Todo.find().sort({ createdAt: -1 });
  }

  async createTodo(todoData) {
    const todo = new Todo(todoData);
    return await todo.save();
  }

  async updateTodo(id, todoData) {
    return await Todo.findByIdAndUpdate(
      id,
      { $set: todoData },
      { new: true, runValidators: true }
    );
  }

  async deleteTodo(id) {
    return await Todo.findByIdAndDelete(id);
  }
}

module.exports = new TodoService(); 