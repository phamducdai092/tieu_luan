import {MessageSquareText, Users, Files, UserPlus, Search} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {JoinRequestList} from "@/components/features/group/JoinRequestList";
import {cn} from "@/lib/utils";
import type {RoomDetail} from "@/types/group/group.type";
import {GroupMemberList} from "@/components/features/group/GroupMemberList.tsx";
import {GroupChatList} from "@/components/features/group/chat/GroupChatList.tsx";

interface RoomTabsProps {
    activeTab: string;
    onTabChange: (val: string) => void;
    canEdit: boolean;
    isGuest: boolean;
    roomData: RoomDetail;
}

export function RoomTabs({activeTab, onTabChange, canEdit, isGuest, roomData}: RoomTabsProps) {
    if (isGuest) {
        return (
            <Card>
                <CardHeader className="pb-2"><CardTitle>Thông báo</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Bạn chưa phải thành viên nhóm nên Chat, Thành viên và Tài liệu được ẩn. Hãy tham gia nhóm để tiếp
                    tục.
                </CardContent>
            </Card>
        );
    }

    return (
        <Tabs defaultValue="chat" value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className={cn("grid w-full", canEdit ? "grid-cols-4" : "grid-cols-3")}>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="member">Thành viên</TabsTrigger>
                <TabsTrigger value="files">Tài liệu</TabsTrigger>
                {canEdit && (
                    <TabsTrigger value="requests" className="relative">
                        <UserPlus className="h-4 w-4"/>
                    </TabsTrigger>
                )}
            </TabsList>

            <TabsContent value="chat">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2"><MessageSquareText className="h-5 w-5"/> Chat
                            nhóm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GroupChatList groupId={roomData.id}/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="member">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5"/> Thành viên ({roomData.memberCount})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-2">
                            <Search
                                className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                            <Input placeholder="Tìm thành viên" className="pl-8"/>
                        </div>
                        <GroupMemberList groupId={roomData.id} canEdit={canEdit}/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="files">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Files
                        className="h-5 w-5"/> Tài liệu</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        {["DSA-cheatsheet.pdf", "cnpm-seq.puml"].map((f, i) => (
                            <div key={i} className="flex items-center justify-between rounded-md border p-2">
                                <div>{f}</div>
                                <Button variant="outline" size="sm">Tải</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>

            {canEdit && (
                <TabsContent value="requests" className="h-full mt-0">
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Files
                            className="h-5 w-5"/> Yêu cầu tham gia</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <JoinRequestList groupSlug={roomData.slug}/>
                        </CardContent>
                    </Card>
                </TabsContent>
            )}
        </Tabs>
    );
}