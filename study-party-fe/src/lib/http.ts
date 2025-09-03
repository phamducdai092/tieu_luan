import axios, {
	AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from 'axios';
import {
	getAccess,
	getRefresh,
	setTokens,
	clearTokens,
	getRefreshing,
	startRefreshing,
	doneRefreshing,
	failRefreshing,
	queueRefresh,
} from './token';
import { useNavigate } from 'react-router-dom';



const BASE_URL =
	import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
	'http://localhost:8080';

// Tạo instance, luôn có trailing slash để join path chuẩn
export const http = axios.create({
	baseURL: BASE_URL + '/',
	withCredentials: false,
});

// -------- Helper: unwrap envelope { data: ... } -> trả thẳng data
function unwrap<T = any>(res: AxiosResponse<any>): AxiosResponse<T> {
	const body = res?.data;
	if (body && typeof body === 'object' && 'data' in body) {
		return { ...res, data: (body as any).data };
	}
	return res as AxiosResponse<T>;
}

// -------- Request: gắn access token nếu có & KHÔNG gắn cho /auth/refresh
http.interceptors.request.use((config) => {
	const token = getAccess();
	const url = (config.baseURL || '') + (config.url || '');

	// Bỏ Authorization cho refresh
	const isRefresh = /\/auth\/refresh(?:\?|$)/.test(url);
	config.headers = config.headers ?? {};

	if (
		!isRefresh &&
		token &&
		token !== 'undefined' &&
		token !== 'null' &&
		token.trim() !== ''
	) {
		(config.headers as any).Authorization = `Bearer ${token}`;
	} else {
		delete (config.headers as any).Authorization;
	}
	return config;
});

// -------- Response: unwrap 2xx + tự refresh 401
http.interceptors.response.use(
	(res) => unwrap(res),
	async (error: AxiosError) => {
		const original = error.config as AxiosRequestConfig & {
			_retry?: boolean;
		};

		const navigate = useNavigate();

		// Chỉ xử lý khi 401 và có refresh token và chưa retry
		if (
			error.response?.status === 401 &&
			!original?._retry &&
			getRefresh()
		) {
			original._retry = true;

			if (!getRefreshing()) {
				startRefreshing();
				try {
					// GỌI TRỰC TIẾP axios (không qua http) để tránh interceptor request gắn token
					const res = await axios.post(`${BASE_URL}/auth/refresh`, {
						refreshToken: getRefresh(),
					});

					const payload =
						res.data && (res.data as any).data
							? (res.data as any).data
							: res.data;

					const { accessToken, refreshToken } = (payload ||
						{}) as any;
					if (!accessToken || !refreshToken) {
						throw new Error('Refresh payload invalid');
					}

					setTokens({ accessToken, refreshToken });
					doneRefreshing(accessToken);

					original.headers = original.headers ?? {};
					(
						original.headers as any
					).Authorization = `Bearer ${accessToken}`;

					// Retry request cũ với access mới
					return http(original);
				} catch (e) {
					failRefreshing();
					clearTokens();
					// điều hướng về login
					navigate('/login');
					return Promise.reject(e);
				}
			}

			// Nếu đang refresh: xếp hàng đợi rồi retry sau
			return new Promise((resolve) => {
				queueRefresh((newAccess) => {
					original.headers = original.headers ?? {};
					(
						original.headers as any
					).Authorization = `Bearer ${newAccess}`;
					resolve(http(original));
				});
			});
		}

		return Promise.reject(error);
	}
);

export default http;
