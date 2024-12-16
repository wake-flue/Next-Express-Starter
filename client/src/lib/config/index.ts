// API配置
export const API_CONFIG = {
  // API基础URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  
  // API超时时间(ms)
  TIMEOUT: 5000,
  
  // 默认请求头
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  }
} as const;

// 其他全局配置
export const APP_CONFIG = {
  // 应用名称
  APP_NAME: 'Next-Express-Starter',
  
  // 版本号
  VERSION: '1.0.0'
} as const; 