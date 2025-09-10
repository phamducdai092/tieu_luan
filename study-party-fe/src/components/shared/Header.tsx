import {Link, useNavigate} from "react-router-dom";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {ModeToggle} from "@/components/features/mode-toggle";
import {Bell, Plus, Search, Home, User, School, BookOpen, Files, Settings, LogOut, Shield} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/store/auth/authStore";

const NAV_ITEMS = [
    {to: "/", label: "Home", icon: Home},
    {to: "/me", label: "Profile", icon: User},
    {to: "/rooms", label: "Phòng học", icon: School, disabled: true},
    {to: "/flashcard", label: "Flashcard", icon: BookOpen, disabled: true},
    {to: "/docs", label: "Tài liệu", icon: Files, disabled: true},
    {to: "/settings", label: "Settings", icon: Settings, disabled: true},
];

export default function Header() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

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
                <ModeToggle/>

                <div className="relative hidden w-full items-center md:flex">
                    <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"/>
                    <Input className="pl-9" placeholder="Tìm nhóm, phòng học, tài liệu…"/>
                </div>
                <Button variant="ghost" size="icon" className="md:hidden ms-auto" type="button">
                    <Search className="h-5 w-5"/>
                </Button>

                {user ? (
                    <div className="ms-auto flex items-center gap-2">
                        <Button size="sm" className="gap-2" type="button">
                            <Plus className="h-4 w-4"/> Tạo phòng học
                        </Button>

                        <Button size="icon" variant="ghost" className="relative" aria-label="Thông báo" type="button">
                            <Bell className="h-5 w-5"/>
                            <span className="absolute right-1 top-1 inline-block h-2 w-2 rounded-full bg-destructive"/>
                        </Button>

                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full p-0" type="button">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar_url ?? "https://i.pravatar.cc/120?img=5"}/>
                                        <AvatarFallback>{user?.display_name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                sideOffset={8}
                                onCloseAutoFocus={(e) => e.preventDefault()}
                                collisionPadding={8}
                                className="w-48 px-2"
                            >
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        <span className="font-medium truncate">{user.display_name ?? "User"}</span>
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
                                        /* tránh “select” làm cuộn nếu item disabled */
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
