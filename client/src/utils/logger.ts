import { logsApi, type ILogEntry } from '@/lib/apis/logs';

// 日志级别定义
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// 日志配置
const config = {
  // 是否将日志发送到服务器
  remoteLogging: process.env.NODE_ENV === 'production',
  // 本地日志级别
  localLogLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.WARN,
  // 远程日志级别
  remoteLogLevel: LogLevel.ERROR,
  // 日志队列处理间隔(ms)
  queueInterval: 5000,
  // 最大重试次数
  maxRetries: 3,
  // 重试延迟(ms)
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
      // 仅在浏览器环境下设置事件监听和定时器
      
      // 定期发送日志队列
      if (config.remoteLogging) {
        setInterval(() => this.processLogQueue(), config.queueInterval);
      }

      // 捕获全局错误
      window.addEventListener('error', (event) => {
        this.error('Uncaught error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        });
      });

      // 捕获未处理的Promise错误
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled promise rejection:', {
          reason: event.reason
        });
      });

      // 页面卸载前尝试发送剩余日志
      window.addEventListener('beforeunload', () => {
        if (this.logQueue.length > 0) {
          this.processLogQueue();
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
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      userAgent: isBrowser ? navigator.userAgent : 'server',
      url: isBrowser ? window.location.href : '/'
    };
  }

  private async processLogQueue(immediateFlush?: boolean) {
    // 非浏览器环境或队列为空时直接返回
    if (!isBrowser || this.logQueue.length === 0) return;
    
    // 非立即发送模式下,检查是否正在处理队列
    if (!immediateFlush && this.isProcessingQueue) return;

    this.isProcessingQueue = true;
    const logs = [...this.logQueue];
    this.logQueue = [];

    try {
      await logsApi.batchSend(logs);
      // 成功后重置重试计数
      this.retryCount = 0;
    } catch (error) {
      console.error('Failed to send logs:', error);
      
      // 处理重试逻辑
      if (this.retryCount < config.maxRetries) {
        this.retryCount++;
        this.logQueue = [...logs, ...this.logQueue];
        
        // 延迟重试,保持immediateFlush参数
        setTimeout(() => {
          this.processLogQueue(immediateFlush);
        }, config.retryDelay * this.retryCount);
      } else {
        // 超过最大重试次数,记录到本地
        console.error('Max retry attempts reached for log batch:', {
          batchSize: logs.length,
          lastError: error
        });
        // 重置重试计数
        this.retryCount = 0;
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  private log(level: LogLevel, message: string, data?: any, immediateFlush?: boolean) {
    // 创建日志条目
    const logEntry = this.createLogEntry(level, message, data);

    // 本地控制台输出
    if (this.shouldLog(level)) {
      const consoleMethod = level === LogLevel.ERROR ? 'error' :
                          level === LogLevel.WARN ? 'warn' :
                          level === LogLevel.INFO ? 'info' : 'debug';
      console[consoleMethod](message, data || '');
    }

    // 远程日志 - 仅在浏览器环境下发送
    if (isBrowser && (immediateFlush || (config.remoteLogging && this.shouldLog(level, true)))) {
      this.logQueue.push(logEntry);
      
      // 对于错误日志或指定立即发送的日志,立即尝试发送
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