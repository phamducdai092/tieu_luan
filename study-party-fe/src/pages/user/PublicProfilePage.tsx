import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
    Users, Timer, Star, Zap, Award, Brain, Mail, Phone, Cake, NotebookPen, Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import AvatarDisplay from "@/components/shared/AvatarDisplay.tsx";
import { cn } from "@/lib/utils.ts";
import { getUserProfile } from "@/services/user.service.ts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner"; // Thêm toast
import { useGroupStore } from "@/store/group.store"; // Import store
import { InviteToGroupDialog } from "@/components/features/group/InviteToGroupDialog"; // Import Dialog mới

export default function PublicProfilePage() {
    const { userId } = useParams();
    const navigate = useNavigate();

    // --- STATE CHO DIALOG MỜI ---
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    // Lấy danh sách nhóm sở hữu từ Store để check số lượng
    const userRoomsOwned = useGroupStore((state) => state.userRoomsOwned);

    // 1. Fetch User Data
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['public-profile', userId],
        queryFn: () => getUserProfile(Number(userId)),
        enabled: !!userId,
        retry: 1
    });

    const userData = user;

    // --- HÀM XỬ LÝ CLICK NÚT MỜI ---
    const handleInviteClick = () => {
        // Kiểm tra xem user hiện tại có sở hữu nhóm nào không
        if (!userRoomsOwned || userRoomsOwned.length === 0) {
            toast.warning("Bạn chưa tạo nhóm học tập nào.", {
                description: "Hãy tạo một nhóm mới để có thể mời bạn bè tham gia.",
                action: {
                    label: "Tạo nhóm",
                    onClick: () => navigate("/") // Hoặc link tới chỗ tạo nhóm
                }
            });
            return;
        }

        // Nếu có nhóm thì mở Dialog
        setIsInviteDialogOpen(true);
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy người dùng</h2>
                <Button onClick={() => navigate(-1)}>Quay lại</Button>
            </div>
        );
    }

    if (isLoading) {
        return <PublicProfileSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="space-y-8 p-6 max-w-7xl mx-auto">

                {/* --- HERO SECTION --- */}
                <Card className="overflow-hidden relative shadow-md border-0">
                    <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-purple-500 relative">
                        {userData?.bannerUrl && (
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-black/10"
                                style={{ backgroundImage: `url(${userData.bannerUrl})` }}
                            />
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-end gap-6 px-8 -mt-10 pb-6 relative z-10">
                        <div className="relative">
                            <div className="rounded-full p-1 bg-white shadow-xl">
                                <AvatarDisplay
                                    src={userData?.avatarUrl}
                                    fallback={userData?.displayName}
                                    size={140}
                                />
                            </div>
                        </div>

                        <div className="pb-2 flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-2 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{userData?.displayName}</h1>
                                {userData?.bio && (
                                    <span className="text-muted-foreground text-sm italic mb-1 max-w-md truncate">
                                        "{userData.bio}"
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                                    <Zap className="w-3 h-3 mr-1" /> Active Learner
                                </Badge>
                                <Badge variant="outline" className="rounded-full">
                                    <Brain className="mr-2 h-3 w-3 text-purple-500" /> Gen Z
                                </Badge>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-2">
                            {/* 👇 GẮN HÀM CLICK VÀO ĐÂY */}
                            <Button
                                className="bg-primary hover:bg-primary/90 shadow-md"
                                onClick={handleInviteClick}
                            >
                                Mời vào nhóm
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ... (Phần nội dung còn lại giữ nguyên như file cũ) ... */}

                    {/* Cột trái */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="h-5 w-5 text-primary" />
                                    Thông tin cá nhân
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium truncate" title={userData?.email}>
                                            {userData?.email}
                                        </p>
                                    </div>
                                </div>

                                {userData?.phoneNumber && (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-full">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Số điện thoại</p>
                                            <p className="text-sm font-medium">{userData.phoneNumber}</p>
                                        </div>
                                    </div>
                                )}

                                {userData?.dateOfBirth && (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                        <div className="p-2 bg-pink-100 text-pink-600 rounded-full">
                                            <Cake className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Sinh nhật</p>
                                            <p className="text-sm font-medium">
                                                {format(new Date(userData.dateOfBirth), 'dd MMMM yyyy', { locale: vi })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t">
                                    <p className="text-sm font-medium mb-2">Giới thiệu:</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {userData?.bio || "Người dùng này chưa cập nhật giới thiệu."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cột phải */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: "Streak", value: "12 ngày", icon: Target, color: "text-red-500", progress: 40 },
                                { label: "Tổng giờ học", value: "48h", icon: Timer, color: "text-blue-500", progress: 65 },
                            ].map((stat, i) => (
                                <Card key={i} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                            <p className="text-2xl font-bold">{stat.value}</p>
                                        </div>
                                        <div className={cn("p-3 rounded-full bg-opacity-10", stat.color.replace('text-', 'bg-'))}>
                                            <stat.icon className={cn("h-6 w-6", stat.color)} />
                                        </div>
                                    </CardContent>
                                    <div className="px-4 pb-4">
                                        <Progress value={stat.progress} className="h-1.5" />
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-warning" />
                                    Bộ sưu tập huy hiệu
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { name: "Focus Master", icon: Timer, earned: true, color: "text-primary" },
                                        { name: "Team Helper", icon: Users, earned: true, color: "text-success" },
                                        { name: "Top Performer", icon: Star, earned: true, color: "text-warning" },
                                        { name: "Note Taker", icon: NotebookPen, earned: false, color: "text-muted-foreground" },
                                    ].map((badge, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "group relative aspect-square w-24 flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all",
                                                badge.earned
                                                    ? "bg-gradient-to-br from-background to-muted/30 border-primary/20"
                                                    : "bg-muted/30 border-dashed border-muted-foreground/20 opacity-60"
                                            )}
                                        >
                                            <badge.icon className={cn("h-6 w-6 mb-2", badge.color)} />
                                            <span className="text-[10px] text-center font-medium leading-tight">
                                                {badge.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {userData && (
                <InviteToGroupDialog
                    isOpen={isInviteDialogOpen}
                    onOpenChange={setIsInviteDialogOpen}
                    inviteeEmail={userData.email}
                    inviteeName={userData.displayName}
                />
            )}
        </div>
    );
}

// Skeleton Loading Component (Giữ nguyên)
function PublicProfileSkeleton() {
    return (
        <div className="min-h-screen bg-muted/20 p-6 space-y-8 max-w-7xl mx-auto">
            <div className="relative">
                <Skeleton className="h-48 w-full rounded-xl" />
                <div className="absolute -bottom-10 left-8 flex items-end gap-6">
                    <Skeleton className="h-32 w-32 rounded-full border-4 border-white" />
                    <div className="space-y-2 mb-4">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </div>
            </div>
            <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="h-80 w-full rounded-xl" />
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}