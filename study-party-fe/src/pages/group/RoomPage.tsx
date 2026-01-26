import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Star, Search, Globe2, LaptopMinimalCheck} from "lucide-react";
import type {Room} from "@/types/group/group.type.ts";
import Pomodoro from "@/components/shared/Pomodoro.tsx";
import {useGroupStore} from "@/store/group.store.ts";
import {useEnumStore} from "@/store/enum.store.ts";
import type {EnumItem} from "@/types/enum.type.ts";
import {getEnumItem} from "@/utils/enumItemExtract.ts";
import CreateRoomDialog from "@/components/features/group/CreateRoomDialog.tsx";
import {GroupsBlock} from "@/components/shared/group/GroupsBlock.tsx";

export default function RoomPage() {
    const nav = useNavigate();

    const joinedRooms: Room[] = useGroupStore(state => state.userRoomsJoined);
    const ownedRooms: Room[] = useGroupStore(state => state.userRoomsOwned);
    const groupEnum: EnumItem[] = useEnumStore().get("GroupTopic");

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Header nhẹ nhàng */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-semibold">Study Rooms</h1>
                        <p className="text-sm text-muted-foreground">Quản lý Pomodoro cá nhân & tham gia phòng học</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreateRoomDialog groupTopics={groupEnum}/>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => nav('/groups/list/discover')}
                        >
                            <Globe2 className="h-4 w-4"/>Khám phá
                        </Button>
                    </div>

                </div>

                {/* Pomodoro cá nhân */}
                <Pomodoro title="Pomodoro cá nhân" size="xl"/>

                {/* Thanh search/filters (optional) */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input placeholder="Tìm phòng theo tên/chủ đề…" className="pl-9"/>
                    </div>
                    <Button variant="outline">Filter</Button>
                </div>

                {/* My Rooms */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <LaptopMinimalCheck className="h-4 w-4"/> Phòng đã tham gia
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => nav('/groups/list/joined')}
                        >
                            Xem thêm
                        </Button>
                    </div>
                    <GroupsBlock
                        rooms={joinedRooms}
                        getEnum={(topic) => getEnumItem(groupEnum, topic)}
                        onRoomClick={(r) => nav(`/rooms/${r.slug}`)}
                        blockName="Phòng học đang tham gia"
                    />
                </section>

                <Separator/>

                {/* Featured Rooms */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Star className="h-4 w-4"/> Phòng của tôi</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => nav('/groups/list/owned')}
                        >
                            Xem thêm
                        </Button>
                    </div>
                    <GroupsBlock
                        rooms={ownedRooms}
                        getEnum={(topic) => getEnumItem(groupEnum, topic)}
                        onRoomClick={(r) => nav(`/rooms/${r.slug}`)}
                        blockName="Phòng học của tôi"
                    />
                </section>
            </div>
        </div>
    );
}