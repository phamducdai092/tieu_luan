import "./App.css";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Toaster } from "./components/ui/sonner";
import useAuthStore from "./store/auth/authStore";
import React, { useEffect, useRef } from "react";
import { getAccess } from "@/lib/token";

function AppRoutes() {
    return useRoutes(routes);
}

function AppGate({ children }: { children: React.ReactNode }) {
    const hasHydrated = useAuthStore((s) => s._hydrated);
    if (!hasHydrated) return null;
    return <>{children}</>;
}

export default function App() {
    const loadMe = useAuthStore((s) => s.loadMe);
    const didInit = useRef(false);

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;
        const token = getAccess();
        if (!token || token === "null" || token === "undefined" || token.trim() === "") return;
        loadMe().catch(() => {});
    }, [loadMe]);

    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <AppGate>
                    <AppRoutes />
                    <Toaster />
                </AppGate>
            </ThemeProvider>
        </BrowserRouter>
    );
}
