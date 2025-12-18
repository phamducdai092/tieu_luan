import {Outlet} from "react-router-dom";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/common/sidebar/AppSidebar.tsx";
import Header from "@/components/common/Header.tsx";
import {NotificationListener} from "@/components/features/notification/NotificationListener.tsx";
import {useSidebarStore} from "@/store/sidebar.store.ts";

export default function MainLayout() {
    const { isOpen, setOpen } = useSidebarStore();
    return (
        <SidebarProvider
            open={isOpen}
            onOpenChange={setOpen}
        >
            <AppSidebar/>
            <SidebarInset className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
                <NotificationListener />
                {/* Header (chuyển từ Sidebar cũ sang đây để giữ UI) */}
                <Header />
                {/* Content */}
                <main className="min-w-0">
                    <Outlet/>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
