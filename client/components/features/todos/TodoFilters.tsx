import { Button } from 'components/ui/button';

type FilterType = 'all' | 'active' | 'completed';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TodoFilters({ currentFilter, onFilterChange }: TodoFiltersProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('all')}
      >
        全部
      </Button>
      <Button
        variant={currentFilter === 'active' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('active')}
      >
        进行中
      </Button>
      <Button
        variant={currentFilter === 'completed' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('completed')}
      >
        已完成
      </Button>
    </div>
  );
} 