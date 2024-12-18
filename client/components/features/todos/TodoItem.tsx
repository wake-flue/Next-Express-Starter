import { Button } from 'components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { Todo } from 'types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function TodoItem({ todo, onToggle, onDelete, isDeleting = false }: TodoItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => onToggle(todo)}
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
        onClick={() => onDelete(todo._id)}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        删除
      </Button>
    </div>
  );
} 