import { api } from '@/lib/axios';
import { ILogEntry, ILogQueryParams, ILogQueryResponse } from '@/types/log';

// 日志API接口
export interface ILogsApi {
  batchSend(logs: ILogEntry[]): Promise<void>;
  query(params: ILogQueryParams): Promise<ILogQueryResponse>;
}

const logsRequestUrl = '/logs';

// 日志API实现
export const logsApi: ILogsApi = {
  /**
   * 批量发送日志
   * @param logs 日志条目数组
   */
  async batchSend(logs: ILogEntry[]): Promise<void> {
    try {
      await api.post(logsRequestUrl, logs);
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
      const { data } = await api.get(logsRequestUrl, { params });
      return data.data;
    } catch (error) {
      console.error('Failed to query logs:', error);
      throw error;
    }
  }
}; 