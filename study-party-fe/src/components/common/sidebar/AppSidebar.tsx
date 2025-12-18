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
    Settings2,
    LifeBuoy, Send, Frame, PieChart, Map, User, School, Files
} from "lucide-react";
import {NavMain} from "@/components/common/sidebar/nav-main.tsx";
import {NavUser} from "@/components/common/sidebar/nav-user.tsx";
import useAuthStore from "@/store/auth.store.ts";
import {NavLink} from "react-router-dom";

const data = {
    navMain: [
        {
            title: "Trang chủ",
            url: "/",
            icon: Home,
        },
        {
            title: "Trang cá nhân",
            url: "/me",
            icon: User,
            match: "/me/*"
        },
        {
            title: "Phòng học",
            url: "/rooms",
            icon: School,
            match: "/rooms/*"
        },
        {
            title: "FlashCards",
            url: "/flashcard",
            icon: BookOpen,
            match: "/flashcard/*"
        },
        {
            title: "Tài liêu",
            url: "/docs",
            icon: Files,
            match: "/docs/*"
        },
        {
            title: "Cài đặt",
            url: "/settings",
            icon: Settings2,
            match: "/settings/*",
            items: [
                {
                    title: "Thông báo",
                    url: "/settings/notifications",
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
                            <NavLink to="/">
                                <div
                                    className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4"/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Study party</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={data.navMain}/>
                {/*<NavProjects projects={data.projects}/>*/}
                {/*<NavSecondary items={data.navSecondary} className="mt-auto"/>*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser name={user?.displayName} email={user?.email} avatar={user?.avatarUrl}/>
            </SidebarFooter>
        </Sidebar>
    );
}
