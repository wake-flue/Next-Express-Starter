import { api } from 'lib/axios';
import { Todo, CreateTodoInput } from 'types/todo';

// Todo相关API
export const todoApi = {
  // 获取所有待办事项
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await api.get('/todos');
    return response.data;
  },

  // 创建待办事项
  createTodo: async (todo: CreateTodoInput): Promise<Todo> => {
    const response = await api.post('/todos', todo);
    return response.data;
  },

  // 更新待办事项
  updateTodo: async (id: string, todo: Partial<Todo>): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  },

  // 删除待办事项
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
}; 