import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useEffect, useRef} from "react";
import useAuthStore from "@/store/auth/authStore";
import {getAccess} from "@/lib/token";
import {toast} from "sonner";

export default function AdminRoute() {
    const location = useLocation();
    const hydrated = useAuthStore((s) => s._hydrated);
    const token = getAccess();
    const user = useAuthStore((s) => s.user);
    const status = useAuthStore((s) => s.meStatus);   // 'idle' | 'loading' | 'success' | 'error'
    const loadMe = useAuthStore((s) => s.loadMeOnce);

    // Kick off loadMe khi cần (không làm trong render)
    useEffect(() => {
        if (!hydrated) return;
        if (token && !user && (status === "idle" || status === "error")) {
            loadMe();
        }
    }, [hydrated, token, user, status, loadMe]);

    if (!hydrated) return null;
    if (!token) {
        return <Navigate to="/login" replace state={{from: location}}/>;
    }
    if (status === "loading" || (!user && (status === "idle" || status === "error"))) {
        return (
            <div className="min-h-screen grid place-items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary animate-pulse"/>
                    <span>Đang kiểm tra quyền truy cập…</span>
                </div>
            </div>
        );
    }
    // Tới đây chắc chắn có user
    const warned = useRef(false);
    useEffect(() => {
        if (user && user.role !== "ADMIN" && !warned.current) {
            warned.current = true;
            toast.error("Bạn không có quyền truy cập trang này");
        }
    }, [user]);

    if (user && user.role !== "ADMIN") {
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
}
