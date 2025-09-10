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
			userRoles: [],
			loading: false,
			error: null,
			_hydrated: false,
			setHydrated: (v: boolean) => set({ _hydrated: v }),
			meStatus: 'idle',

			login: async (payload: LoginPayload) => {
				set({ loading: true, error: null });
				try {
					const res = await apiLogin(payload);
					// http đã unwrap -> res.data là payload thật
					const { accessToken, user } = (res.data ||
						{});
					if (!accessToken) throw new Error('No access token');
					setTokens({ accessToken });
					set({ user: user ?? null, userRoles: [user.role] , loading: false });
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
				window.location.href = '/';
			},

			loadMe: async () => {
				set({ meStatus: 'loading' });
				try {
					const res = await apiLoadMe();
					set({ user: res.data.user, meStatus: 'success' });
				} catch(e) {
					// token hỏng/expired -> để interceptor xử lý
					set({ meStatus: 'error' });
					throw e;
				}
			},

			loadMeOnce: () => {
				const { meStatus } = get();
				if (meStatus === 'idle' || meStatus === 'error') void get().loadMe();
			},
		}),
		{
			name: 'auth', // key trong localStorage
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				// chạy sau khi rehydrate xong
				state?.setHydrated(true);
			},
			// chỉ persist field user (không persist loading/error)
			partialize: (s) => ({ user: s.user }),
		}
	)
);

export default useAuthStore;
