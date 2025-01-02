import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LogLevel } from '@/utils/logger';
import { AlertCircle, AlertTriangle, Info, Bug, RefreshCw, Search } from 'lucide-react';

// 日志级别选项
const levelOptions = [
  { value: 'all', label: '全部级别', icon: null },
  { value: LogLevel.ERROR, label: '错误', icon: <AlertCircle className="w-4 h-4 text-red-500" /> },
  { value: LogLevel.WARN, label: '警告', icon: <AlertTriangle className="w-4 h-4 text-yellow-500" /> },
  { value: LogLevel.INFO, label: '信息', icon: <Info className="w-4 h-4 text-blue-500" /> },
  { value: LogLevel.DEBUG, label: '调试', icon: <Bug className="w-4 h-4 text-gray-500" /> },
];

// 环境选项
const environmentOptions = [
  { value: 'all', label: '全部环境' },
  { value: 'development', label: '开发环境' },
  { value: 'production', label: '生产环境' },
];

export function LogsFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const level = searchParams.get('level') || 'all';
  const environment = searchParams.get('environment') || 'all';
  const startTime = searchParams.get('startTime') || '';
  const endTime = searchParams.get('endTime') || '';
  const operation = searchParams.get('operation') || '';

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    replace(pathname);
  };

  // 设置快捷时间范围
  const handleQuickTimeRange = (range: string) => {
    const now = new Date();
    const start = new Date();

    switch (range) {
      case '1h':
        start.setHours(now.getHours() - 1);
        break;
      case '24h':
        start.setDate(now.getDate() - 1);
        break;
      case '7d':
        start.setDate(now.getDate() - 7);
        break;
      case '30d':
        start.setDate(now.getDate() - 30);
        break;
    }

    const params = new URLSearchParams(searchParams);
    params.set('startTime', start.toISOString());
    params.set('endTime', now.toISOString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-3">
      {/* 第一行：搜索和快捷时间范围 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={operation}
              onChange={(e) => handleFilter('operation', e.target.value)}
              placeholder="搜索日志内容..."
              className="pl-10 bg-gray-50/50 border-0 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex gap-1">
          {['1h', '24h', '7d', '30d'].map((range) => (
            <motion.div key={range} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickTimeRange(range)}
                className="bg-gray-50/50 hover:bg-gray-100/50 px-2"
              >
                近{range.replace('h', '小时').replace('d', '天')}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 第二行：筛选条件 */}
      <div className="flex flex-wrap items-center gap-2 bg-gray-50/30 p-2 rounded-lg">
        <Select
          value={level}
          onValueChange={(value) => handleFilter('level', value)}
        >
          <SelectTrigger className="w-[120px] bg-white/50 border-0 focus:ring-1 focus:ring-blue-100">
            <SelectValue placeholder="日志级别" />
          </SelectTrigger>
          <SelectContent>
            {levelOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={environment}
          onValueChange={(value) => handleFilter('environment', value)}
        >
          <SelectTrigger className="w-[120px] bg-white/50 border-0 focus:ring-1 focus:ring-blue-100">
            <SelectValue placeholder="选择环境" />
          </SelectTrigger>
          <SelectContent>
            {environmentOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 min-w-[200px] flex items-center gap-1">
          <Input
            type="datetime-local"
            value={startTime ? startTime.slice(0, 16) : ''}
            onChange={(e) => handleFilter('startTime', new Date(e.target.value).toISOString())}
            className="bg-white/50 border-0 focus:ring-1 focus:ring-blue-100"
          />
          <span className="text-gray-400 px-1">至</span>
          <Input
            type="datetime-local"
            value={endTime ? endTime.slice(0, 16) : ''}
            onChange={(e) => handleFilter('endTime', new Date(e.target.value).toISOString())}
            className="bg-white/50 border-0 focus:ring-1 focus:ring-blue-100"
          />
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1 bg-gray-50/50 hover:bg-gray-100/50"
          >
            <RefreshCw className="w-4 h-4" />
            重置
          </Button>
        </motion.div>
      </div>
    </div>
  );
}