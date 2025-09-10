import {
    Users, Timer, NotebookPen, MessageSquareText, Star, Crown, BookOpen,
    Calendar, Trophy, Zap, Target, Award, TrendingUp, Brain,
} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import useAuthStore from "@/store/auth/authStore";
import {cn} from "@/lib/utils.ts";

export default function UserProfilePage() {
    const {user} = useAuthStore();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="space-y-8 p-6 max-w-7xl mx-auto">
                {/* Enhanced Hero Section */}
                <Card className="overflow-hidden relative">
                    <div
                        className="h-40 w-full bg-gradient-to-r from-[oklch(var(--hero-from))] to-[oklch(var(--hero-to))] relative">
                        <div
                            className="bg-[url(https://images.unsplash.com/photo-1603486002664-a7319421e133?q=80&w=1242&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-center absolute inset-0 bg-black/20"/>
                    </div>
                    <div className="flex items-end gap-6 px-8 -mt-2 pb-6 relative z-10">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                            <AvatarImage src="https://i.pravatar.cc/160?img=8"/>
                            <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                                TP
                            </AvatarFallback>
                        </Avatar>
                        <div className="pb-2 flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-3xl font-bold">{user?.display_name || user?.email || "Chào bạn"}</h1>
                                <Badge className="bg-success/10 text-success border-success/20">
                                    <Zap className="w-3 h-3 mr-1"/>
                                    Active Learner
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="secondary" className="rounded-full px-4 py-1">
                                    <Crown className="mr-2 h-3 w-3 text-warning"/>
                                    Leader
                                </Badge>
                                <Badge variant="outline" className="rounded-full px-4 py-1">
                                    <Brain className="mr-2 h-3 w-3 text-info"/>
                                    Gen Z
                                </Badge>
                                <Badge variant="outline" className="rounded-full px-4 py-1">
                                    <Calendar className="mr-2 h-3 w-3"/>
                                    21 day streak
                                </Badge>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm">
                                Chỉnh sửa profile
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                                Chia sẻ profile
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    {[
                        {
                            label: "Tổng giờ học",
                            value: "126",
                            unit: "giờ",
                            icon: Timer,
                            color: "text-primary",
                            progress: 78,
                            target: "160h mục tiêu"
                        },
                        {
                            label: "Streak hiện tại",
                            value: "21",
                            unit: "ngày",
                            icon: Target,
                            color: "text-success",
                            progress: 70,
                            target: "30 ngày mục tiêu"
                        },
                        {
                            label: "Thành tích",
                            value: "8",
                            unit: "badges",
                            icon: Trophy,
                            color: "text-warning",
                            progress: 53,
                            target: "15 badges có thể đạt"
                        },
                        {
                            label: "Điểm kinh nghiệm",
                            value: "2,485",
                            unit: "XP",
                            icon: Star,
                            color: "text-info",
                            progress: 62,
                            target: "Level 4 - 4000 XP"
                        },
                    ].map((stat, i) => (
                        <Card key={i}
                              className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <stat.icon className={cn("h-5 w-5", stat.color)}/>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground opacity-60"/>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-3xl font-bold">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground">{stat.unit}</div>
                                    </div>
                                    <div>
                                        <div
                                            className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</div>
                                        <Progress value={stat.progress} className="h-2"/>
                                        <div className="text-xs text-muted-foreground mt-1">{stat.target}</div>
                                    </div>
                                </div>
                            </CardContent>
                            {/* Hover effect */}
                            <div
                                className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/30 to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"/>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enhanced Groups Section */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary"/>
                                    Nhóm đang tham gia
                                </CardTitle>
                                <Badge variant="secondary" className="rounded-full">
                                    3 nhóm hoạt động
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                {
                                    name: "CNPM x Team",
                                    topic: "Software Engineering",
                                    members: 24,
                                    activity: "92% tuần này",
                                    color: "from-blue-400 to-blue-600",
                                    bgColor: "bg-blue-50 dark:bg-blue-950/20",
                                    textColor: "text-blue-700 dark:text-blue-300"
                                },
                                {
                                    name: "IELTS 6.5+",
                                    topic: "English Learning",
                                    members: 38,
                                    activity: "88% tuần này",
                                    color: "from-violet-400 to-violet-600",
                                    bgColor: "bg-violet-50 dark:bg-violet-950/20",
                                    textColor: "text-violet-700 dark:text-violet-300"
                                },
                                {
                                    name: "Discrete Math",
                                    topic: "Mathematics",
                                    members: 22,
                                    activity: "76% tuần này",
                                    color: "from-emerald-400 to-emerald-600",
                                    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
                                    textColor: "text-emerald-700 dark:text-emerald-300"
                                },
                            ].map((group, i) => (
                                <Card key={i}
                                      className="overflow-hidden hover:shadow-md transition-all duration-300 border-0 shadow-sm">
                                    <div className={`h-1 bg-gradient-to-r ${group.color}`}/>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen className="h-3 w-3"/>
                                                        {group.topic}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3"/>
                                                        {group.members} thành viên
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={cn("mb-2", group.bgColor, group.textColor)}>
                                                    {group.activity}
                                                </Badge>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        Vào phòng
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Enhanced Achievements */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-warning"/>
                                Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {name: "Focus Master", icon: Timer, earned: true, color: "text-primary"},
                                    {name: "Team Helper", icon: Users, earned: true, color: "text-success"},
                                    {name: "Note Taker", icon: NotebookPen, earned: true, color: "text-info"},
                                    {
                                        name: "Discussion Leader",
                                        icon: MessageSquareText,
                                        earned: false,
                                        color: "text-muted-foreground"
                                    },
                                    {name: "Top Performer", icon: Star, earned: true, color: "text-warning"},
                                    {name: "Group Leader", icon: Crown, earned: true, color: "text-primary"},
                                ].map((badge, i) => (
                                    <div key={i} className={cn(
                                        "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-300",
                                        badge.earned
                                            ? "bg-gradient-to-br from-background to-muted/30 border-primary/20 hover:border-primary/40 shadow-sm"
                                            : "bg-muted/30 border-muted-foreground/20 opacity-60"
                                    )}>
                                        <badge.icon className={cn("h-6 w-6", badge.color)}/>
                                        <div className="text-xs font-medium">{badge.name}</div>
                                        {badge.earned && (
                                            <Badge variant="secondary" className="text-xs px-2 py-0">
                                                Đạt được
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Progress to next achievement */}
                            <div className="mt-6 p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="h-4 w-4 text-primary"/>
                                    <span className="text-sm font-medium">Tiến độ thành tích tiếp theo</span>
                                </div>
                                <div className="text-xs text-muted-foreground mb-2">Discussion Leader</div>
                                <Progress value={67} className="h-2"/>
                                <div className="text-xs text-muted-foreground mt-1">67/100 tin nhắn thảo luận</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}