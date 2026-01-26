import {MessageSquareText, Users, Files, UserPlus, ClipboardList, MessageCircle, FileCheck} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {JoinRequestList} from "@/components/features/group/JoinRequestList";
import {cn} from "@/lib/utils";
import type {RoomDetail} from "@/types/group/group.type";
import {GroupMemberList} from "@/components/features/group/GroupMemberList.tsx";
import {GroupChatList} from "@/components/features/group/chat/GroupChatList.tsx";
import TaskBoard from "@/components/features/task/TaskBoard.tsx";

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
        <Tabs defaultValue="chat" value={activeTab} onValueChange={onTabChange} className="w-full h-full flex flex-col">
            <TabsList className={cn("grid w-full", canEdit ? "grid-cols-5" : "grid-cols-4")}>
                <TabsTrigger value="chat"><MessageCircle className="w-4 h-4"/></TabsTrigger>
                <TabsTrigger value="member"><Users className="w-4 h-4"/> </TabsTrigger>
                <TabsTrigger value="tasks"><ClipboardList className="w-4 h-4"/></TabsTrigger>
                <TabsTrigger value="files"><FileCheck className="w-4 h-4"/></TabsTrigger>
                {canEdit && (
                    <TabsTrigger value="requests" className="relative">
                        <UserPlus className="h-4 w-4"/>
                    </TabsTrigger>
                )}
            </TabsList>

            <TabsContent value="chat" className="flex-1 min-h-0 mt-2 data-[state=inactive]:hidden">
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2 shrink-0">
                        <CardTitle className="flex items-center gap-2"><MessageSquareText className="h-5 w-5"/> Chat
                            nhóm</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 p-0 overflow-hidden">
                        <div className="h-full p-4 pt-0">
                            <GroupChatList groupId={roomData.id} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="member" className="flex-1 min-h-0 mt-2 data-[state=inactive]:hidden">
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2 shrink-0">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5"/> Thành viên ({roomData.memberCount})
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 min-h-0 p-4 pt-0">
                        <GroupMemberList groupId={roomData.id} canEdit={canEdit}/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="tasks" className="flex-1 min-h-0 mt-2 h-full data-[state=inactive]:hidden">
                <TaskBoard groupId={roomData.id} isMod={canEdit}/>
            </TabsContent>

            <TabsContent value="files" className="flex-1 min-h-0 mt-2 data-[state=inactive]:hidden">
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2 shrink-0">
                        <CardTitle className="flex items-center gap-2">
                            <Files className="h-5 w-5"/> Tài liệu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
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
                <TabsContent value="requests" className="flex-1 min-h-0 mt-2 data-[state=inactive]:hidden">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="pb-2 shrink-0">
                            <CardTitle className="flex items-center gap-2">
                                <Files className="h-5 w-5"/> Yêu cầu tham gia
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0">
                            <JoinRequestList groupSlug={roomData.slug}/>
                        </CardContent>
                    </Card>
                </TabsContent>
            )}
        </Tabs>
    );
}