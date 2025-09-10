import type {User} from "@/types/user.type.ts";

export type AuthState = {
	user: User | null;
	userRoles: string[];
	loading: boolean;
	error: string | null;
	login: (payload: LoginPayload) => Promise<void>;
	logout: () => void;
	loadMe: () => Promise<void>;
	_hydrated: boolean; // để biết store đã được rehydrate từ localStorage chưa
	setHydrated: (v: boolean) => void;
	meStatus: 'idle' | 'loading' | 'success' | 'error';
	loadMeOnce: () => void; // wrapper đảm bảo chỉ gọi loadMe 1 lần
};

export type UseAuthGuardOpts = {
	roles?: string[];          // ví dụ ["ADMIN"]
	verifiedOnly?: boolean;    // nếu cần trang chỉ cho user đã xác thực
};

export type LoginPayload = { 
	email: string; 
	password: string 
};

export type RegisterPayload = {
	email: string;
	password: string;
};

export type AuthResponse = {
	accessToken: string;
	refreshToken?: string;
	refreshTtlSeconds?: number;
	user: User;
};

export type TokenPair = {
	accessToken: string;
	refreshToken?: string;
	refreshTtlSeconds: number;
}
