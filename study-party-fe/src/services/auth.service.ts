import http from "@/lib/http.ts";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth.type.ts";
import { clearTokens } from "@/lib/token.ts";
import type {TokenPair} from "@/types/token.type.ts";

export const login = (payload: LoginPayload) => {
	return http.post<AuthResponse>("auth/login", payload, { withCredentials: true });
};

export const register = (payload: RegisterPayload) => {
	return http.post<void>("auth/register", payload,  { withCredentials: true });
};

export const logout = () => {
	clearTokens();
	return http.post("auth/logout");
};

export const loadMe = () => {
	return http.get("user/me");
};

export const refreshToken = () => {
    return http.post<TokenPair>("auth/refresh", {}, { withCredentials: true });
}