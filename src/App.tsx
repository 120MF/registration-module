import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';
import MobileLayout from './layouts/MobileLayout';
import LoginPage from './pages/login/LoginPage';

// Admin pages
import DepartmentPage from './pages/admin/DepartmentPage';
import StaffPage from './pages/admin/StaffPage';
import DevicePage from './pages/admin/DevicePage';
import DrugDictPage from './pages/admin/DrugDictPage';
import SchedulingPage from './pages/admin/SchedulingPage';

// Doctor pages
import WorkbenchPage from './pages/doctor/WorkbenchPage';

// Patient pages
import HomePage from './pages/patient/HomePage';
import ProfilePage from './pages/patient/ProfilePage';
import RegistrationPage from './pages/patient/RegistrationPage';
import HistoryPage from './pages/patient/HistoryPage';

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
              <Route path="devices" element={<DevicePage />} />
              <Route path="drugs" element={<DrugDictPage />} />
              <Route path="scheduling" element={<SchedulingPage />} />
            </Route>

            {/* 医生子系统 */}
            <Route path="/doctor/*" element={<DoctorLayout />} >
              <Route index element={<WorkbenchPage />} />
            </Route>

            {/* 患者移动端子系统 */}
            <Route path="/patient/*" element={<MobileLayout />} >
              <Route index element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="registration" element={<RegistrationPage />} />
              <Route path="history" element={<HistoryPage />} />
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
