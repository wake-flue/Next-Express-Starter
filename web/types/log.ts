import { LogLevel } from '@/utils/logger';

// 日志条目接口
export interface ILogEntry {
  _id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  meta: {
    operation?: string;
    model?: string;
    source: 'frontend' | 'backend';
    environment: 'development' | 'production';
    requestInfo?: {
      method: string;
      url: string;
      ip: string;
      headers: any;
      query: any;
    };
    responseInfo?: {
      status: number;
      message: string;
      duration: number;
    };
    error?: {
      name: string;
      message: string;
      stack?: string;
    };
    client?: {
      browser: string;
      os: string;
      device: string;
      url: string;
    };
    additionalData?: any;
  };
}

// 日志查询参数接口
export interface ILogQueryParams {
  page?: number;
  pageSize?: number;
  level?: LogLevel;
  source?: string;
  status?: number;
  operation?: string;
  errorType?: string;
  startTime?: string;
  endTime?: string;
  search?: string;
  environment?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 日志查询响应接口
export interface ILogQueryResponse {
  data: ILogEntry[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  filters: {
    level?: string;
    source?: string;
  };
  sort: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
} 