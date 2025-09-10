import {Outlet} from "react-router-dom";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/AppSidebar";
import Header from "@/components/shared/Header.tsx";


export default function MainLayout() {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
                {/* Header (chuyển từ Sidebar cũ sang đây để giữ UI) */}
                <Header/>
                {/* Content */}
                <main className="min-w-0">
                    <Outlet/>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
