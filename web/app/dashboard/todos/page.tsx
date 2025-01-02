'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo, TodoFilters, TodoSort, TodoPagination } from 'types/todo';
import { todoApi } from '@/lib/apis/todo';
import { TodoStats } from '@/components/features/todos/TodoStats';
import { TodoForm } from '@/components/features/todos/TodoForm';
import { TodoFilters as TodoFilterButtons } from '@/components/features/todos/TodoFilters';
import { TodoItem } from '@/components/features/todos/TodoItem';
import { Search, SlidersHorizontal, LayoutGrid, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const queryClient = useQueryClient();

  // 获取待办事项列表
  const { data: todoData, isLoading } = useQuery({
    queryKey: ['todos', filters, sort, pagination],
    queryFn: () => todoApi.getTodos({ ...filters, ...sort, ...pagination }),
  });

  // 获取所有待办事项（用于统计）
  const { data: allTodosData } = useQuery({
    queryKey: ['todos', 'stats'],
    queryFn: () => todoApi.getTodos({ pageSize: 0 }), // pageSize为0表示获取所有数据
  });

  // 统计信息
  const totalTodos = allTodosData?.pagination.total ?? 0;
  const completedTodos = allTodosData?.data.filter((todo) => todo.completed).length ?? 0;
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
    <div className="flex flex-col h-full">
      {/* 顶部工具栏 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
        {/* 搜索栏 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索待办事项..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 bg-gray-50/30 border-0 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* 视图切换 - 在小屏幕下隐藏 */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={`gap-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
          >
            <LayoutList className="w-4 h-4" />
            <span className="hidden sm:inline">列表</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`gap-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">网格</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* 右侧边栏 - 在小屏幕下只显示添加任务表单 */}
        <div className="w-full lg:w-80 flex flex-col gap-4 order-first lg:order-last">
          {/* 添加任务表单 */}
          <TodoForm
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
          />

          {/* 统计信息 - 在小屏幕下隐藏 */}
          <div className="hidden lg:block">
            <TodoStats
              totalTodos={totalTodos}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
            />
          </div>
        </div>

        {/* 左侧内容区 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 筛选和排序工具栏 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <TodoFilterButtons
                currentFilter={filters.completed === undefined 
                  ? 'all' 
                  : filters.completed 
                    ? 'completed' 
                    : 'active'
                }
                onFilterChange={handleFilterChange}
                totalCount={totalTodos}
                activeCount={activeTodos}
                completedCount={completedTodos}
              />
              <div className="hidden sm:block h-6 w-px bg-gray-200" />
              <Select
                value={`${sort.sortBy}-${sort.sortOrder}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-full sm:w-[140px] bg-gray-50/30 border-0 focus:ring-2 focus:ring-blue-100">
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
          </div>

          {/* 任务列表 */}
          <div className="flex-1 overflow-auto min-h-0">
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' 
                : ''
              }
            `}>
              {todoData?.data.map((todo, index) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  isDeleting={deleteMutation.isPending}
                  layout={viewMode}
                  isLast={index === todoData.data.length - 1}
                />
              ))}

              {todoData?.data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <p>
                    {!filters.completed
                      ? '暂无待办事项'
                      : filters.completed
                      ? '暂无已完成的任务'
                      : '暂无进行中的任务'}
                  </p>
                </div>
              )}
            </div>

            {/* 分页 */}
            {todoData && todoData.pagination.totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
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
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 