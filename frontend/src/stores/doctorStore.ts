import { create } from 'zustand';
import { patientAPI } from '../services/api';
import type { Staff } from '../types';

interface DoctorState {
  doctorsByDepartment: Record<number, Staff[]>;
  loading: Record<number, boolean>;
  error: string | null;
  fetchDoctorsByDepartment: (
    deptId: number,
    force?: boolean,
  ) => Promise<Staff[]>;
  clearError: () => void;
  clearCache: () => void;
}

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctorsByDepartment: {},
  loading: {},
  error: null,

  fetchDoctorsByDepartment: async (deptId, force = false) => {
    const { doctorsByDepartment, loading } = get();

    // 如果正在加载该部门的医生，等待
    if (loading[deptId]) {
      return doctorsByDepartment[deptId] || [];
    }

    // 如果已有缓存且不强制刷新，直接返回
    if (!force && doctorsByDepartment[deptId]) {
      return doctorsByDepartment[deptId];
    }

    set((state) => ({
      loading: { ...state.loading, [deptId]: true },
      error: null,
    }));

    try {
      const doctors = await patientAPI.getDoctorsByDepartment(deptId);
      set((state) => ({
        doctorsByDepartment: {
          ...state.doctorsByDepartment,
          [deptId]: doctors,
        },
        loading: { ...state.loading, [deptId]: false },
      }));
      return doctors;
    } catch (err) {
      set((state) => ({
        error: err instanceof Error ? err.message : '获取医生列表失败',
        loading: { ...state.loading, [deptId]: false },
      }));
      return [];
    }
  },

  clearError: () => set({ error: null }),

  clearCache: () => set({ doctorsByDepartment: {}, loading: {} }),
}));
