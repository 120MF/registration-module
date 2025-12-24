import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './layouts/MainLayout';
import DepartmentsPage from './pages/DepartmentsPage';
import ExpertsPage from './pages/ExpertsPage';
import SchedulesPage from './pages/SchedulesPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/experts" element={<ExpertsPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/my-appointments" element={<MyAppointmentsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
