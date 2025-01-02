export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

export interface TodoFilters {
  completed?: boolean;
  title?: string;
}

export interface TodoSort {
  sortBy?: 'title' | 'createdAt' | 'completed';
  sortOrder?: 'asc' | 'desc';
}

export interface TodoPagination {
  page?: number;
  pageSize?: number;
}

export interface TodoListResponse {
  data: Todo[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: TodoFilters;
  sort: TodoSort;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: number;
    operation: string;
    message: string;
    details?: any;
  };
} 