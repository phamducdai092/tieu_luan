import {format} from "date-fns";
import {vi} from "date-fns/locale";
import {Clock, GraduationCap, Globe, FileText, Paperclip, Download} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import AvatarDisplay from "@/components/shared/AvatarDisplay";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import type {AssigneeResponse} from "@/types/user.type.ts";
import type {AttachmentResponse} from "@/types/attachment/attachment.type.ts";
import type {TaskDetailResponse} from "@/types/task/task.type.ts";

export default function TaskDetailInfo({task}: { task: TaskDetailResponse }) {
    if (!task) return null;

    return (
        <div className="space-y-8 animate-in fade-in-50 duration-500">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                    className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex flex-col gap-1">
                    <span
                        className="text-xs font-semibold uppercase text-indigo-500 tracking-wider flex items-center gap-1">
                        <Clock className="h-3 w-3"/> Hạn chót
                    </span>
                    <span className="text-lg font-bold text-indigo-950 dark:text-indigo-200">
                        {task.deadline ? format(new Date(task.deadline), "HH:mm - dd 'thg' MM", {locale: vi}) : "Không giới hạn"}
                    </span>
                    <span className="text-xs text-indigo-400">
                        {task.deadline && new Date(task.deadline) < new Date() ? "⚠️ Đã quá hạn" : "Cố lên sắp tới rồi!"}
                    </span>
                </div>
                <div
                    className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900 flex flex-col gap-1">
                                    <span
                                        className="text-xs font-semibold uppercase text-pink-500 tracking-wider flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3"/> Đã tạo ngày
                                    </span>
                    <span className="text-lg font-bold text-pink-950 dark:text-pink-200">
                                        {task?.createdAt ? format(new Date(task.createdAt), "dd/MM/yyyy") : "N/A"}
                                    </span>
                    <span className="text-xs text-pink-400">Assignment created</span>
                </div>
            </div>

            {/* Assignees */}
            <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                    <Globe className="h-4 w-4"/> Biệt đội làm bài
                </h4>
                <div className="flex items-center gap-4 p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-900/50">
                    {/* Logic hiển thị assignees như cũ */}
                    {task.assignees && task.assignees.length > 0 ? (
                        <>
                            <div className="flex -space-x-3 overflow-hidden pl-1">
                                {task!.assignees.slice(0, 5).map((u: AssigneeResponse, idx: number) => (
                                    <TooltipProvider key={u.id || idx}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <AvatarDisplay src={u.avatarUrl}
                                                               fallback={u.displayName}
                                                               alt={u.displayName} size={46}
                                                               userId={u.id}
                                                               showStatus={true}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{u.displayName}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                                {task!.assignees.length > 5 && (
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-950 bg-slate-200 text-xs font-bold text-slate-600">
                                        +{task!.assignees.length - 5}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                                <span
                                                    className="text-sm font-medium">Giao cho {task!.assignees.length} thành viên</span>
                                <span
                                    className="text-xs text-muted-foreground">Đừng để deadline dí nhé!</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div
                                className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white">
                                <Globe className="h-5 w-5"/>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Toàn bộ thành viên (Global)</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                    <FileText className="h-4 w-4"/> Nội dung chi tiết
                </h4>
                <div
                    className="prose dark:prose-invert max-w-none text-sm leading-relaxed p-4 rounded-2xl border bg-white dark:bg-slate-950 shadow-sm">
                    <p className="whitespace-pre-line">{task.description}</p>
                </div>
            </div>

            <Separator className="opacity-50"/>

            {/* Attachments */}
            <div className="space-y-3 pb-10">
                <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                    <Paperclip className="h-4 w-4"/> Tài liệu đính kèm
                </h4>
                {task.attachments?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {task.attachments.map((file: AttachmentResponse, index: number) => (
                            <div key={index}
                                 className="group flex items-center justify-between p-3 rounded-xl border bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div
                                        className="h-10 w-10 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                                        <FileText className="h-5 w-5"/>
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                                        <span
                                                            className="text-sm font-medium truncate w-full group-hover:text-indigo-600 transition-colors">
                                                            {file.fileName}
                                                        </span>
                                        <span className="text-xs text-muted-foreground">Click để tải xuống</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon"
                                        className="text-slate-400 hover:text-indigo-600 rounded-full"
                                        asChild>
                                    <a href={file.fileUrl} target="_blank"
                                       rel="noreferrer"><Download
                                        className="h-4 w-4"/></a>
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className="p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground">
                        <span className="text-sm">Không có tài liệu nào đính kèm.</span>
                    </div>
                )}
            </div>
        </div>
    );
}