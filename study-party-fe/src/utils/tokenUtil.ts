import { getAccess } from "@/lib/token";

export function isJwtExpired(token?: string | null) {
    if (!token) return true;
    try {
        const [, payload] = token.split(".");
        const { exp } = JSON.parse(atob(payload));
        return !exp || (exp * 1000) < Date.now();
    } catch {
        return true;
    }
}

export function getValidAccessToken(): string | null {
    const t = getAccess?.();
    if (!t) return null;
    if (t === "null" || t === "undefined") return null;
    if (!t.trim()) return null;
    return t;
}
