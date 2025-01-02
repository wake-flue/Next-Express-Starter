import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
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
import { cn } from '@/lib/utils';

// 日志级别图标映射
const levelIcons = {
  [LogLevel.ERROR]: <AlertCircle className="w-4 h-4" />,
  [LogLevel.WARN]: <AlertTriangle className="w-4 h-4" />,
  [LogLevel.INFO]: <Info className="w-4 h-4" />,
  [LogLevel.DEBUG]: <Bug className="w-4 h-4" />,
};

// 日志级别样式映射
const levelStyles = {
  [LogLevel.ERROR]: 'bg-red-50 text-red-700 ring-red-600/20',
  [LogLevel.WARN]: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  [LogLevel.INFO]: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  [LogLevel.DEBUG]: 'bg-gray-50 text-gray-700 ring-gray-600/20',
};

// 日志详情对话框
function LogDetailDialog({ log }: { log: ILogEntry }) {
  // 检查对象是否有有效内容
  const hasContent = (obj: any) => {
    if (!obj) return false;
    if (typeof obj === 'string') return obj.trim().length > 0;
    if (Array.isArray(obj)) return obj.length > 0;
    if (typeof obj === 'object') {
      return Object.values(obj).some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        return true;
      });
    }
    return true;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden sm:w-4/5 md:w-3/4">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base sm:text-lg font-semibold">日志详情</DialogTitle>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Badge variant="outline" className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-medium',
                levelStyles[log.level]
              )}>
                {levelIcons[log.level]}
                {log.level}
              </Badge>
              <Badge variant="outline" className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs">
                {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </Badge>
              {log.meta?.source && (
                <Badge variant="outline" className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs">
                  {log.meta.source}
                </Badge>
              )}
              {log.meta?.environment && (
                <Badge variant="outline" className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs">
                  {log.meta.environment}
                </Badge>
              )}
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-4 py-3 sm:px-6 sm:py-4 overflow-y-auto">
          <div className="space-y-3 sm:space-y-4">
            {/* 消息内容 */}
            {hasContent(log.message) && (
              <div className="space-y-1 sm:space-y-1.5">
                <div className="text-xs sm:text-sm font-medium text-gray-500">消息</div>
                <div className="p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-mono whitespace-pre-wrap border">
                  {log.message}
                </div>
              </div>
            )}

            {/* 操作信息 */}
            {hasContent(log.meta?.operation) && (
              <div className="space-y-1 sm:space-y-1.5">
                <div className="text-xs sm:text-sm font-medium text-gray-500">操作</div>
                <div className="p-2 sm:p-3 rounded-lg text-xs sm:text-sm border">
                  {log.meta.operation}
                </div>
              </div>
            )}

            {/* 请求信息 */}
            {hasContent(log.meta?.requestInfo) && (
              <div className="space-y-1 sm:space-y-1.5">
                <div className="text-xs sm:text-sm font-medium text-gray-500">请求信息</div>
                <div className="p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-mono border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {log.meta.requestInfo?.method && <div>方法：{log.meta.requestInfo.method}</div>}
                    {log.meta.requestInfo?.url && <div>路径：{log.meta.requestInfo.url}</div>}
                    {log.meta.requestInfo?.ip && <div>IP：{log.meta.requestInfo.ip}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* 响应信息 */}
            {hasContent(log.meta?.responseInfo) && (
              <div className="space-y-1 sm:space-y-1.5">
                <div className="text-xs sm:text-sm font-medium text-gray-500">响应信息</div>
                <div className="p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-mono border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {log.meta.responseInfo?.status && <div>状态码：{log.meta.responseInfo.status}</div>}
                    {log.meta.responseInfo?.duration !== undefined && <div>耗时：{log.meta.responseInfo.duration}ms</div>}
                    {hasContent(log.meta.responseInfo?.message) && (
                      <div className="col-span-1 sm:col-span-2">消息：{log.meta.responseInfo?.message}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 错误信息 */}
            {hasContent(log.meta?.error) && (
              <div className="space-y-1 sm:space-y-1.5">
                <div className="text-xs sm:text-sm font-medium text-gray-500">错误信息</div>
                <div className="p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-mono whitespace-pre-wrap border text-red-600">
                  {log.meta.error?.name && <div>类型：{log.meta.error.name}</div>}
                  {log.meta.error?.message && <div>消息：{log.meta.error.message}</div>}
                  {hasContent(log.meta.error?.stack) && (
                    <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs">
                      堆栈：
                      <div className="mt-1 pl-3 sm:pl-4 border-l-2 border-red-200">
                        {log.meta.error?.stack}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 客户端信息 */}
            {hasContent(log.meta?.client) && (
              <div className="space-y-1 sm:space-y-1.5">
                <div className="text-xs sm:text-sm font-medium text-gray-500">客户端信息</div>
                <div className="p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-mono border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {log.meta.client?.browser && <div>浏览器：{log.meta.client.browser}</div>}
                    {log.meta.client?.os && <div>操作系统：{log.meta.client.os}</div>}
                    {log.meta.client?.device && <div>设备：{log.meta.client.device}</div>}
                    {hasContent(log.meta.client?.url) && (
                      <div className="col-span-1 sm:col-span-2">URL：{log.meta.client?.url}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 其他元数据 */}
            {hasContent(log.meta?.additionalData) && (
              <div className="space-y-1 sm:space-y-1.5">
                <div className="text-xs sm:text-sm font-medium text-gray-500">其他信息</div>
                <div className="p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-mono whitespace-pre-wrap border">
                  {JSON.stringify(log.meta.additionalData, null, 2)}
                </div>
              </div>
            )}

            {/* 完整元数据 */}
            <div className="space-y-1 sm:space-y-1.5">
              <div className="text-xs sm:text-sm font-medium text-gray-500">完整元数据</div>
              <div className="p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-mono whitespace-pre-wrap border">
                {JSON.stringify(log.meta, null, 2)}
              </div>
            </div>
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
      <div className="flex items-center justify-center py-8 text-red-500 gap-2">
        <AlertCircle className="w-5 h-5" />
        加载日志数据失败
      </div>
    );
  }

  // 空状态
  if (!data?.data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <ScrollArea className="w-12 h-12 mb-4 text-gray-400" />
        <p>暂无日志数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 日志表格 */}
      <div className="rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-0">
              <TableHead className="w-[100px]">级别</TableHead>
              <TableHead>消息</TableHead>
              <TableHead 
                className="w-[180px] cursor-pointer"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-1">
                  时间
                  {sortField === 'timestamp' && (
                    sortOrder === 'desc' ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronUp className="w-4 h-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[100px]">来源</TableHead>
              <TableHead className="w-[120px]">操作</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {data.data.map((log, index) => (
                <motion.tr
                  key={log._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="group hover:bg-gray-50/50 border-0"
                >
                  <TableCell className="py-2">
                    <Badge variant="outline" className={cn(
                      'flex w-fit items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ring-1 ring-inset',
                      levelStyles[log.level]
                    )}>
                      {levelIcons[log.level]}
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm max-w-[400px] truncate py-2">
                    {log.message}
                  </TableCell>
                  <TableCell className="text-sm py-2">
                    {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                  </TableCell>
                  <TableCell className="text-sm py-2">
                    {log.meta.source}
                  </TableCell>
                  <TableCell className="text-sm py-2">
                    {log.meta.operation || '-'}
                  </TableCell>
                  <TableCell className="py-2">
                    <LogDetailDialog log={log} />
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}