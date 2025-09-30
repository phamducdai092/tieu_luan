// import {useLocation} from "react-router-dom";
import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import {
    Home,
    BookOpen,
    Command,
    Bot,
    Settings2,
    LifeBuoy, Send, Frame, PieChart, Map
} from "lucide-react";
import {NavMain} from "@/components/common/sidebar/nav-main.tsx";
import {NavProjects} from "@/components/common/sidebar/nav-projects.tsx";
import {NavSecondary} from "@/components/common/sidebar/nav-secondary.tsx";
import {NavUser} from "@/components/common/sidebar/nav-user.tsx";
import useAuthStore from "@/store/auth.store.ts";


// const settingItems = [
//     {to: "/settings", label: "Hồ sơ", end: true},
//     {to: "/settings/account", label: "Tài khoản"},
//     {to: "/settings/security", label: "Bảo mật"},
//     {to: "/settings/notifications", label: "Thông báo"},
//     {to: "/settings/privacy", label: "Riêng tư"},
//     {to: "/settings/connections", label: "Kết nối"},
//     {to: "/settings/appearance", label: "Giao diện"},
// ];

const data = {
    navMain: [
        {
            // const items = [
            //     {to: "/", label: "Home", icon: Home},
            //     {to: "/me", label: "Profile", icon: User},
            //     {to: "/rooms", label: "Phòng học", icon: School, disabled: true},
            //     {to: "/flashcard", label: "Flashcard", icon: BookOpen, disabled: true},
            //     {to: "/docs", label: "Tài liệu", icon: Files, disabled: true},
            //     {to: "/settings", label: "Settings", icon: Settings, disabled: true},
            // ];
            title: "Các trang chính",
            url: "#",
            icon: Home,
            isActive: true,
            items: [
                {
                    title: "Trang chủ",
                    url: "/",
                },
                {
                    title: "Trang cá nhân",
                    url: "/me",
                },
                {
                    title: "Phòng học",
                    url: "/rooms",
                },
                {
                    title: "Flashcards",
                    url: "/flashcard",
                },
                {
                    title: "Tài liệu",
                    url: "/docs",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export default function AppSidebar() {
    // const {pathname} = useLocation();
    // const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));
    const {user} = useAuthStore();
    return (
        <Sidebar
            collapsible="icon"
            className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
        >
            <SidebarHeader className="">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div
                                    className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4"/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Study party</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={data.navMain}/>
                <NavProjects projects={data.projects}/>
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser name={user!.displayName} email={user!.email} avatar={user!.avatarUrl}/>
            </SidebarFooter>
        </Sidebar>
    );
}
