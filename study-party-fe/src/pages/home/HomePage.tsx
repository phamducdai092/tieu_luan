import {useNavigate} from "react-router-dom"

import {useEnumStore} from "@/store/enum.store.ts"
import useAuthStore from "@/store/auth.store.ts"
import {useGroupStore} from "@/store/group.store.ts"
import type {Room} from "@/types/group/group.type.ts"
import type {EnumItem} from "@/types/enum.type.ts"
import {getEnumItem} from "@/utils/enumItemExtract.ts"


import {HeroBanner} from "@/components/features/home/HeroBanner.tsx"
import {StreakCard} from "@/components/features/home/StreakCard.tsx"
import {type QuickStat, QuickStats} from "@/components/features/home/QuickStats.tsx"
import {WeekProgress, type ProgressItem} from "@/components/features/home/WeekProgress.tsx"
import {GroupsBlock} from "@/components/features/home/GroupsBlock.tsx"
import {ScheduleToday, type TodayEvent} from "@/components/features/home/ScheduleToday.tsx";

export default function HomePage() {
    const {user} = useAuthStore()
    const nav = useNavigate()

    const joinedRooms: Room[] = useGroupStore((s) => s.userRoomsJoined)
    const groupEnum: EnumItem[] = useEnumStore().get("GroupTopic")

// ---- demo data (can be fetched later) ----
    const stats: QuickStat[] = [
        {title: "Giờ học hôm nay", value: "2.5h", target: "/8h", icon: "Clock", color: "text-primary"},
        {title: "Phiên hoàn thành", value: "3", target: "/5", icon: "Target", color: "text-success"},
        {title: "Flashcards ôn tập", value: "24", target: "/50", icon: "BookOpen", color: "text-info"},
        {title: "Tin nhắn thảo luận", value: "12", target: "", icon: "MessageSquare", color: "text-warning"},
    ]

    const todayEvents: TodayEvent[] = [
        {
            time: "08:00 - 10:00",
            title: "Toán rời rạc",
            room: "Room A",
            type: "Học nhóm",
            status: "upcoming",
            participants: 8,
            color: "border-l-blue-400",
        },
        {
            time: "13:30 - 15:00",
            title: "CNPM review",
            room: "Room Study Party",
            type: "Thảo luận",
            status: "active",
            participants: 12,
            color: "border-l-success",
        },
        {
            time: "20:00 - 21:00",
            title: "Flashcard tiếng Anh",
            room: "Solo",
            type: "Tự học",
            status: "upcoming",
            participants: 1,
            color: "border-l-warning",
        },
    ]

    const progressItems: ProgressItem[] = [
        {label: "Focus phiên", current: 18, target: 25},
        {label: "Tài liệu chia sẻ", current: 5, target: 8},
        {label: "Thảo luận tích cực", current: 12, target: 15},
        {label: "Flashcards hoàn thành", current: 120, target: 150},
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <div className="space-y-8 p-6 max-w-7xl mx-auto">
                {/* Header: Hero + Streak */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <HeroBanner user={user} className="lg:col-span-2" onStart={() => {
                    }} onViewToday={() => {
                    }}/>
                    <StreakCard streakDays={7} goalDays={30}/>
                </div>

                {/* Quick Stats */}
                <QuickStats stats={stats}/>

                {/* Schedule + Week progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ScheduleToday
                        className="lg:col-span-2"
                        events={todayEvents}
                        onJoin={(e) => console.log("join", e.title)}
                        onView={(e) => console.log("view", e.title)}
                    />

                    <WeekProgress
                        totalLabel="Tổng thời gian"
                        totalValue="10/12 giờ"
                        totalPercent={84}
                        items={progressItems}
                        achievement={{title: "Study Marathoner", current: 78, target: 100}}
                    />
                </div>

                {/* Groups */}
                <GroupsBlock
                    rooms={joinedRooms}
                    getEnum={(topic) => getEnumItem(groupEnum, topic)}
                    onCreate={() => console.log("create group")}
                    onRoomClick={(r) => nav(`/rooms/${r.slug}`)}
                    activeCount={3}
                />

            </div>
        </div>
    )
}