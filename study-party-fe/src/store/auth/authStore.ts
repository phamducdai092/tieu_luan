import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, LoginPayload } from '@/types/auth.type';
import {
	loadMe as apiLoadMe,
	login as apiLogin,
} from '@/services/auth_api/auth';
import { clearTokens, setTokens } from '@/lib/token';

const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			loading: false,
			error: null,
			isLoadingMe: false,

			login: async (payload: LoginPayload) => {
				set({ loading: true, error: null });
				try {
					const res = await apiLogin(payload);
					// http đã unwrap -> res.data là payload thật
					const { accessToken, refreshToken, user } = (res.data ||
						{}) as any;
					if (!accessToken) throw new Error('No access token');
					setTokens({ accessToken, refreshToken });
					set({ user: user ?? null, loading: false });
				} catch (e: any) {
					set({
						error:
							e?.response?.data?.message ||
							e?.message ||
							'Login failed',
						loading: false,
					});
					throw e;
				}
			},

			logout: () => {
				clearTokens();
				set({ user: null });
				window.location.href = '/login';
			},

			loadMe: async () => {
				set({ isLoadingMe: true });
				try {
					const res = await apiLoadMe();
					set({ user: res.data.user, isLoadingMe: false });
				} catch {
					// token hỏng/expired -> để interceptor xử lý
				}
			},
		}),
		{
			name: 'auth', // key trong localStorage
			storage: createJSONStorage(() => localStorage),
			// chỉ persist field user (không persist loading/error)
			partialize: (s) => ({ user: s.user }),
		}
	)
);

export default useAuthStore;
