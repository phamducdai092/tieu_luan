import {Button} from "@/components/ui/button.tsx";
import {Files, Pause, Play, RotateCcw, Timer, Users} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import usePomodoro from "@/hooks/use-poromodo.ts";

function StudyRoomPage() {
    const pomo = usePomodoro();

    return (
        <div className="space-y-6">
            {/* Room header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="text-xl font-semibold">Room Study Party – CNPM Review</div>
                    <div className="text-sm text-muted-foreground">Realtime • đồng bộ Pomodoro cho cả nhóm</div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Mời thành viên</Button>
                    <Button className="gap-2"><Files className="h-4 w-4"/>Chia sẻ tài liệu</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Pomodoro */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2"><Timer className="h-5 w-5"/> Pomodoro (group
                                sync – mock)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center gap-4 py-2">
                                <div className="text-5xl font-bold tabular-nums">{pomo.leftLabel}</div>
                                <Progress value={pomo.percent} className="w-full"/>
                                <div className="flex flex-wrap items-center gap-2">
                                    {!pomo.running ? (
                                        <Button onClick={pomo.start} className="gap-2">
                                            <Play className="h-4 w-4"/> Bắt đầu
                                        </Button>
                                    ) : (
                                        <Button onClick={pomo.pause} variant="secondary" className="gap-2">
                                            <Pause className="h-4 w-4"/> Tạm dừng
                                        </Button>
                                    )}
                                    <Button onClick={() => pomo.reset()} variant="outline" className="gap-2">
                                        <RotateCcw className="h-4 w-4"/> Reset
                                    </Button>
                                    <Button onClick={pomo.set25} variant="outline">25'</Button>
                                    <Button onClick={pomo.set50} variant="outline">50'</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Focus/Chat/Notes tabs */}
                    <Tabs defaultValue="focus">
                        <TabsList>
                            <TabsTrigger value="focus">Focus</TabsTrigger>
                            <TabsTrigger value="chat">Chat</TabsTrigger>
                            <TabsTrigger value="notes">Whiteboard/Notes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="focus">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle>Checklist buổi học</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    {[
                                        "Đọc lại flow use case",
                                        "Hoàn thiện sequence diagram",
                                        "Review PR #42",
                                    ].map((t, i) => (
                                        <div key={i}
                                             className="flex items-center justify-between rounded-md border p-3">
                                            <div>{t}</div>
                                            <Button size="sm" variant="outline">Đánh dấu xong</Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="chat">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle>Chat nhóm (mock)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-48 rounded-md border p-3 text-sm">Tin nhắn sẽ hiển thị ở đây…
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Input placeholder="Nhắn gì đó cho team…"/>
                                        <Button>Gửi</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="notes">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle>Bảng trắng chia sẻ (mock)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-48 rounded-md border p-3 text-sm">Vẽ/ghi chú realtime tại đây…
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Thành viên
                                (online)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {[
                                {name: "Teo", img: "https://i.pravatar.cc/120?img=5"},
                                {name: "Mai", img: "https://i.pravatar.cc/120?img=15"},
                                {name: "An", img: "https://i.pravatar.cc/120?img=30"},
                            ].map((u, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8"><AvatarImage
                                        src={u.img}/><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                                    <div className="flex-1">
                                        <div className="font-medium">{u.name}</div>
                                        <div className="text-xs text-emerald-600 dark:text-emerald-400">đang focus…
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Tài liệu đã share</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {["DSA-cheatsheet.pdf", "cnpm-seq.puml", "erd-v2.drawio"].map((f, i) => (
                                <div key={i} className="flex items-center justify-between rounded-md border p-2">
                                    <div>{f}</div>
                                    <Button size="sm" variant="outline">Tải</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default StudyRoomPage;
