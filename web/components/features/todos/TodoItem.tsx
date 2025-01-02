import { Button } from 'components/ui/button';
import { CheckCircle2, Circle, Trash2, Loader2 } from 'lucide-react';
import { Todo } from 'types/todo';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  layout?: 'list' | 'grid';
  isLast?: boolean;
}

export function TodoItem({ 
  todo, 
  onToggle, 
  onDelete, 
  isDeleting = false,
  layout = 'list',
  isLast = false
}: TodoItemProps) {
  const createdAt = new Date(todo.createdAt);
  
  if (layout === 'grid') {
    return (
      <div
        className={cn(
          'group flex flex-col gap-3 p-4',
          'bg-gray-50/30',
          'transition-all duration-300 ease-in-out',
          'hover:bg-gray-100/50',
          todo.completed ? 'opacity-60' : ''
        )}
      >
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => onToggle(todo)}
            className="flex-shrink-0 focus:outline-none transition-transform"
          >
            {todo.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500" />
            )}
          </button>
          
          <div className="flex-1 min-w-0 text-center">
            <div className={cn(
              'text-sm font-medium break-words',
              todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
            )}>
              {todo.title}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              创建于 {format(createdAt, 'PPP p', { locale: zhCN })}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(todo._id)}
          disabled={isDeleting}
          className={cn(
            'w-full opacity-0 group-hover:opacity-100',
            'transition-all duration-200',
            'text-gray-400 hover:text-red-500',
            isDeleting ? 'opacity-100' : ''
          )}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              <span className="ml-2">删除</span>
            </>
          )}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="group relative">
      <div className={cn(
        'flex items-center gap-3 px-4 py-3',
        'transition-colors duration-200',
        'hover:bg-gray-50/50',
        todo.completed ? 'opacity-60' : ''
      )}>
        <button
          onClick={() => onToggle(todo)}
          className="flex-shrink-0 focus:outline-none"
        >
          {todo.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className={cn(
            'text-sm font-medium truncate',
            todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
          )}>
            {todo.title}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            创建于 {format(createdAt, 'PPP p', { locale: zhCN })}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo._id)}
          disabled={isDeleting}
          className={cn(
            'flex-shrink-0 opacity-0 group-hover:opacity-100',
            'transition-opacity duration-200',
            'text-gray-400 hover:text-red-500',
            isDeleting ? 'opacity-100' : ''
          )}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {!isLast && (
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      )}
    </div>
  );
} 