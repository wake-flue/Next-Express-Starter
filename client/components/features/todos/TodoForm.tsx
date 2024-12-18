import { useState } from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

interface TodoFormProps {
  onSubmit: (title: string) => void;
  isSubmitting?: boolean;
}

export function TodoForm({ onSubmit, isSubmitting = false }: TodoFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="添加新的待办事项..."
        className="flex-1"
      />
      <Button type="submit" disabled={isSubmitting}>
        添加
      </Button>
    </form>
  );
}
