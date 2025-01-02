import { ListFilter, CheckCircle2, Circle, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'active' | 'completed';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalCount?: number;
  activeCount?: number;
  completedCount?: number;
}

export function TodoFilters({ 
  currentFilter, 
  onFilterChange,
  totalCount = 0,
  activeCount = 0,
  completedCount = 0
}: TodoFiltersProps) {
  const filters = [
    {
      id: 'all' as const,
      label: '全部',
      icon: LayoutList,
      count: totalCount,
      isActive: currentFilter === 'all',
    },
    {
      id: 'active' as const,
      label: '进行中',
      icon: Circle,
      count: activeCount,
      isActive: currentFilter === 'active',
    },
    {
      id: 'completed' as const,
      label: '已完成',
      icon: CheckCircle2,
      count: completedCount,
      isActive: currentFilter === 'completed',
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 text-sm transition-all duration-200',
              filter.isActive
                ? 'bg-blue-50/50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50/50'
            )}
          >
            <Icon className={cn(
              'w-4 h-4',
              filter.isActive ? 'text-blue-500' : 'text-gray-400'
            )} />
            <span className="font-medium">
              {filter.label}
            </span>
            <span className={cn(
              'px-1.5 py-0.5 text-xs',
              filter.isActive
                ? 'text-blue-600'
                : 'text-gray-600'
            )}>
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
} 