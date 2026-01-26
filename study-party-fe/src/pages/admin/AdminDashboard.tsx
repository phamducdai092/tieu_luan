import {useEffect, useState} from 'react';
import {adminService} from '@/services/admin.service';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Users, Group, UserPlus, Activity, File} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import AvatarDisplay from "@/components/shared/AvatarDisplay";
import {Badge} from "@/components/ui/badge";
import {usePresenceStore} from '@/store/presence.store';
import type {AdminDashboardResponse, AdminUsersResponse} from "@/types/admin/admin.type.ts";

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminDashboardResponse>({
        totalUsers: 0,
        totalGroups: 0,
        totalFiles: 0,
        newUsersToday: 0,
        newGroupsToday: 0
    });
    const [recentUsers, setRecentUsers] = useState<AdminUsersResponse[]>([]);

    // 👇 Lấy danh sách người đang online từ Socket Store
    const {onlineUserIds} = usePresenceStore();

    useEffect(() => {
        // 1. Load Stats tổng quan
        adminService.getDashboardStats().then(setStats).catch(console.error);

        // 2. Load 5 User mới nhất
        adminService.getUsers({page: 0, size: 5, sortBy: 'id', order: 'desc'})
            .then(res => setRecentUsers(res.data))
            .catch(console.error);
    }, []);

    // --- FAKE DATA BIỂU ĐỒ (Giữ nguyên để đẹp báo cáo) ---
    const chartData = [
        {name: 'T2', users: 4, groups: 2},
        {name: 'T3', users: 7, groups: 5},
        {name: 'T4', users: 5, groups: 8},
        {name: 'T5', users: 12, groups: 10},
        {name: 'T6', users: 18, groups: 15},
        {name: 'T7', users: 25, groups: 20},
        {name: 'CN', users: 30, groups: 28},
    ];

    const StatCard = ({title, value, icon: Icon, color, subtext}: any) => (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className={`p-2 rounded-full bg-slate-100 ${color}`}>
                    <Icon className="h-4 w-4"/>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Tổng quan hoạt động của hệ thống Study Party.</p>
            </div>

            {/* 1. Các thẻ số liệu (Cards) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Tổng Thành viên"
                    value={stats.totalUsers}
                    icon={Users}
                    color="text-blue-600"
                    subtext="+12% so với tháng trước"
                />
                <StatCard
                    title="Nhóm học tập"
                    value={stats.totalGroups}
                    icon={Group}
                    color="text-purple-600"
                    subtext="Đang hoạt động sôi nổi"
                />
                <StatCard
                    title="Tổng file"
                    value={stats.totalFiles}
                    icon={File}
                    color="text-purple-600"
                    subtext="Đang hoạt động sôi nổi"
                />
                <StatCard
                    title="Thành viên mới (Hôm nay)"
                    value={stats.newUsersToday}
                    icon={UserPlus}
                    color="text-green-600"
                    subtext="Tăng trưởng tốt"
                />

                <StatCard
                    title="Nhóm mới (Hôm nay)"
                    value={stats.newGroupsToday}
                    icon={Users}
                    color="text-green-600"
                    subtext="Tăng trưởng tốt"
                />

                <StatCard
                    title="Đang truy cập"
                    value={onlineUserIds.size}
                    icon={Activity}
                    color="text-orange-600"
                    subtext="Realtime (Socket)"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* 2. Biểu đồ (Chiếm 4 phần) */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Biểu đồ tăng trưởng (7 ngày)</CardTitle>
                        <CardDescription>Số lượng thành viên và nhóm mới được tạo.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorGroups" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false}
                                           axisLine={false}/>
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}
                                           tickFormatter={(value) => `${value}`}/>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                    <Tooltip/>
                                    <Area type="monotone" dataKey="users" stroke="#2563eb" fillOpacity={1}
                                          fill="url(#colorUsers)" name="Thành viên"/>
                                    <Area type="monotone" dataKey="groups" stroke="#7c3aed" fillOpacity={1}
                                          fill="url(#colorGroups)" name="Nhóm"/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Danh sách thành viên mới (Chiếm 3 phần) */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Thành viên mới gia nhập</CardTitle>
                        <CardDescription>
                            5 thành viên đăng ký gần nhất.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-0">
                            {recentUsers.length > 0 ? recentUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    className={`flex items-center justify-between py-3 ${index !== recentUsers.length - 1 ? 'border-b border-slate-100' : ''}`}
                                >
                                    {/* Cụm bên trái: Avatar + Info */}
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <AvatarDisplay
                                            src={user.avatarUrl}
                                            fallback={user.displayName?.charAt(0)}
                                            size={40}
                                            userId={user.id}
                                            showStatus={true}
                                            className="shrink-0 border border-slate-200"
                                        />
                                        <div
                                            className="flex flex-col text-left min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {user.displayName}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[140px]"
                                               title={user.email}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Cụm bên phải: Badge */}
                                    <div className="shrink-0 pl-2">
                                        <Badge
                                            variant="secondary"
                                            className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${
                                                user.role === 'ADMIN'
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                        >
                                            {user.role}
                                        </Badge>
                                    </div>
                                </div>
                            )) : (
                                <div
                                    className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                    <Users className="h-8 w-8 mb-2 opacity-20"/>
                                    <p className="text-sm">Chưa có thành viên mới...</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}