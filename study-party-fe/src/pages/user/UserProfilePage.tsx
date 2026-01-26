import {
    Users, Timer, NotebookPen, MessageSquareText, Star, Crown,
    Calendar, Trophy, Zap, Target, Award, TrendingUp, Brain, Info, ChevronRight,
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import useAuthStore from "@/store/auth.store.ts";
import {cn} from "@/lib/utils.ts";
import RoomCard from "@/components/features/group/RoomCard.tsx";
import {UserInfoDialog} from "@/components/features/user/UserProfileDialog.tsx";
import AvatarDisplay from "@/components/shared/AvatarDisplay.tsx";
import {useNavigate} from "react-router-dom";
import type {Room} from "@/types/group/group.type.ts";
import {useGroupStore} from "@/store/group.store.ts";
import type {EnumItem} from "@/types/enum.type.ts";
import {useEnumStore} from "@/store/enum.store.ts";
import {getEnumItem} from "@/utils/enumItemExtract.ts";

export default function UserProfilePage() {
    const nav = useNavigate();

    const {user} = useAuthStore();
    const myRooms: Room[] = useGroupStore(state => state.userRoomsJoined);
    const groupEnum: EnumItem[] = useEnumStore().get("GroupTopic");

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="space-y-8 p-6 max-w-7xl mx-auto">
                {/* Enhanced Hero Section */}
                <Card className="overflow-hidden relative">
                    <div
                        className="h-40 w-full bg-gradient-to-r from-[oklch(var(--hero-from))] to-[oklch(var(--hero-to))] relative">
                        <div
                            className="absolute inset-0 bg-center bg-black/20"
                            style={{backgroundImage: `url(${user?.bannerUrl})`}}
                        />
                    </div>
                    <div className="flex items-end gap-6 px-8 -mt-2 pb-6 relative z-10">
                        <AvatarDisplay
                            src={user?.avatarUrl}
                            fallback={user?.displayName}
                            alt={user?.avatarUrl || "User Avatar"}
                            size={124}
                        />
                        <div className="pb-2 flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-3xl font-bold">{user?.displayName || user?.email || "Chào bạn"}</h1>
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
                        <UserInfoDialog
                            user={user!}
                        >
                            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                                <Info className="w-4 h-4"/> Thông tin
                            </Button>
                        </UserInfoDialog>

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

                <div>
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary"/>
                                    Nhóm đang tham gia
                                </CardTitle>
                                <Button variant="ghost" size="sm">Xem tất cả <ChevronRight/></Button>
                            </div>
                        </CardHeader>
                        {
                            myRooms.length > 0 ?
                                (
                                    <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-1 lg:grid-cols-2">
                                        {myRooms.map(r => (
                                            <RoomCard key={r.id} room={r} enumItem={getEnumItem(groupEnum, r.topic)}
                                                      onClick={() => nav(`/rooms/${r.slug}`)}/>
                                        ))}
                                    </CardContent>
                                )
                                :
                                (
                                    <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-1 lg:grid-cols-1">
                                        <div className="text-sm text-center text-muted-foreground italic">Bạn chưa tham
                                            gia nhóm học tập
                                            nào. Hãy tham gia nhóm để bắt đầu học cùng nhau!
                                        </div>
                                    </CardContent>
                                )
                        }
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-warning"/>
                                Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-4">
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
                                    {name: "Top Performer", icon: Star, earned: true, color: "text-warning"},
                                    {name: "Group Leader", icon: Crown, earned: true, color: "text-primary"},
                                ].map((badge, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "group relative aspect-square w-24 sm:w-24 md:w-28 lg:w-32 overflow-hidden rounded-xl border-2 p-3 text-center transition-all duration-300", // 👈 vuông 1:1 + size cố định
                                            badge.earned
                                                ? "bg-gradient-to-br from-background to-muted/30 border-primary/20 hover:border-primary/40 shadow-sm"
                                                : "bg-muted/30 border-muted-foreground/20 opacity-60"
                                        )}
                                    >
                                        <div
                                            className="grid h-full w-full grid-rows-[auto,1fr,auto] items-center justify-items-center">
                                            <badge.icon className={cn("h-6 w-6", badge.color)}/>
                                            <div
                                                className="w-full px-1 text-xs font-medium leading-tight line-clamp-2"
                                                title={badge.name}
                                            >
                                                {badge.name}
                                            </div>
                                            {badge.earned ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] px-2 py-0 bg-success text-primary-foreground"
                                                >
                                                    Đạt được
                                                </Badge>
                                            ) : (
                                                <span
                                                    className="h-4"/>
                                            )}
                                        </div>
                                        <div
                                            className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-primary/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-primary/30"/>
                                    </div>

                                ))}
                            </div>
                            {/* Progress to next achievement */}
                            <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl">
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