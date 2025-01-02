import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AlertCircle, AlertTriangle, Info, Bug, Download, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogLevel } from '@/utils/logger';
import { logsApi } from '@/lib/apis/service-logs';
import { ILogEntry } from '@/types/log';

// 日志级别图标映射
const levelIcons = {
  [LogLevel.ERROR]: <AlertCircle className="w-4 h-4" />,
  [LogLevel.WARN]: <AlertTriangle className="w-4 h-4" />,
  [LogLevel.INFO]: <Info className="w-4 h-4" />,
  [LogLevel.DEBUG]: <Bug className="w-4 h-4" />,
};

// 日志级别样式映射
const levelStyles = {
  [LogLevel.ERROR]: 'bg-red-100 text-red-800 hover:bg-red-200',
  [LogLevel.WARN]: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  [LogLevel.INFO]: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  [LogLevel.DEBUG]: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
};

// 日志详情对话框
function LogDetailDialog({ log }: { log: ILogEntry }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle>日志详情</DialogTitle>
          <DialogDescription className="text-sm">
            查看日志的完整信息，包括时间、级别、来源和详细内容
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-3 px-2">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-medium text-gray-500">级别</div>
                <Badge variant="secondary" className={levelStyles[log.level]}>
                  <span className="flex items-center gap-1">
                    {levelIcons[log.level]}
                    {log.level}
                  </span>
                </Badge>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">时间</div>
                <div className="text-sm">{format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">来源</div>
                <div className="text-sm">{log.source || '-'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">URL</div>
                <div className="text-sm truncate">{log.url || '-'}</div>
              </div>
            </div>

            {/* 消息内容 */}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">消息</div>
              <div className="bg-gray-50 p-2 rounded-md font-mono text-sm whitespace-pre-wrap">
                {log.message}
              </div>
            </div>

            {/* 元数据 */}
            {log.metadata && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">元数据</div>
                <div className="bg-gray-50 p-2 rounded-md font-mono text-sm">
                  <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function LogsTable() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;
  const levelParam = searchParams.get('level');
  const level = levelParam as LogLevel | undefined;
  const startTime = searchParams.get('startTime') || undefined;
  const endTime = searchParams.get('endTime') || undefined;

  // 排序状态
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 获取日志数据
  const { data, isLoading, error } = useQuery({
    queryKey: ['logs', { page, pageSize, level, startTime, endTime, sortBy: sortField, sortOrder }],
    queryFn: () => logsApi.query({ 
      page, 
      pageSize, 
      level, 
      startTime, 
      endTime, 
      sortBy: sortField, 
      sortOrder 
    }),
  });

  // 处理排序
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // 导出日志
  const handleExport = () => {
    if (!data?.data.length) return;

    const csvContent = [
      // CSV 头部
      ['级别', '消息', '时间', '来源', '操作', '环境'].join(','),
      // CSV 数据行
      ...data.data.map(log => [
        log.level,
        `"${log.message.replace(/"/g, '""')}"`,
        format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        log.meta.source || '',
        log.meta.operation || '',
        log.meta.environment
      ].join(','))
    ].join('\n');

    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    link.click();
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        加载日志数据失败
      </div>
    );
  }

  // 空状态
  if (!data?.data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无日志数据
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          共 {data.pagination.total} 条记录
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={!data?.data.length}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          导出日志
        </Button>
      </div>

      {/* 日志表格 */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">级别</TableHead>
              <TableHead>消息</TableHead>
              <TableHead 
                className="w-[200px] cursor-pointer"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-2">
                  时间
                  {sortField === 'timestamp' && (
                    sortOrder === 'desc' ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronUp className="w-4 h-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[120px]">来源</TableHead>
              <TableHead className="w-[120px]">操作</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((log) => (
              <TableRow key={log._id} className="group">
                <TableCell>
                  <Badge variant="secondary" className={levelStyles[log.level]}>
                    <span className="flex items-center gap-1">
                      {levelIcons[log.level]}
                      {log.level}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell className="font-mono max-w-[400px] truncate">
                  {log.message}
                </TableCell>
                <TableCell>
                  {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
                <TableCell>{log.meta.source}</TableCell>
                <TableCell>{log.meta.operation || '-'}</TableCell>
                <TableCell>
                  <LogDetailDialog log={log} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          第 {data.pagination.page} 页，每页 {data.pagination.pageSize} 条
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={data.pagination.page <= 1}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('page', String(data.pagination.page - 1));
              window.history.pushState(null, '', `?${params.toString()}`);
            }}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={data.pagination.page >= data.pagination.totalPages}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('page', String(data.pagination.page + 1));
              window.history.pushState(null, '', `?${params.toString()}`);
            }}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}