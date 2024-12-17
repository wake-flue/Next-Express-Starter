'use client';

import React from 'react';
import { PageLayout } from '@/components/common/PageLayout';
import { LogsTable } from '@/components/features/LogsTable';
import { LogsFilter } from '@/components/features/LogsFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList } from 'lucide-react';

export default function LogsPage() {
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            系统日志
          </h1>
          <p className="text-xl text-gray-600">
            查看和管理系统运行日志
          </p>
        </div>

        {/* 日志卡片 */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <ClipboardList className="w-8 h-8 text-blue-500" />
            <div>
              <CardTitle>日志列表</CardTitle>
              <CardDescription>系统运行日志记录</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {/* 日志筛选器 */}
            <LogsFilter />
            
            {/* 日志表格 */}
            <ScrollArea className="h-[600px] mt-6">
              <LogsTable />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 