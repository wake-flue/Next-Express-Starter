import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo } from 'types/todo';
import { todoApi } from 'lib/apis/todo';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from 'components/ui/card';
import { CheckCircle2, Circle, ListTodo, CheckCheck, Filter } from 'lucide-react';

export function TodoList() {
  const [newTodo, setNewTodo] = useState('');
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
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <ListTodo className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">总任务</p>
                <p className="text-2xl font-bold">{totalTodos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Circle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">进行中</p>
                <p className="text-2xl font-bold">{activeTodos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <CheckCheck className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">已完成</p>
                <p className="text-2xl font-bold">{completedTodos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>待办事项列表</CardTitle>
          <CardDescription>管理你的日常任务</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 添加表单 */}
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
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

          {/* 过滤按钮 */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              全部
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              进行中
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              已完成
            </Button>
          </div>

          {/* 待办事项列表 */}
          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <div
                key={todo._id}
                className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => handleToggle(todo)}
                    className="focus:outline-none"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-900'
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(todo._id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  删除
                </Button>
              </div>
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