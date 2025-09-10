import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import useAuthStore from "@/store/auth/authStore.ts";
import {
    Calendar, Clock, Users, BookOpen, Target, Zap,
    TrendingUp, PlayCircle, MessageSquare, FileText,
    Award, ChevronRight, Plus, Bell, Star
} from "lucide-react";
import {cn} from "@/lib/utils.ts";

export default function HomePage() {
    const {user} = useAuthStore();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <div className="space-y-8 p-6 max-w-7xl mx-auto">
                {/* Enhanced Welcome Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2 overflow-hidden relative bg-gradient-to-br from-primary/5 via-background to-primary/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-[100px]" />
                        <CardHeader className="pb-4 relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar className="h-16 w-16 border-2 border-primary/20">
                                    <AvatarImage src="https://i.pravatar.cc/120?img=5"/>
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                        {user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl mb-1">
                                        Chào mừng trở lại, {user?.display_name || user?.email?.split('@')[0] || 'Học viên'}! 👋
                                    </CardTitle>
                                    <p className="text-muted-foreground">
                                        "Small progress is still progress."
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Badge className="bg-success/10 text-success border-success/20 px-3 py-1">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Streak 7 ngày
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1">
                                    <Target className="w-3 h-3 mr-1" />
                                    84% mục tiêu tuần
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1">
                                    <Award className="w-3 h-3 mr-1" />
                                    Level 3
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center gap-4">
                                <Button className="bg-gradient-to-r from-primary to-primary/80 flex items-center gap-2">
                                    <PlayCircle className="w-4 h-4" />
                                    Bắt đầu học ngay
                                </Button>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Xem lịch hôm nay
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enhanced Streak Card */}
                    <Card className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5" />
                        <CardHeader className="pb-3 relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-success">
                                    <Zap className="h-5 w-5" />
                                    Streak
                                </CardTitle>
                                <Badge className="bg-success/20 text-success border-success/30">
                                    🔥 Hot streak!
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-baseline gap-2 mb-4">
                                <div className="text-4xl font-bold text-success">7</div>
                                <div className="text-sm text-muted-foreground">ngày liên tục</div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex gap-1">
                                    {[...Array(7)].map((_, i) => (
                                        <div key={i} className="h-2 flex-1 rounded-full bg-gradient-to-r from-success to-success/80"/>
                                    ))}
                                </div>
                                <div className="text-xs text-muted-foreground text-center">
                                    Mục tiêu: 30 ngày 🎯
                                </div>
                            </div>
                            <Progress value={(7/30) * 100} className="h-2" />
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {title: "Giờ học hôm nay", value: "2.5h", target: "/8h", icon: Clock, color: "text-primary"},
                        {title: "Phiên hoàn thành", value: "3", target: "/5", icon: Target, color: "text-success"},
                        {title: "Flashcards ôn tập", value: "24", target: "/50", icon: BookOpen, color: "text-info"},
                        {title: "Tin nhắn thảo luận", value: "12", target: "", icon: MessageSquare, color: "text-warning"},
                    ].map((stat, i) => (
                        <Card key={i} className="hover:shadow-md transition-all duration-300 group">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                                    <TrendingUp className="h-3 w-3 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <div className="text-xl font-bold">{stat.value}</div>
                                    {stat.target && <div className="text-sm text-muted-foreground">{stat.target}</div>}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">{stat.title}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enhanced Schedule */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Lịch hôm nay
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                        3 phiên đã lên lịch
                                    </Badge>
                                    <Button size="sm" variant="outline" className="h-8">
                                        <Plus className="w-3 h-3 mr-1" />
                                        Thêm
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                {
                                    time: "08:00 - 10:00",
                                    title: "Toán rời rạc",
                                    room: "Room A",
                                    type: "Học nhóm",
                                    status: "upcoming",
                                    participants: 8,
                                    color: "border-l-blue-400"
                                },
                                {
                                    time: "13:30 - 15:00",
                                    title: "CNPM review",
                                    room: "Room Study Party",
                                    type: "Thảo luận",
                                    status: "active",
                                    participants: 12,
                                    color: "border-l-success"
                                },
                                {
                                    time: "20:00 - 21:00",
                                    title: "Flashcard tiếng Anh",
                                    room: "Solo",
                                    type: "Tự học",
                                    status: "upcoming",
                                    participants: 1,
                                    color: "border-l-warning"
                                },
                            ].map((event, idx) => (
                                <Card key={idx} className={cn("border-l-4 hover:shadow-md transition-all duration-300", event.color)}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold">{event.title}</h3>
                                                    <Badge
                                                        className={cn(
                                                            "text-xs px-2 py-0.5",
                                                            event.status === "active"
                                                                ? "bg-success/10 text-success border-success/20"
                                                                : "bg-muted text-muted-foreground"
                                                        )}
                                                    >
                                                        {event.status === "active" ? "Đang diễn ra" : event.type}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {event.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {event.participants} người
                                                    </span>
                                                    <span>{event.room}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {event.status === "active" ? (
                                                    <Button size="sm" className="bg-success hover:bg-success/90">
                                                        Tham gia ngay
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="outline">
                                                        Xem chi tiết
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Enhanced Progress */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                Tiến độ tuần
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Overall Progress */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Tổng thời gian</span>
                                    <span className="font-medium">10/12 giờ</span>
                                </div>
                                <Progress value={84} className="h-3" />
                                <p className="text-xs text-muted-foreground mt-1">84% mục tiêu tuần này</p>
                            </div>

                            {/* Detailed Breakdown */}
                            <div className="space-y-4">
                                {[
                                    {label: "Focus phiên", current: 18, target: 25, color: "bg-primary"},
                                    {label: "Tài liệu chia sẻ", current: 5, target: 8, color: "bg-success"},
                                    {label: "Thảo luận tích cực", current: 12, target: 15, color: "bg-info"},
                                    {label: "Flashcards hoàn thành", current: 120, target: 150, color: "bg-warning"},
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>{item.label}</span>
                                            <span className="font-medium">{item.current}/{item.target}</span>
                                        </div>
                                        <Progress
                                            value={(item.current / item.target) * 100}
                                            className="h-2"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Achievement Progress */}
                            <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Thành tích sắp đạt</span>
                                </div>
                                <div className="text-xs text-muted-foreground mb-2">Study Marathoner</div>
                                <Progress value={78} className="h-2" />
                                <div className="text-xs text-muted-foreground mt-1">78/100 giờ học liên tục</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Enhanced Groups Section */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Nhóm học tập
                            </CardTitle>
                            <div className="flex gap-3">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                    4 nhóm hoạt động
                                </Badge>
                                <Button size="sm" variant="outline" className="flex items-center gap-1">
                                    <Plus className="w-3 h-3" />
                                    Tạo nhóm mới
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[
                                {
                                    name: "CNPM x Team",
                                    topic: "Software Engineering",
                                    members: 24,
                                    online: 8,
                                    owner: "Tuấn Anh",
                                    activity: "Rất tích cực",
                                    lastActivity: "2 phút trước",
                                    progress: 92,
                                    color: "from-blue-400 to-blue-600"
                                },
                                {
                                    name: "IELTS 6.5+",
                                    topic: "English Learning",
                                    members: 38,
                                    online: 15,
                                    owner: "Minh Thu",
                                    activity: "Tích cực",
                                    lastActivity: "5 phút trước",
                                    progress: 88,
                                    color: "from-violet-400 to-violet-600"
                                },
                                {
                                    name: "Discrete Math",
                                    topic: "Mathematics",
                                    members: 22,
                                    online: 5,
                                    owner: "Hoàng Nam",
                                    activity: "Bình thường",
                                    lastActivity: "1 giờ trước",
                                    progress: 76,
                                    color: "from-emerald-400 to-emerald-600"
                                },
                                {
                                    name: "DSA Night Owls",
                                    topic: "Algorithms",
                                    members: 15,
                                    online: 0,
                                    owner: "Quý Đạt",
                                    activity: "Yên lặng",
                                    lastActivity: "3 giờ trước",
                                    progress: 45,
                                    color: "from-orange-400 to-orange-600"
                                },
                            ].map((group, i) => (
                                <Card key={i} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-0 shadow-md">
                                    <div className={`h-1 bg-gradient-to-r ${group.color}`} />
                                    <CardHeader className="py-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-2xl text-primary mb-1 group-hover:text-info transition-colors">
                                                    {group.name}
                                                </h3>
                                                <div className="flex items-center gap-2 my-2">
                                                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                                        {group.topic}
                                                    </Badge>
                                                    <Badge
                                                        className={cn(
                                                            "text-xs px-2 py-0.5",
                                                            group.online > 0
                                                                ? "bg-success/10 text-success border-success/20"
                                                                : "bg-muted text-muted-foreground"
                                                        )}
                                                    >
                                                        {group.online > 0 ? `${group.online} đang online` : "Offline"}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm mt-4 text-muted-foreground space-y-1">
                                                    <div className="ml-1 flex items-center gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {group.members} thành viên
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {group.lastActivity}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs mt-4 ">
                                                        Chủ phòng: {group.owner} • {group.activity}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-muted-foreground mb-1">
                                                    Hoạt động: {group.progress}%
                                                </div>
                                                <Progress value={group.progress} className="w-16 h-1.5 mb-2" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className={cn(
                                                    "flex-1",
                                                    group.online > 0
                                                        ? "bg-success hover:bg-success/90 text-white"
                                                        : ""
                                                )}
                                                variant={group.online > 0 ? "default" : "outline"}
                                            >
                                                {group.online > 0 ? "Tham gia ngay" : "Vào phòng"}
                                            </Button>
                                            <Button size="sm" variant="ghost" className="px-2">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Star className="h-4 w-4 text-primary" />
                                Hành động nhanh
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    {label: "Tạo phòng học", icon: Plus, color: "text-primary"},
                                    {label: "Tìm nhóm", icon: Users, color: "text-success"},
                                    {label: "Chia sẻ tài liệu", icon: FileText, color: "text-info"},
                                    {label: "Thông báo", icon: Bell, color: "text-warning"},
                                ].map((action, i) => (
                                    <Button key={i} variant="outline" className="h-auto p-3 flex-col gap-2 hover:bg-background">
                                        <action.icon className={cn("h-5 w-5", action.color)} />
                                        <span className="text-xs">{action.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}