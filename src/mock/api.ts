import { Department, Expert, Schedule, Appointment, SystemSettings } from '../types';
import generateMockData from './data';
import dayjs from 'dayjs';

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取所有数据
const { departments, experts, schedules, appointments, settings } = generateMockData();

// API服务
export const departmentAPI = {
  getDepartments: async (): Promise<Department[]> => {
    await delay(300);
    return [...departments];
  },

  getDepartment: async (id: string): Promise<Department | undefined> => {
    await delay(300);
    return departments.find(dept => dept.id === id);
  },

  createDepartment: async (dept: Omit<Department, 'id'>): Promise<Department> => {
    await delay(300);
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`
    };
    departments.push(newDept);
    return newDept;
  },

  updateDepartment: async (id: string, dept: Partial<Department>): Promise<Department | undefined> => {
    await delay(300);
    const index = departments.findIndex(d => d.id === id);
    if (index !== -1) {
      departments[index] = { ...departments[index], ...dept };
      return departments[index];
    }
    return undefined;
  },

  deleteDepartment: async (id: string): Promise<boolean> => {
    await delay(300);
    const index = departments.findIndex(d => d.id === id);
    if (index !== -1) {
      departments.splice(index, 1);
      return true;
    }
    return false;
  }
};

export const expertAPI = {
  getExperts: async (): Promise<Expert[]> => {
    await delay(300);
    return [...experts];
  },

  getExpert: async (id: string): Promise<Expert | undefined> => {
    await delay(300);
    return experts.find(exp => exp.id === id);
  },

  getExpertsByDepartment: async (deptId: string): Promise<Expert[]> => {
    await delay(300);
    return experts.filter(exp => exp.departmentId === deptId);
  },

  createExpert: async (exp: Omit<Expert, 'id'>): Promise<Expert> => {
    await delay(300);
    const newExp: Expert = {
      ...exp,
      id: `expert-${Date.now()}`
    };
    experts.push(newExp);
    return newExp;
  },

  updateExpert: async (id: string, exp: Partial<Expert>): Promise<Expert | undefined> => {
    await delay(300);
    const index = experts.findIndex(e => e.id === id);
    if (index !== -1) {
      experts[index] = { ...experts[index], ...exp };
      return experts[index];
    }
    return undefined;
  },

  deleteExpert: async (id: string): Promise<boolean> => {
    await delay(300);
    const index = experts.findIndex(e => e.id === id);
    if (index !== -1) {
      experts.splice(index, 1);
      // 同时删除相关的排班和预约
      schedules.filter(s => s.expertId === id).forEach(s => {
        const schedIndex = schedules.findIndex(sched => sched.id === s.id);
        if (schedIndex !== -1) schedules.splice(schedIndex, 1);
      });
      appointments.filter(a => a.expertId === id).forEach(a => {
        const apptIndex = appointments.findIndex(appt => appt.id === a.id);
        if (apptIndex !== -1) appointments.splice(apptIndex, 1);
      });
      return true;
    }
    return false;
  }
};

export const scheduleAPI = {
  getSchedules: async (): Promise<Schedule[]> => {
    await delay(300);
    return [...schedules];
  },

  getSchedulesByExpert: async (expertId: string): Promise<Schedule[]> => {
    await delay(300);
    return schedules.filter(s => s.expertId === expertId);
  },

  getSchedulesByDate: async (date: string): Promise<Schedule[]> => {
    await delay(300);
    return schedules.filter(s => s.date === date);
  },

  getSchedulesByExpertAndDate: async (expertId: string, date: string): Promise<Schedule[]> => {
    await delay(300);
    return schedules.filter(s => s.expertId === expertId && s.date === date);
  },

  updateSchedule: async (id: string, schedule: Partial<Schedule>): Promise<Schedule | undefined> => {
    await delay(300);
    const index = schedules.findIndex(s => s.id === id);
    if (index !== -1) {
      schedules[index] = { ...schedules[index], ...schedule };
      return schedules[index];
    }
    return undefined;
  },

  generateSchedules: async (date: string, expertIds?: string[]): Promise<Schedule[]> => {
    await delay(500);
    const newSchedules: Schedule[] = [];
    
    const filteredExperts = expertIds ? experts.filter(e => expertIds.includes(e.id)) : experts;
    
    filteredExperts.forEach(expert => {
      ['morning', 'afternoon', 'evening'].forEach(timeSlot => {
        const existingSchedule = schedules.find(
          s => s.expertId === expert.id && s.date === date && s.timeSlot === timeSlot
        );
        
        if (!existingSchedule) {
          const maxSlots = expert.maxAppointments / 3;
          const newSchedule: Schedule = {
            id: `sched-${expert.id}-${date}-${timeSlot}`,
            expertId: expert.id,
            date,
            timeSlot,
            availableSlots: maxSlots,
            maxSlots
          };
          schedules.push(newSchedule);
          newSchedules.push(newSchedule);
        }
      });
    });
    
    return newSchedules;
  }
};

export const appointmentAPI = {
  getAppointments: async (): Promise<Appointment[]> => {
    await delay(300);
    return [...appointments];
  },

  getAppointmentsByPatient: async (patientId: string): Promise<Appointment[]> => {
    await delay(300);
    return appointments.filter(a => a.patientId === patientId);
  },

  getAppointmentsByExpert: async (expertId: string): Promise<Appointment[]> => {
    await delay(300);
    return appointments.filter(a => a.expertId === expertId);
  },

  getAppointmentsByDate: async (date: string): Promise<Appointment[]> => {
    await delay(300);
    return appointments.filter(a => a.appointmentDate === date);
  },

  createAppointment: async (appt: Omit<Appointment, 'id' | 'status' | 'createTime'>): Promise<Appointment> => {
    await delay(300);
    const newAppt: Appointment = {
      ...appt,
      id: `appt-${Date.now()}`,
      status: settings.requireConfirmation ? 'pending' : 'confirmed',
      createTime: dayjs().toISOString()
    };
    
    // 减少对应排班的可预约数量
    const scheduleIndex = schedules.findIndex(s => s.id === appt.scheduleId);
    if (scheduleIndex !== -1) {
      schedules[scheduleIndex].availableSlots -= 1;
    }
    
    appointments.push(newAppt);
    return newAppt;
  },

  updateAppointment: async (id: string, appt: Partial<Appointment>): Promise<Appointment | undefined> => {
    await delay(300);
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...appt };
      return appointments[index];
    }
    return undefined;
  },

  deleteAppointment: async (id: string): Promise<boolean> => {
    await delay(300);
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      // 恢复对应排班的可预约数量
      const appointment = appointments[index];
      const scheduleIndex = schedules.findIndex(s => s.id === appointment.scheduleId);
      if (scheduleIndex !== -1) {
        schedules[scheduleIndex].availableSlots += 1;
      }
      
      appointments.splice(index, 1);
      return true;
    }
    return false;
  },

  confirmAppointment: async (id: string): Promise<Appointment | undefined> => {
    await delay(300);
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index].status = 'confirmed';
      appointments[index].confirmTime = dayjs().toISOString();
      return appointments[index];
    }
    return undefined;
  }
};

export const settingsAPI = {
  getSettings: async (): Promise<SystemSettings> => {
    await delay(300);
    return { ...settings };
  },

  updateSettings: async (updatedSettings: Partial<SystemSettings>): Promise<SystemSettings> => {
    await delay(300);
    Object.assign(settings, updatedSettings);
    return { ...settings };
  }
};