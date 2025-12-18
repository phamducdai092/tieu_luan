import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Star, Search, Globe2, LaptopMinimalCheck} from "lucide-react";
import type {Room} from "@/types/group/group.type.ts";
import RoomCard from "@/components/features/group/RoomCard.tsx";
import Pomodoro from "@/components/shared/Pomodoro.tsx";
import {useGroupStore} from "@/store/group.store.ts";
import {useEnumStore} from "@/store/enum.store.ts";
import type {EnumItem} from "@/types/enum.type.ts";
import {getEnumItem} from "@/utils/enumItemExtract.ts";
import CreateRoomDialog from "@/components/features/group/CreateRoomDialog.tsx";

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
                        <Button className="gap-2"><Globe2 className="h-4 w-4"/>Khám phá</Button>
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
                        <Button variant="ghost" size="sm">Xem tất cả</Button>
                    </div>
                    {joinedRooms.length > 0 ?
                        (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 lg:grid-cols-2">
                                {joinedRooms.map(r => (
                                    <RoomCard key={r.id} room={r} enumItem={getEnumItem(groupEnum, r.topic)}
                                              onClick={() => nav(`/rooms/${r.slug}`)}/>
                                ))}
                            </div>
                        )
                        :
                        (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 lg:grid-cols-1">
                                <div
                                    className="col-span-1 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    Bạn chưa tham gia phòng học nào. Hãy khám phá và tham gia một phòng học để bắt đầu!
                                </div>
                            </div>
                        )
                    }
                </section>

                <Separator/>

                {/* Featured Rooms */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Star className="h-4 w-4"/> Phòng của tôi</h2>
                        <Button variant="ghost" size="sm">Xem thêm</Button>
                    </div>
                    {ownedRooms.length > 0 ?
                        (<div className="grid grid-cols-1 gap-3 sm:grid-cols-1 lg:grid-cols-2">
                            {ownedRooms.map(r => (
                                <RoomCard key={r.id} room={r} enumItem={getEnumItem(groupEnum, r.topic)}
                                          onClick={() => nav(`/rooms/${r.slug}`)}/>
                            ))}
                        </div>)
                        :
                        (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 lg:grid-cols-1">
                                <div
                                    className="col-span-1 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    Bạn chưa tạo phòng học nào. Hãy tạo phòng học để bắt đầu chia sẻ kiến thức với mọi
                                    người!
                                </div>
                            </div>
                        )
                    }
                </section>
            </div>
        </div>
    );
}