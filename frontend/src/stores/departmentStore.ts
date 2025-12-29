import { create } from 'zustand';
import { departmentAPI } from '../services/api';
import type { Department } from '../types';

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchDepartments: (force?: boolean) => Promise<void>;
  addDepartment: (data: Omit<Department, 'id'>) => Promise<Department>;
  updateDepartment: (id: number, data: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;
  clearError: () => void;
}

// 缓存有效期：5分钟
const CACHE_DURATION = 5 * 60 * 1000;

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchDepartments: async (force = false) => {
    const { lastFetched, loading } = get();

    // 如果正在加载，跳过
    if (loading) return;

    // 如果缓存有效且不强制刷新，跳过
    if (!force && lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const departments = await departmentAPI.getDepartments();
      set({
        departments,
        loading: false,
        lastFetched: Date.now(),
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '获取科室列表失败',
        loading: false,
      });
    }
  },

  addDepartment: async (data) => {
    const response = await departmentAPI.createDepartment(data);
    const newDepartment = response.data as Department;
    set((state) => ({
      departments: [...state.departments, newDepartment],
    }));
    return newDepartment;
  },

  updateDepartment: async (id, data) => {
    await departmentAPI.updateDepartment(id, data);
    set((state) => ({
      departments: state.departments.map((dept) =>
        dept.id === id ? { ...dept, ...data } : dept,
      ),
    }));
  },

  deleteDepartment: async (id) => {
    await departmentAPI.deleteDepartment(id);
    set((state) => ({
      departments: state.departments.filter((dept) => dept.id !== id),
    }));
  },

  clearError: () => set({ error: null }),
}));
