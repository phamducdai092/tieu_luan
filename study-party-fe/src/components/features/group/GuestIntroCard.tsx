import type {EnumItem} from "@/types/enum.type.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {TopicBadge} from "@/components/shared/TopicBadge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {UserPlus} from "lucide-react";

function GuestIntroCard({
                            name,
                            description,
                            topicItem,
                            privacyItem,
                            joinItem,
                            onJoinNow,
                            onRequestJoin,
                        }: {
    name: string;
    description?: string | null;
    topicItem: EnumItem | null;
    privacyItem: EnumItem | null;
    joinItem: EnumItem | null;
    onJoinNow: () => Promise<void>;
    onRequestJoin: () => Promise<void>;
}) {
    const policyCode = (joinItem?.code || "").toString().toUpperCase();

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Giới thiệu về nhóm “{name}”</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <TopicBadge enumItem={topicItem} fallback={topicItem?.label}/>
                    <TopicBadge enumItem={privacyItem} fallback={privacyItem?.label}/>
                    <TopicBadge enumItem={joinItem} fallback={joinItem?.label}/>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-line">
                    <p className="font-bold">Mô tả của nhóm</p>
                    <p>{description || "Nhóm này chưa có mô tả."}</p>
                </div>

                <div className="rounded-md border p-3 text-sm">
                    <div className="mb-2 font-bold text-2xl">Quyền truy cập</div>
                    <ul className="list-inside list-disc space-y-2 text-muted-foreground text-left text-primary text-md">
                        <li>Video call, Chat và Tài liệu sẽ hiển thị sau khi bạn trở thành thành viên.</li>
                        <li>Nếu nhóm là Private, bạn cần được chấp nhận bởi Owner/Moderator.</li>
                    </ul>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {policyCode.includes("OPEN") && (
                        <Button onClick={onJoinNow} className="gap-2">
                            <UserPlus className="h-4 w-4"/> Tham gia ngay
                        </Button>
                    )}
                    {policyCode.includes("ASK") && (
                        <Button onClick={onRequestJoin} className="gap-2">
                            <UserPlus className="h-4 w-4"/> Gửi yêu cầu tham gia
                        </Button>
                    )}
                    {!policyCode && (
                        <Button variant="outline" disabled title="Join policy chưa cấu hình">Chưa thể tham gia</Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default GuestIntroCard;