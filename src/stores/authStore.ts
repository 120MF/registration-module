import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginAPI } from '../services/api';

export type UserRole = 'admin' | 'patient' | 'doctor';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  // 医生角色专属字段
  staffId?: number;
  departmentId?: number;
  position?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (username: string) => {
        set({ loading: true });
        try {
          // 调用登录API，只需要用户名
          const response = await loginAPI.login({ username, password: '' });
          const { token, user } = response.data as {
            token: string;
            user: User;
          };

          // 保存token到localStorage（用于API请求）
          localStorage.setItem('token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          return true;
        } catch {
          set({ loading: false });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
