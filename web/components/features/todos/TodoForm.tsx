import { useState } from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="text-sm font-medium text-gray-900">新建任务</div>
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 space-y-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <motion.div 
            className="relative"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入任务内容..."
              className="
                bg-gray-50/30 border-0
                focus:ring-1 focus:ring-blue-400
                placeholder:text-gray-400
                transition-all duration-200
              "
              disabled={isSubmitting}
            />
            <AnimatePresence>
              {isSubmitting && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title.trim()}
              className="
                w-full gap-2 
                bg-blue-500 hover:bg-blue-600
                text-white
                disabled:bg-gray-200
                disabled:text-gray-400
                transition-all duration-200
              "
            >
              <Plus className="h-4 w-4" />
              添加任务
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
