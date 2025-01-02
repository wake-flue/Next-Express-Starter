import { logsApi } from '@/lib/apis/service-logs';
import { ILogEntry } from '@/types/log';

// 日志级别定义
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// 日志配置
const config = {
  remoteLogging: process.env.NODE_ENV === 'production',
  localLogLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.WARN,
  remoteLogLevel: LogLevel.ERROR,
  queueInterval: 5000,
  maxRetries: 3,
  retryDelay: 1000,
};

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

class Logger {
  private static instance: Logger;
  private logQueue: ILogEntry[] = [];
  private isProcessingQueue = false;
  private retryCount = 0;

  private constructor() {
    if (isBrowser) {
      if (config.remoteLogging) {
        setInterval(() => this.processLogQueue(), config.queueInterval);
      }

      window.addEventListener('error', (event) => {
        this.error('Uncaught error:', {
          error: {
            name: event.error?.name || 'Error',
            message: event.message,
            stack: event.error?.stack
          },
          additionalData: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled promise rejection:', {
          error: {
            name: event.reason?.name || 'UnhandledRejection',
            message: event.reason?.message || String(event.reason),
            stack: event.reason?.stack
          }
        });
      });

      window.addEventListener('beforeunload', () => {
        if (this.logQueue.length > 0) {
          this.processLogQueue(true);
        }
      });
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel, isRemote: boolean = false): boolean {
    const targetLevel = isRemote ? config.remoteLogLevel : config.localLogLevel;
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) <= levels.indexOf(targetLevel);
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): ILogEntry {
    const entry: ILogEntry = {
      _id: '', // 由服务器生成
      timestamp: new Date().toISOString(),
      level,
      message,
      meta: {
        source: 'frontend',
        environment: process.env.NODE_ENV || 'development',
        client: {
          browser: navigator.userAgent,
          os: navigator.platform,
          device: 'web',
          url: window.location.href
        }
      }
    };

    // 合并额外数据
    if (data) {
      if (data.error) {
        entry.meta.error = data.error;
      }
      if (data.operation) {
        entry.meta.operation = data.operation;
      }
      if (data.model) {
        entry.meta.model = data.model;
      }
      if (data.requestInfo) {
        entry.meta.requestInfo = data.requestInfo;
      }
      if (data.responseInfo) {
        entry.meta.responseInfo = data.responseInfo;
      }
      if (data.additionalData) {
        entry.meta.additionalData = data.additionalData;
      }
    }

    return entry;
  }

  private async processLogQueue(immediateFlush?: boolean) {
    if (!isBrowser || this.logQueue.length === 0) return;
    
    if (!immediateFlush && this.isProcessingQueue) return;

    this.isProcessingQueue = true;
    const logs = [...this.logQueue];
    this.logQueue = [];

    try {
      await logsApi.batchSend(logs);
      this.retryCount = 0;
    } catch (error) {
      console.error('Failed to send logs:', error);
      
      if (this.retryCount < config.maxRetries) {
        this.retryCount++;
        this.logQueue = [...logs, ...this.logQueue];
        
        setTimeout(() => {
          this.processLogQueue(immediateFlush);
        }, config.retryDelay * this.retryCount);
      } else {
        console.error('Max retry attempts reached for log batch:', {
          batchSize: logs.length,
          lastError: error
        });
        this.retryCount = 0;
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  private log(level: LogLevel, message: string, data?: any, immediateFlush?: boolean) {
    const logEntry = this.createLogEntry(level, message, data);

    if (this.shouldLog(level)) {
      const consoleMethod = level === LogLevel.ERROR ? 'error' :
                          level === LogLevel.WARN ? 'warn' :
                          level === LogLevel.INFO ? 'info' : 'debug';
      console[consoleMethod](message, data || '');
    }

    if (isBrowser && (immediateFlush || (config.remoteLogging && this.shouldLog(level, true)))) {
      this.logQueue.push(logEntry);
      
      if (level === LogLevel.ERROR || immediateFlush) {
        this.processLogQueue(immediateFlush);
      }
    }
  }

  public debug(message: string, data?: any, immediateFlush?: boolean) {
    this.log(LogLevel.DEBUG, message, data, immediateFlush);
  }

  public info(message: string, data?: any, immediateFlush?: boolean) {
    this.log(LogLevel.INFO, message, data, immediateFlush);
  }

  public warn(message: string, data?: any, immediateFlush?: boolean) {
    this.log(LogLevel.WARN, message, data, immediateFlush);
  }

  public error(message: string, data?: any, immediateFlush?: boolean) {
    this.log(LogLevel.ERROR, message, data, immediateFlush);
  }
}

export const logger = Logger.getInstance();
export default logger; 