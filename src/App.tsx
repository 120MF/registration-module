import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import AdminLayout from './layouts/AdminLayout';
import MobileLayout from './layouts/MobileLayout';
import LoginPage from './pages/login/LoginPage';

// Admin pages
import DepartmentPage from './pages/admin/DepartmentPage';
import StaffPage from './pages/admin/StaffPage';
import SchedulingPage from './pages/admin/SchedulingPage';
import PatientManagementPage from './pages/admin/PatientManagementPage';
import PaymentPage from './pages/admin/PaymentPage';

// Patient pages
import ProfilePage from './pages/patient/ProfilePage';
import RegistrationPage from './pages/patient/RegistrationPage';

import './App.css';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AntdApp>
        <BrowserRouter>
          <Routes>
            {/* 登录页面 */}
            <Route path="/login" element={<LoginPage />} />

            {/* 管理员子系统 */}
            <Route path="/admin/*" element={<AdminLayout />} >
              <Route index element={<DepartmentPage />} />
              <Route path="departments" element={<DepartmentPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="scheduling" element={<SchedulingPage />} />
              <Route path="patients" element={<PatientManagementPage />} />
              <Route path="payments" element={<PaymentPage />} />
            </Route>

            {/* 患者移动端子系统 */}
            <Route path="/patient/*" element={<MobileLayout />} >
              <Route index element={<ProfilePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="registration" element={<RegistrationPage />} />
            </Route>

            {/* 默认重定向到登录页 */}
            <Route path="/" element={<LoginPage />} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
