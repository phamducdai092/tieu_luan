// token.ts
export type Tokens = { accessToken?: string };

const ACCESS_KEY = "token";
const hasWindow = typeof window !== "undefined";

export function getAccess(): string {
    if (!hasWindow) return "";
    return localStorage.getItem(ACCESS_KEY) || "";
}

export function setTokens(tokens: Tokens) {
    if (!hasWindow) return;
    const {accessToken} = tokens;
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
}

export function clearTokens() {
    if (!hasWindow) return;
    localStorage.removeItem(ACCESS_KEY);
}

export function isLoggedIn() {
    return !!getAccess();
}

// ---- Refresh queue ----
let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

export function queueRefresh(cb: (newAccess: string | null) => void) {
    queue.push(cb);
}

export function startRefreshing() {
    isRefreshing = true;
}

export function doneRefreshing(newAccess: string) {
    isRefreshing = false;
    queue.forEach((fn) => fn(newAccess));
    queue = [];
}

export function failRefreshing() {
    isRefreshing = false;
    queue.forEach((fn) => fn(null)); // thông báo fail
    queue = [];
}

export function getRefreshing() {
    return isRefreshing;
}
