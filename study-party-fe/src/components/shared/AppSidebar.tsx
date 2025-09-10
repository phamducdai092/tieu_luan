// src/components/shared/AppSidebar.tsx
import {NavLink, useLocation} from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {Home, User, School, BookOpen, Files, Settings} from "lucide-react";

// NOTE: KHÔNG import HomePage/UserProfile/StudyRoom ở đây nữa!

const items = [
    {to: "/", label: "Home", icon: Home},
    {to: "/me", label: "Profile", icon: User},
    {to: "/rooms", label: "Phòng học", icon: School, disabled: true},
    {to: "/flashcard", label: "Flashcard", icon: BookOpen, disabled: true},
    {to: "/docs", label: "Tài liệu", icon: Files, disabled: true},
    {to: "/settings", label: "Settings", icon: Settings, disabled: true},
];

export default function AppSidebar() {
    const {pathname} = useLocation();
    const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

    return (
        <Sidebar
            collapsible="icon"
            className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
        >
            <SidebarHeader className="border-b-2 p-4">
                <span className="sidebar-title font-semibold ">Study Party</span>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                <SidebarGroupLabel className="px-3 text-xs uppercase tracking-wide text-muted-foreground">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((i) => (
                                <SidebarMenuItem key={i.to}>
                                    <SidebarMenuButton
                                        asChild
                                        disabled={i.disabled}
                                        isActive={isActive(i.to)}
                                        className="px-3"
                                    >
                                        <NavLink to={i.to} className="flex items-center gap-2 min-w-0">
                                            <i.icon className="h-5 w-5 shrink-0"/>
                                            <span className="truncate">{i.label}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
