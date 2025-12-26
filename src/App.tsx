import { App as AntdApp, ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';
import MobileLayout from './layouts/MobileLayout';
// Admin pages
import DepartmentPage from './pages/admin/DepartmentPage';
import PatientManagementPage from './pages/admin/PatientManagementPage';
import PaymentPage from './pages/admin/PaymentPage';
import PrescriptionPage from './pages/admin/PrescriptionPage';
import SchedulingPage from './pages/admin/SchedulingPage';
import StaffPage from './pages/admin/StaffPage';
import LoginPage from './pages/login/LoginPage';

// Doctor pages
import AppointmentsPage from './pages/doctor/AppointmentsPage';

// Patient pages
import ProfilePage from './pages/patient/ProfilePage';
import RegistrationHistoryPage from './pages/patient/RegistrationHistoryPage';
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
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<DepartmentPage />} />
              <Route path="departments" element={<DepartmentPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="scheduling" element={<SchedulingPage />} />
              <Route path="patients" element={<PatientManagementPage />} />
              <Route path="payments" element={<PaymentPage />} />
              <Route path="prescriptions" element={<PrescriptionPage />} />
            </Route>

            {/* 医生子系统 */}
            <Route path="/doctor/*" element={<DoctorLayout />}>
              <Route index element={<AppointmentsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
            </Route>

            {/* 患者移动端子系统 */}
            <Route path="/patient/*" element={<MobileLayout />}>
              <Route index element={<ProfilePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="registration" element={<RegistrationPage />} />
              <Route path="history" element={<RegistrationHistoryPage />} />
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
