import { Card, CardContent } from 'components/ui/card';
import { ListTodo, Circle, CheckCheck } from 'lucide-react';

interface TodoStatsProps {
  totalTodos: number;
  activeTodos: number;
  completedTodos: number;
}

export function TodoStats({ totalTodos, activeTodos, completedTodos }: TodoStatsProps) {
  return (
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
  );
} 