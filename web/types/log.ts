import { LogLevel } from '@/utils/logger';

// 日志条目接口
export interface ILogEntry {
  _id: string;
  level: LogLevel;
  message: string;
  timestamp: string;
  source?: 'frontend' | 'backend';
  url?: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  request?: {
    method: string;
    url: string;
    status: number;
    duration: number;
    userAgent: string;
    ip: string;
    host: string;
  };
  client?: {
    browser: string;
    os: string;
    device: string;
    url: string;
  };
}

// 日志查询参数接口
export interface ILogQueryParams {
  level?: LogLevel;
  source?: string;
  startTime?: string;
  endTime?: string;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

// 日志查询响应接口
export interface ILogQueryResponse {
  total: number;
  logs: ILogEntry[];
  page: number;
  pageSize: number;
  totalPages: number;
} 