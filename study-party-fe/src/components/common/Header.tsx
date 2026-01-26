import {Link, useNavigate} from "react-router-dom";
import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {ToggleMode} from "@/components/features/ToggleMode.tsx";
import {Bell, Search, Home, User, School, LogOut, Shield} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx";
import useAuthStore from "@/store/auth.store.ts";
import AvatarDisplay from "@/components/shared/AvatarDisplay.tsx";

import type {EnumItem} from "@/types/enum.type.ts";
import {useEnumStore} from "@/store/enum.store.ts";
import CreateRoomDialog from "@/components/features/group/CreateRoomDialog.tsx";

const NAV_ITEMS = [
    {to: "/", label: "Home", icon: Home, disabled: false},
    {to: "/me", label: "Profile", icon: User, disabled: false},
    {to: "/rooms", label: "Phòng học", icon: School, disabled: false},
    {to: "/notifications", label: "Settings", icon: Bell, disabled: false},
];

export default function Header() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    const groupEnum: EnumItem[] = useEnumStore().get("GroupTopic");

    const handleLogout = () => {
        try {
            logout?.();
        } finally {
            navigate("/", {replace: true});
        }
    };

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4">
                <SidebarTrigger className="shrink-0"/>
                <ToggleMode/>

                <div className="relative hidden w-full items-center md:flex">
                    <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"/>
                    <Input className="pl-9" placeholder="Tìm nhóm, phòng học, tài liệu…"/>
                </div>
                <Button variant="ghost" size="icon" className="md:hidden ms-auto" type="button">
                    <Search className="h-5 w-5"/>
                </Button>

                {user ? (
                    <div className="ms-auto flex items-center gap-2">
                        <CreateRoomDialog groupTopics={groupEnum}/>

                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full p-0" type="button">
                                    <AvatarDisplay src={user!.avatarUrl}
                                                   fallback={user!.displayName}
                                                   alt={user!.displayName}
                                                   size={46}
                                                   userId={user!.id}
                                                   showStatus={true}
                                    />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                sideOffset={8}
                                onCloseAutoFocus={(e) => e.preventDefault()}
                                collisionPadding={8}
                                className="w-48 px-2 z-30"
                            >
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        <span className="font-medium truncate">{user.displayName ?? "User"}</span>
                                        <span
                                            className="text-xs text-muted-foreground truncate">{user.email ?? ""}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>

                                {NAV_ITEMS.map((i) => (
                                    <DropdownMenuItem
                                        key={i.to}
                                        asChild
                                        disabled={i.disabled}
                                        className="cursor-pointer py-2 w-full"
                                        onSelect={(e) => i.disabled && e.preventDefault()}
                                    >
                                        <Link to={i.to} className="flex items-center gap-2">
                                            <i.icon className="h-4 w-4"/>
                                            <span>{i.label}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}

                                {user.role === "ADMIN" && (
                                    <>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem asChild>
                                            <Link to="/admin" className="flex items-center gap-2">
                                                <Shield className="h-4 w-4"/>
                                                <span>Admin</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}

                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <LogOut className="text-destructive mr-2 h-4 w-4"/>
                                    Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="ms-auto flex items-center gap-2">
                        <Button size="sm" variant="secondary" asChild>
                            <Link to="/login">Đăng nhập</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link to="/register">Đăng ký</Link>
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
