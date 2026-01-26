import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Filter, Loader2, Clock } from "lucide-react";

import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { toast } from "sonner";

import { getSubmissions } from "@/services/task.service.ts";
import { TaskStatus } from "@/types/enum/task.enum.ts";
import type { SubmissionResponse } from "@/types/task/task.type.ts";
import TaskGradingDialog from "../grading/TaskGradingDialog.tsx";

export default function TaskSubmissionList({ groupId, taskId }: { groupId: number; taskId: number }) {
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedSubmission, setSelectedSubmission] = useState<SubmissionResponse | null>(null);

    // 1. Fetch List
    const { data: submissions = [], isLoading } = useQuery({
        queryKey: ["task-submissions", taskId],
        queryFn: async () => {
            const res = await getSubmissions(groupId, taskId, { page: 0, size: 100 });
            return res.data || [];
        }
    });

    // 2. Filter Client-side
    const filteredList = submissions.filter((sub: SubmissionResponse) => {
        if (statusFilter === "ALL") return true;
        if (statusFilter === "SUBMITTED") return sub.status === TaskStatus.SUBMITTED;
        if (statusFilter === "APPROVED") return sub.status === TaskStatus.APPROVED;
        if (statusFilter === "ASSIGNED") return sub.status === TaskStatus.ASSIGNED;
        return true;
    });

    const renderStatus = (status: TaskStatus, grade?: number) => {
        switch (status) {
            case TaskStatus.APPROVED:
                return <Badge className="bg-green-100 text-green-700 border-green-200">Done ({grade}đ)</Badge>;
            case TaskStatus.SUBMITTED:
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200 animate-pulse">Chờ chấm</Badge>;
            case TaskStatus.REQUEST_CHANGE:
                return <Badge variant="destructive">Yêu cầu sửa</Badge>;
            default:
                return <Badge variant="outline" className="text-muted-foreground">Chưa nộp</Badge>;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Filter Bar */}
            <div className="flex items-center gap-2 mb-4 p-1">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm theo tên..." className="pl-9 bg-slate-50 dark:bg-slate-900" />
                </div>
                {/* 👇 KHÔI PHỤC PHẦN SELECT ĐỂ SỬ DỤNG setStatusFilter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <Filter className="h-3.5 w-3.5" />
                            <SelectValue placeholder="Lọc" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả</SelectItem>
                        <SelectItem value="SUBMITTED">Chờ chấm</SelectItem>
                        <SelectItem value="APPROVED">Đã chấm</SelectItem>
                        <SelectItem value="ASSIGNED">Chưa nộp</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* List */}
            <div className="flex-1 overflow-hidden border rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                        <p>Không tìm thấy bài nộp nào.</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[400px] w-full">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredList.map((sub: SubmissionResponse) => (
                                <div
                                    key={sub.id || sub.userId}
                                    className="flex items-center justify-between p-3 hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer group"
                                    onClick={() => {
                                        if (sub.status !== TaskStatus.ASSIGNED) {
                                            setSelectedSubmission(sub);
                                        } else {
                                            toast.info("Thành viên này chưa nộp bài nha!");
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                                            <AvatarImage src={sub.user?.avatarUrl} />
                                            <AvatarFallback>{sub.user?.displayName?.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                                                {sub.user?.displayName}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                {sub.submittedAt ? (
                                                    <><Clock className="h-3 w-3" /> {format(new Date(sub.submittedAt), "HH:mm dd/MM")}</>
                                                ) : "Chưa có bài"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {renderStatus(sub.status, sub.grade)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>

            {/* Grading Dialog */}
            {selectedSubmission && (
                <TaskGradingDialog
                    isOpen={!!selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    groupId={groupId}
                    taskId={taskId}
                    submission={selectedSubmission}
                />
            )}
        </div>
    );
}