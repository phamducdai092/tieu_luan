export type AuthState = {
	user: User | null;
	loading: boolean;
	error: string | null;
	isLoadingMe: boolean;
	login: (payload: LoginPayload) => Promise<void>;
	logout: () => void;
	loadMe: () => Promise<void>;
};

export type User = { 
	id: number; 
	avatar_url: string;
	display_name: string;
	email: string;
	looked: boolean;
	online: boolean;
	verified: boolean;
	role: 'USER' | 'ADMIN';
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
