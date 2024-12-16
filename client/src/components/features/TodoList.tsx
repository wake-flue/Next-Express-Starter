import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo } from '@/types/todo';
import { todoApi } from '@/apis/todo';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/card';

export function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const queryClient = useQueryClient();

  // 获取所有待办事项
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: todoApi.getAllTodos,
  });

  // 创建待办事项
  const createMutation = useMutation({
    mutationFn: todoApi.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodo('');
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    createMutation.mutate({ title: newTodo });
  };

  // 处理状态切换
  const handleToggle = (todo: Todo) => {
    updateMutation.mutate({
      id: todo._id,
      todo: { completed: !todo.completed },
    });
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>待办事项</CardTitle>
        <CardDescription>使用React Query管理服务器状态</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="添加新的待办事项..."
            className="flex-1"
          />
          <Button type="submit" disabled={createMutation.isPending}>
            添加
          </Button>
        </form>

        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  className="w-4 h-4"
                />
                <span
                  className={`${
                    todo.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {todo.title}
                </span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(todo._id)}
                disabled={deleteMutation.isPending}
              >
                删除
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 