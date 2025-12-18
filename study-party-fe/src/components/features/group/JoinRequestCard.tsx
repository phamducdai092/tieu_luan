import {
    CalendarDays,
    UserCheck,
    ArrowRight
} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {fmtDateTime} from "@/utils/date";
import type {JoinRequestForUser} from "@/types/group/join_request.type";
import {cn} from "@/lib/utils";
import type {EnumItem} from "@/types/enum.type.ts";
import {TopicBadge} from "@/components/shared/TopicBadge.tsx";
import {useEnumStore} from "@/store/enum.store.ts";
import {getEnumItem} from "@/utils/enumItemExtract.ts";

interface JoinRequestCardProps {
    requestStatus?: EnumItem;
    data: JoinRequestForUser;
    onCancel?: (requestId: number) => void; // Callback để hủy
    onView?: (slug: string) => void; // Callback để xem phòng
}


export function JoinRequestCard({requestStatus, data, onCancel, onView}: JoinRequestCardProps) {
    const {joinRequestResponse: req, groupResponse: group} = data;
    const groupTopicEnum = useEnumStore().get("GroupTopic");
    const groupTopic = getEnumItem(groupTopicEnum, group.topic);
    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all hover:shadow-md",
            "border-l-4",
        )}>
            <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">

                {/* Phần Thông Tin Chính */}
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 mb-1">

                        <TopicBadge enumItem={groupTopic} fallback={groupTopic?.label}/>

                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarDays className="h-3 w-3"/>
                            {fmtDateTime(req.createdAt)}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-primary font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors cursor-pointer p-4"
                            onClick={() => onView?.(group.slug)}
                        >
                            {group.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Mô tả: {group.description}
                        </p>
                    </div>

                    {/* Nếu đã được xử lý (Duyệt/Từ chối), hiện tên người xử lý */}
                    {req.resolver && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5"/>
                            <span>
                                Xử lý bởi <span
                                className="font-medium text-foreground">{req.resolver.displayName || req.resolver.id}</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Phần Trạng Thái & Action */}
                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    {/* Status Badge */}
                    <TopicBadge enumItem={requestStatus} fallback={requestStatus?.label}/>


                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {req.status === 'PENDING' && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 text-xs text-white hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                                onClick={() => onCancel?.(req.requestId)}
                            >
                                Hủy yêu cầu
                            </Button>
                        )}

                        {req.status === 'ACCEPTED' && (
                            <Button
                                size="sm"
                                className="h-8 text-xs bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-0"
                                onClick={() => onView?.(group.slug)}
                            >
                                Vào nhóm <ArrowRight className="ml-1 h-3 w-3"/>
                            </Button>
                        )}

                        {req.status === 'DECLINED' && (
                            <Button
                                size="sm"
                                className="h-8 text-xs bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-0"
                                onClick={() => onView?.(group.slug)}
                            >
                                Xem nhóm <ArrowRight className="ml-1 h-3 w-3"/>
                            </Button>
                        )}

                        {req.status === 'CANCELLED' && (
                            <Button
                                size="sm"
                                className="h-8 text-xs bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-0"
                                onClick={() => onView?.(group.slug)}
                            >
                                Xem nhóm <ArrowRight className="ml-1 h-3 w-3"/>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}