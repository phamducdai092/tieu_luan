// http.ts
import axios, {
	AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import {
	getAccess,
	setTokens,
	clearTokens,
	getRefreshing,
	startRefreshing,
	doneRefreshing,
	failRefreshing,
	queueRefresh,
} from "./token";

const BASE_URL =
	import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:8080";

export const http = axios.create({
	baseURL: BASE_URL + "/",
	withCredentials: true, // ✅ QUAN TRỌNG: để cookie refresh đi kèm
	headers: { "Content-Type": "application/json" },
});

// unwrap { data: ... } -> data
function unwrap<T = any>(res: AxiosResponse<any>): AxiosResponse<T> {
	const body = res?.data;
	if (body && typeof body === "object" && "data" in body) {
		return { ...res, data: (body as any).data };
	}
	return res as AxiosResponse<T>;
}

function isRefreshUrl(url?: string): boolean {
	if (!url) return false;
	try {
		const u = new URL(url, BASE_URL + "/");
		return /^\/?auth\/refresh(?:\/)?$/.test(u.pathname.replace(/^\/+|\/+$/g, ""));
	} catch {
		return /\/auth\/refresh(?:\?|$)/.test(url);
	}
}

// Request: gắn Bearer cho mọi request TRỪ refresh
http.interceptors.request.use((config) => {
	const token = getAccess();
	const fullUrl = (config.baseURL || "") + (config.url || "");
	config.headers = config.headers ?? {};
	if (!isRefreshUrl(fullUrl) && token && token.trim() !== "") {
		(config.headers as any).Authorization = `Bearer ${token}`;
	} else {
		delete (config.headers as any).Authorization;
	}
	return config;
});

// Response: auto refresh 401
http.interceptors.response.use(
	(res) => unwrap(res),
	async (error: AxiosError) => {
		const original = error.config as AxiosRequestConfig & { _retry?: boolean };
		const fullUrl = (original?.baseURL || "") + (original?.url || "");
		const isRefresh = isRefreshUrl(fullUrl);

		if (error.response?.status === 401 && !original?._retry && !isRefresh) {
			original._retry = true;

			if (!getRefreshing()) {
				startRefreshing();
				try {
					// ✅ KHÔNG gửi body; cookie HttpOnly tự đi nhờ withCredentials
					const res = await axios.post(
						`${BASE_URL}/auth/refresh`,
						{},
						{ withCredentials: true }
					);

					// unwrap: có thể { data: { accessToken } } hoặc { accessToken }
					const payload =
						res?.data && (res.data as any).data ? (res.data as any).data : res?.data;
					const { accessToken } = (payload || {}) as any;

					if (!accessToken) throw new Error("No new access token");

					// ✅ chỉ set accessToken; refreshToken do cookie quản
					setTokens({ accessToken });
					doneRefreshing(accessToken);

					original.headers = original.headers ?? {};
					(original.headers as any).Authorization = `Bearer ${accessToken}`;
					return http(original);
				} catch (e) {
					failRefreshing();
					clearTokens();
					queueRefresh(null as any); // báo fail cho hàng đợi
					window.location.replace("/login");
					return Promise.reject(e);
				}
			}

			// Đang refresh: vào hàng đợi
			return new Promise((resolve, reject) => {
				queueRefresh((newAccess) => {
					if (!newAccess) return reject(error);
					original.headers = original.headers ?? {};
					(original.headers as any).Authorization = `Bearer ${newAccess}`;
					resolve(http(original));
				});
			});
		}

		return Promise.reject(error);
	}
);

export default http;
