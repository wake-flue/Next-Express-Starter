'use client';

import { LogsTable } from '@/components/features/system-logs/LogsTable';
import { LogsFilter } from '@/components/features/system-logs/LogsFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollText } from 'lucide-react';

// 示例数据
const stats = [
  {
    label: '总日志数',
    value: '289',
    description: '最近30天'
  },
  {
    label: '错误日志',
    value: '12',
    description: '需要关注'
  },
  {
    label: '警告日志',
    value: '45',
    description: '需要留意'
  }
];

export default function LogsPage() {
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统日志</h1>
        <p className="text-gray-500 mt-2">
          查看和管理系统运行日志
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-gray-500">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-400">
                  {stat.description}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 日志卡片 */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <ScrollText className="w-8 h-8 text-blue-500" />
          <div>
            <CardTitle>日志列表</CardTitle>
            <CardDescription>系统运行日志记录</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* 日志筛选器 */}
          <div className="mb-6">
            <LogsFilter />
          </div>
          
          {/* 日志表格 */}
          <ScrollArea className="h-[600px]">
            <LogsTable />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 