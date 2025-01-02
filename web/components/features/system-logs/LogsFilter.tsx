import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LogLevel } from '@/utils/logger';
import { Card } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info, Bug, RefreshCw } from 'lucide-react';

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
    <Card className="p-4">
      <div className="space-y-4">
        {/* 第一行：日志级别、环境和快捷时间范围 */}
        <div className="flex flex-wrap gap-4">
          <div className="w-[200px]">
            <Select
              value={level}
              onValueChange={(value) => handleFilter('level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择日志级别" />
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
          </div>

          <div className="w-[200px]">
            <Select
              value={environment}
              onValueChange={(value) => handleFilter('environment', value)}
            >
              <SelectTrigger>
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
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickTimeRange('1h')}
            >
              近1小时
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickTimeRange('24h')}
            >
              近24小时
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickTimeRange('7d')}
            >
              近7天
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickTimeRange('30d')}
            >
              近30天
            </Button>
          </div>
        </div>

        {/* 第二行：操作类型和时间范围 */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-[200px]">
            <Input
              value={operation}
              onChange={(e) => handleFilter('operation', e.target.value)}
              placeholder="操作类型"
              className="w-full"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              type="datetime-local"
              value={startTime ? startTime.slice(0, 16) : ''}
              onChange={(e) => handleFilter('startTime', new Date(e.target.value).toISOString())}
              className="w-full"
              placeholder="开始时间"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              type="datetime-local"
              value={endTime ? endTime.slice(0, 16) : ''}
              onChange={(e) => handleFilter('endTime', new Date(e.target.value).toISOString())}
              className="w-full"
              placeholder="结束时间"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              重置
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}