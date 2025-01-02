import { api } from '@/lib/axios';
import {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilters,
  TodoSort,
  TodoPagination,
  TodoListResponse,
  ApiResponse,
} from 'types/todo';

const todoRequestUrl = '/todos';

// Todo相关API
export const todoApi = {
  // 获取待办事项列表
  getTodos: async (
    params?: TodoFilters & TodoSort & TodoPagination
  ): Promise<TodoListResponse> => {
    const response = await api.get<ApiResponse<TodoListResponse>>(todoRequestUrl, {
      params,
    });
    return response.data.data;
  },

  // 获取单个待办事项
  getTodo: async (id: string): Promise<Todo> => {
    const response = await api.get<ApiResponse<Todo>>(`${todoRequestUrl}/${id}`);
    return response.data.data;
  },

  // 创建待办事项
  createTodo: async (todo: CreateTodoInput): Promise<Todo> => {
    const response = await api.post<ApiResponse<Todo>>(todoRequestUrl, todo);
    return response.data.data;
  },

  // 更新待办事项
  updateTodo: async (id: string, todo: UpdateTodoInput): Promise<Todo> => {
    const response = await api.put<ApiResponse<Todo>>(`${todoRequestUrl}/${id}`, todo);
    return response.data.data;
  },

  // 删除待办事项
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`${todoRequestUrl}/${id}`);
  },
}; 