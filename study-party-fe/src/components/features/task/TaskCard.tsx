import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Clock, Users} from "lucide-react";
import {cn} from "@/lib/utils";
import type {TaskSummaryResponse} from "@/types/task/task.type.ts";
import {TaskStatus} from "@/types/enum/task.enum.ts";
import {fmtDateTime} from "@/utils/date.ts";

interface TaskCardProps {
    task: TaskSummaryResponse;
    onClick: () => void;
}

export default function TaskCard({task, onClick}: TaskCardProps) {
    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.APPROVED:
                return "bg-green-500 hover:bg-green-600";
            case TaskStatus.SUBMITTED:
                return "bg-blue-500 hover:bg-blue-600";
            case TaskStatus.REQUEST_CHANGE:
                return "bg-orange-500 hover:bg-orange-600";
            default:
                return "bg-slate-500 hover:bg-slate-600";
        }
    };

    const isOverdue = new Date(task.deadline) < new Date() && task.mySubmissionStatus !== TaskStatus.APPROVED;

    return (
        <Card
            onClick={onClick}
            className={cn(
                "cursor-pointer hover:shadow-md transition-all border-l-4 w-full h-fit",
                isOverdue ? "border-l-red-500" : "border-l-primary"
            )}
        >
            <CardHeader className="p-3 pb-1">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-sm font-bold line-clamp-1 leading-tight">
                        {task.title}
                    </CardTitle>
                    <Badge className={cn("text-[10px] h-5 px-1.5 shrink-0", getStatusColor(task.mySubmissionStatus))}>
                        {task.submissionType}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-3 pt-1.5"> {/* Giảm padding content */}
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    {/* Dòng Deadline */}
                    <div className="flex items-center gap-1.5">
                        <Clock className={cn("w-3 h-3", isOverdue && "text-red-500")} />
                        <span className={cn(isOverdue && "text-red-500 font-medium")}>
                            {fmtDateTime(task.deadline)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3 h-3" />
                            <span>{task.assigneeCount} người</span>
                        </div>

                        {task.submissionType === 'GROUP' && (
                            <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 border-muted-foreground/30">
                                Nhóm
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}