import { ListTodo, Circle, CheckCheck, Clock, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoStatsProps {
  totalTodos: number;
  activeTodos: number;
  completedTodos: number;
}

export function TodoStats({ totalTodos, activeTodos, completedTodos }: TodoStatsProps) {
  // 计算完成率
  const completionRate = totalTodos ? Math.round((completedTodos / totalTodos) * 100) : 0;
  
  // 环形进度条参数
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (completionRate / 100) * circumference;

  const stats = [
    {
      label: '总任务',
      value: totalTodos,
      icon: ListTodo,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: '进行中',
      value: activeTodos,
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      label: '已完成',
      value: completedTodos,
      icon: CheckCheck,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-900">任务概览</div>
      
      {/* 环形进度展示区域 */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* 背景圆环 */}
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-gray-100"
              />
              {/* 进度圆环 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="text-blue-500 transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            {/* 中心文字 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
              <div className="text-xs text-gray-500">完成率</div>
            </div>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white/50 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center"
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg mb-1",
                stat.bg
              )}>
                <Icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <div className={cn(
                "text-lg font-semibold",
                stat.color
              )}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 