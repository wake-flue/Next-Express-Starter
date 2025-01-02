'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo, TodoFilters, TodoSort, TodoPagination } from 'types/todo';
import { todoApi } from '@/lib/apis/todo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from 'components/ui/card';
import { TodoStats } from '@/components/features/todos/TodoStats';
import { TodoForm } from '@/components/features/todos/TodoForm';
import { TodoFilters as TodoFilterButtons } from '@/components/features/todos/TodoFilters';
import { TodoItem } from '@/components/features/todos/TodoItem';
import { ClipboardList } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DEFAULT_PAGE_SIZE = 20;

export default function TodoPage() {
  // 状态管理
  const [filters, setFilters] = useState<TodoFilters>({});
  const [sort, setSort] = useState<TodoSort>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState<TodoPagination>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [searchTitle, setSearchTitle] = useState('');
  
  const queryClient = useQueryClient();

  // 获取待办事项列表
  const { data: todoData, isLoading } = useQuery({
    queryKey: ['todos', filters, sort, pagination],
    queryFn: () => todoApi.getTodos({ ...filters, ...sort, ...pagination }),
  });

  // 统计信息
  const totalTodos = todoData?.pagination.total ?? 0;
  const completedTodos = todoData?.data.filter((todo) => todo.completed).length ?? 0;
  const activeTodos = totalTodos - completedTodos;

  // 创建待办事项
  const createMutation = useMutation({
    mutationFn: todoApi.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // 更新待办事项
  const updateMutation = useMutation({
    mutationFn: ({ id, todo }: { id: string; todo: Partial<Todo> }) =>
      todoApi.updateTodo(id, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // 删除待办事项
  const deleteMutation = useMutation({
    mutationFn: todoApi.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // 处理提交
  const handleSubmit = (title: string) => {
    createMutation.mutate({ title });
  };

  // 处理状态切换
  const handleToggle = (todo: Todo) => {
    updateMutation.mutate({
      id: todo._id,
      todo: { completed: !todo.completed },
    });
  };

  // 处理过滤器变更
  const handleFilterChange = (filter: 'all' | 'active' | 'completed') => {
    setFilters(filter === 'all' 
      ? {} 
      : { completed: filter === 'completed' }
    );
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 处理搜索
  const handleSearch = () => {
    setFilters(prev => ({ ...prev, title: searchTitle }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 处理排序
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setSort({ sortBy: sortBy as TodoSort['sortBy'], sortOrder: sortOrder as 'asc' | 'desc' });
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">待办事项</h1>
        <p className="text-gray-500 mt-2">
          管理和跟踪你的日常任务
        </p>
      </div>

      {/* 统计信息 */}
      <TodoStats
        totalTodos={totalTodos}
        activeTodos={activeTodos}
        completedTodos={completedTodos}
      />

      {/* 主要内容卡片 */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <ClipboardList className="w-8 h-8 text-blue-500" />
          <div>
            <CardTitle>任务列表</CardTitle>
            <CardDescription>添加、编辑和管理你的待办事项</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* 添加表单 */}
          <div className="mb-6">
            <TodoForm
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending}
            />
          </div>

          {/* 搜索和过滤区域 */}
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索待办事项..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Select
                value={`${sort.sortBy}-${sort.sortOrder}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">创建时间 (最新)</SelectItem>
                  <SelectItem value="createdAt-asc">创建时间 (最早)</SelectItem>
                  <SelectItem value="title-asc">标题 (A-Z)</SelectItem>
                  <SelectItem value="title-desc">标题 (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TodoFilterButtons
              currentFilter={!filters.completed ? 'all' : filters.completed ? 'completed' : 'active'}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* 待办事项列表 */}
          <div className="space-y-2">
            {todoData?.data.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending}
              />
            ))}

            {todoData?.data.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {!filters.completed
                  ? '暂无待办事项'
                  : filters.completed
                  ? '暂无已完成的任务'
                  : '暂无进行中的任务'}
              </div>
            )}
          </div>

          {/* 分页 */}
          {todoData && todoData.pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, pagination.page! - 1))}
                      className={pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: todoData.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === pagination.page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(todoData.pagination.totalPages, pagination.page! + 1))}
                      className={pagination.page === todoData.pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 