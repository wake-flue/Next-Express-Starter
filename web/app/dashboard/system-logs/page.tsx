'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LogsTable } from '@/components/features/system-logs/LogsTable';
import { LogsFilter } from '@/components/features/system-logs/LogsFilter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdvancedPagination } from '@/components/ui/pagination';
import { useQuery } from '@tanstack/react-query';
import { logsApi } from '@/lib/apis/service-logs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  
  // 获取当前分页参数
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;
  
  // 获取总记录数
  const { data: logsData } = useQuery({
    queryKey: ['logs', { page, pageSize }],
    queryFn: () => logsApi.query({ page, pageSize }),
  });
  
  // 处理分页变化
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 筛选器折叠按钮 */}
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="mr-2">筛选</span>
          {isFilterVisible ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* 日志筛选器 */}
      <div className={cn(
        "mb-2 overflow-hidden transition-all duration-200 ease-in-out",
        isFilterVisible ? "h-auto opacity-100" : "h-0 opacity-0"
      )}>
        <LogsFilter />
      </div>
      
      {/* 日志表格 */}
      <ScrollArea className={cn(
        "transition-all duration-200 ease-in-out",
        isFilterVisible ? "h-[calc(100vh-20rem)]" : "h-[calc(100vh-12rem)]"
      )}>
        <LogsTable />
      </ScrollArea>

      {/* 分页控制器 */}
      <div className="mt-2 flex justify-center">
        <AdvancedPagination 
          page={page}
          pageSize={pageSize}
          total={logsData?.pagination.total}
          onChange={handlePageChange}
          siblingsCount={2}
          className="bg-white/50 backdrop-blur-sm py-1 px-2 rounded-lg"
        />
      </div>
    </div>
  );
} 