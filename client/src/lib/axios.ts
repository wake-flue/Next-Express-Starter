import axios from 'axios';
import { API_CONFIG } from '@/config';

// 创建统一的axios实例
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
}); 