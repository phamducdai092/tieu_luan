import {Outlet, Link, useLocation} from 'react-router-dom';
import {LayoutDashboard, Users, Group, LogOut, File} from 'lucide-react';
import {cn} from '@/lib/utils';

export default function AdminLayout() {
    const location = useLocation();

    // Menu Item Component cho gọn
    const MenuItem = ({to, icon: Icon, label}: any) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-slate-600 hover:bg-slate-100"
                )}
            >
                <Icon className="w-5 h-5"/>
                <span className="font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar tĩnh đơn giản */}
            <aside className="w-64 bg-white border-r shadow-sm flex flex-col fixed inset-y-0 z-50">
                <div className="p-6 border-b flex items-center gap-2">
                    <div
                        className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">A
                    </div>
                    <span className="text-xl font-bold text-slate-800">Admin Portal</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <MenuItem to="/admin/dashboard" icon={LayoutDashboard} label="Tổng quan"/>
                    <MenuItem to="/admin/users" icon={Users} label="Quản lý người dùng"/>
                    <MenuItem to="/admin/groups" icon={Group} label="Quản lý Nhóm"/>
                    <MenuItem to="/admin/files" icon={File} label="Quản lý Tài liệu"/>
                </nav>

                <div className="p-4 border-t">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
                        <LogOut className="w-5 h-5"/>
                        <span>Về trang chủ</span>
                    </Link>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <Outlet/>
            </main>
        </div>
    );
}