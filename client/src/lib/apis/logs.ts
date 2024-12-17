import { api } from '../axios';
import type { LogLevel } from '@/utils/logger';

// 日志条目接口
export interface ILogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  userAgent: string;
  url: string;
}

// 日志查询参数接口
export interface ILogQueryParams {
  level?: LogLevel;
  startTime?: string;
  endTime?: string;
  page?: number;
  pageSize?: number;
}

// 日志查询响应接口
export interface ILogQueryResponse {
  total: number;
  logs: ILogEntry[];
}

// 日志API接口
export interface ILogsApi {
  batchSend(logs: ILogEntry[]): Promise<void>;
  query(params: ILogQueryParams): Promise<ILogQueryResponse>;
}

// 日志API实现
export const logsApi: ILogsApi = {
  /**
   * 批量发送日志
   * @param logs 日志条目数组
   */
  async batchSend(logs: ILogEntry[]): Promise<void> {
    try {
      await api.post(`/logs`, { logs });
    } catch (error) {
      console.error('Failed to send logs:', error);
      throw error;
    }
  },

  /**
   * 查询日志
   * @param params 查询参数
   */
  async query(params: ILogQueryParams): Promise<ILogQueryResponse> {
    try {
      const { data } = await api.get('/logs', { params });
      return data;
    } catch (error) {
      console.error('Failed to query logs:', error);
      throw error;
    }
  }
}; 