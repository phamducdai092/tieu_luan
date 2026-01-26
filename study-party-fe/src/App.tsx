import "./App.css";
import {BrowserRouter, useRoutes} from "react-router-dom";
import {routes} from "./routes/routes";
import {ThemeProvider} from "./components/theme/theme-provider";
import {Toaster} from "./components/ui/sonner";
import useAuthStore from "./store/auth.store";
import React, {useEffect, useRef} from "react";
import ScrollToTop from "@/components/common/ScrollToTop";
import BackToTop from "@/components/common/BackToTop";
import {runBootstrap} from "@/bootstrap/bootstrap.ts";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {GlobalSocketProvider} from "@/context/GlobalSocketContext.tsx";
import {PresenceListener} from "@/components/features/listeners/PresenceListener.tsx";

function AppRoutes() {
    return useRoutes(routes);
}

function AppGate({children}: { children: React.ReactNode }) {
    const hasHydrated = useAuthStore((s) => s._hydrated);
    if (!hasHydrated) return null;
    return <>{children}</>;
}

export default function App() {
    const didInit = useRef(false);
    const queryClient = new QueryClient();

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;

        // Chạy toàn bộ bootstrap (auth + enums + …)
        runBootstrap().catch(() => {
            // an toàn: không crash app nếu 1 nhánh bootstrap fail
        });
    }, []);

    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <QueryClientProvider client={queryClient}>
                    <AppGate>
                        <GlobalSocketProvider>
                            <ScrollToTop/>
                            <AppRoutes/>
                            <Toaster/>
                            <BackToTop/>
                            <PresenceListener/>
                        </GlobalSocketProvider>
                    </AppGate>
                </QueryClientProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}
