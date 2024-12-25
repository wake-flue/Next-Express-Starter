'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo } from 'types/todo';
import { todoApi } from '@/lib/apis/todo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from 'components/ui/card';
import { TodoStats } from '@/components/features/todos/TodoStats';
import { TodoForm } from '@/components/features/todos/TodoForm';
import { TodoFilters } from '@/components/features/todos/TodoFilters';
import { TodoItem } from '@/components/features/todos/TodoItem';
import { ClipboardList } from 'lucide-react';

export default function TodoPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const queryClient = useQueryClient();

  // 获取所有待办事项
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: todoApi.getAllTodos,
  });

  // 过滤后的待办事项
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // 统计信息
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
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

          {/* 过滤按钮 */}
          <div className="mb-4">
            <TodoFilters
              currentFilter={filter}
              onFilterChange={setFilter}
            />
          </div>

          {/* 待办事项列表 */}
          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending}
              />
            ))}

            {filteredTodos.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {filter === 'all'
                  ? '暂无待办事项'
                  : filter === 'active'
                  ? '暂无进行中的任务'
                  : '暂无已完成的任务'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 