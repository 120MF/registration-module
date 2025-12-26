import { create } from 'zustand';
import { patientAPI } from '../services/api';
import type { PatientProfile } from '../types';

interface PatientState {
  profile: PatientProfile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: PatientProfile) => Promise<void>;
  clearProfile: () => void;
  clearError: () => void;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  profile: null,
  loading: false,
  saving: false,
  error: null,

  fetchProfile: async () => {
    // 如果已有数据，不重复请求
    if (get().profile || get().loading) return;

    set({ loading: true, error: null });
    try {
      const profile = await patientAPI.getProfile();
      set({ profile, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '获取患者信息失败',
        loading: false,
      });
    }
  },

  updateProfile: async (data) => {
    set({ saving: true, error: null });
    try {
      await patientAPI.updateProfile(data);
      set({ profile: data, saving: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '更新患者信息失败',
        saving: false,
      });
      throw err;
    }
  },

  clearProfile: () => {
    set({ profile: null, loading: false, saving: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
