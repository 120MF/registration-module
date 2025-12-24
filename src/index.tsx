import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 在生产环境中默认启用mock，可以通过全局变量禁用
// 例如，在浏览器控制台中执行: window.__DISABLE_MOCK__ = true;
const shouldEnableMock =
  process.env.NODE_ENV !== 'production' ||
  !(typeof window !== 'undefined' && (window as any).__DISABLE_MOCK__);

if (shouldEnableMock) {
  import('./mocks'); // 引入mock服务
}

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
