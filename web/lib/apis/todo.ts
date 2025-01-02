import { api } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
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

// Toast 配置
const TOAST_DURATION = 2000; // 2秒后自动消失

// Todo相关API
export const todoApi = {
  // 获取待办事项列表
  getTodos: async (
    params?: TodoFilters & TodoSort & TodoPagination
  ): Promise<TodoListResponse> => {
    try {
      // 如果pageSize为0，移除分页参数以获取所有数据
      const queryParams = params?.pageSize === 0 
        ? { 
            ...params,
            page: undefined,
            pageSize: undefined
          }
        : params;

      const response = await api.get<ApiResponse<TodoListResponse>>(todoRequestUrl, {
        params: queryParams,
      });
      return response.data.data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "获取待办事项失败",
        description: error.response?.data?.message || "请稍后重试",
        duration: TOAST_DURATION,
      });
      throw error;
    }
  },

  // 获取单个待办事项
  getTodo: async (id: string): Promise<Todo> => {
    try {
      const response = await api.get<ApiResponse<Todo>>(`${todoRequestUrl}/${id}`);
      return response.data.data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "获取待办事项详情失败",
        description: error.response?.data?.message || "请稍后重试",
        duration: TOAST_DURATION,
      });
      throw error;
    }
  },

  // 创建待办事项
  createTodo: async (todo: CreateTodoInput): Promise<Todo> => {
    try {
      const response = await api.post<ApiResponse<Todo>>(todoRequestUrl, todo);
      return response.data.data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "创建待办事项失败",
        description: error.response?.data?.message || "请稍后重试",
        duration: TOAST_DURATION,
      });
      throw error;
    }
  },

  // 更新待办事项
  updateTodo: async (id: string, todo: UpdateTodoInput): Promise<Todo> => {
    try {
      const response = await api.put<ApiResponse<Todo>>(`${todoRequestUrl}/${id}`, todo);
      return response.data.data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "更新待办事项失败",
        description: error.response?.data?.message || "请稍后重试",
        duration: TOAST_DURATION,
      });
      throw error;
    }
  },

  // 删除待办事项
  deleteTodo: async (id: string): Promise<void> => {
    try {
      await api.delete(`${todoRequestUrl}/${id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "删除待办事项失败",
        description: error.response?.data?.message || "请稍后重试",
        duration: TOAST_DURATION,
      });
      throw error;
    }
  },
}; 