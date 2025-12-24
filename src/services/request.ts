import axios from 'axios';

// 根据环境设置基础URL
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // 浏览器环境
    if (process.env.NODE_ENV === 'production') {
      // 生产环境，可以根据需要设置实际的API服务器地址
      // 如果没有后端API，保持为相对路径，让部署平台处理
      return '/api';
    } else {
      // 开发环境
      return '/api';
    }
  }
  return '/api';
};

// 创建axios实例
const request = axios.create({
  baseURL: getBaseURL(), // 统一的基础路径
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 统一处理响应数据
    return response.data;
  },
  (error) => {
    // 统一处理错误
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

export default request;