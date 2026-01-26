import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Components con
import TaskDetailInfo from "./TaskDetailInfo";
import TaskSubmissionView from "@/components/features/task/detail/submission/TaskSubmissionView.tsx";
import TaskEditForm, {type EditFormValues} from "@/components/features/task/detail/TaskEditForm.tsx";
import TaskSubmissionList from "@/components/features/task/detail/submission/TaskSubmissionList.tsx";

// Services
import { getTaskDetail, updateTask, deleteTask } from "@/services/task.service";

interface TaskDetailSheetProps {
    groupId: number;
    taskId: number | null;
    isOpen: boolean;
    onClose: () => void;
    isMod: boolean;
    onUpdateSuccess?: () => void;
}

export default function TaskDetailSheet({ groupId, taskId, isOpen, onClose, isMod, onUpdateSuccess }: TaskDetailSheetProps) {
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    // 1. Fetch Data
    const { data: task, isLoading, refetch } = useQuery({
        queryKey: ["task-detail", taskId],
        queryFn: () => getTaskDetail(groupId, taskId!),
        enabled: !!taskId && isOpen,
        staleTime: 0,
    });

    // 2. Mutations
    const updateMutation = useMutation({
        mutationFn: async ({ values, files }: { values: EditFormValues; files: File[] }) => {
            return updateTask(groupId, taskId!, {
                ...values,
                deadline: new Date(values.deadline).toISOString(),
            }, files);
        },
        onSuccess: () => {
            toast.success("Đã update bài tập, xịn sò luôn!");
            setIsEditing(false);
            refetch();
            onUpdateSuccess?.();
            queryClient.invalidateQueries({ queryKey: ["group-tasks", groupId] });
        },
        onError: (err: any) => toast.error("Lỗi: " + (err?.response?.data?.message || "Thử lại đê!")),
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteTask(groupId, taskId!),
        onSuccess: () => {
            toast.success("Bay màu bài tập thành công! 🗑️");
            onClose();
            onUpdateSuccess?.();
            queryClient.invalidateQueries({ queryKey: ["group-tasks", groupId] }); // update lại UI danh sách bài tập
        },
        onError: (err: any) => toast.error("Lỗi xóa: " + err?.message),
    });

    if (!isOpen) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-2xl p-0 h-screen flex flex-col backdrop-blur-xl border-l-2 [&>button]:hidden">

                {/* --- HEADER --- */}
                <SheetHeader className={cn(
                    "px-6 py-4 border-b shrink-0 transition-colors",
                    isEditing ? "bg-amber-50 dark:bg-amber-950/20" : "bg-white/80 dark:bg-slate-900/80"
                )}>
                    <div className="flex items-center justify-between">
                        {isLoading ? (
                            <div className="h-8 w-1/2 bg-muted animate-pulse rounded-md" />
                        ) : isEditing ? (
                            <div className="flex items-center gap-2 text-amber-600 font-bold animate-in slide-in-from-left-2">
                                <Edit2 className="h-5 w-5" /> Đang chỉnh sửa...
                            </div>
                        ) : (
                            <h2 className="text-xl font-bold truncate max-w-[80%]">{task?.title}</h2>
                        )}

                        {/* Mod Menu (3 chấm) */}
                        {isMod && !isLoading && !isEditing && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                    <DropdownMenuItem onClick={() => setIsEditing(true)} className="cursor-pointer font-medium">
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit bài này
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 cursor-pointer font-medium">
                                                <Trash2 className="mr-2 h-4 w-4" /> Xóa bài này
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="rounded-2xl">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Xóa thật không?</AlertDialogTitle>
                                                <AlertDialogDescription>Mất hết bài nộp đó nha bro!</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-xl">Thôi</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteMutation.mutate()} className="bg-red-600 rounded-xl">Xóa luôn</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </SheetHeader>

                {/* --- BODY --- */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-6 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-60 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
                        </div>
                    ) : isEditing ? (
                        <TaskEditForm
                            task={task}
                            isPending={updateMutation.isPending}
                            onSubmit={(values, files) => updateMutation.mutate({ values, files })}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        // MODE VIEW (3 TABS)
                        <Tabs defaultValue="details" className="w-full h-full flex flex-col">
                            {/* 👇 LOGIC TAB MỚI: Chia 3 nếu là Mod, 2 nếu là Member */}
                            <TabsList className={cn(
                                "grid w-full mb-6 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl sticky top-0 z-10 shadow-sm",
                                isMod ? "grid-cols-3" : "grid-cols-2"
                            )}>
                                <TabsTrigger value="details" className="rounded-lg font-semibold">📄 Chi tiết</TabsTrigger>
                                <TabsTrigger value="submission" className="rounded-lg font-semibold">📝 Bài làm</TabsTrigger>
                                {isMod && <TabsTrigger value="grading" className="rounded-lg font-semibold">📊 Quản lý</TabsTrigger>}
                            </TabsList>

                            {/* 1. Tab Chi tiết */}
                            <TabsContent value="details" className="focus-visible:outline-none">
                                <TaskDetailInfo task={task} />
                            </TabsContent>

                            {/* 2. Tab Nộp bài (AI CŨNG THẤY - Kể cả Mod) */}
                            <TabsContent value="submission" className="focus-visible:outline-none">
                                {task?.mySubmission ? (
                                    <TaskSubmissionView
                                        groupId={groupId}
                                        taskId={taskId!}
                                        mySubmission={task.mySubmission}
                                        deadline={task?.deadline}
                                        onSuccess={() => { refetch(); onUpdateSuccess?.(); }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-60 gap-3 text-muted-foreground bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed m-4">
                                        <span className="text-4xl">🤷‍♂️</span>
                                        <div className="text-center">
                                            <p className="font-semibold text-lg">Bạn không được giao bài này</p>
                                            {isMod && <p className="text-xs text-amber-600">(Mod muốn nộp thì tự Edit bài tập rồi assign cho mình nhé!)</p>}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* 3. Tab Chấm bài (CHỈ MOD THẤY) */}
                            {isMod && (
                                <TabsContent value="grading" className="focus-visible:outline-none h-full">
                                    <TaskSubmissionList groupId={groupId} taskId={taskId!} />
                                </TabsContent>
                            )}
                        </Tabs>
                    )}
                </div>

                {/* --- FOOTER (Chỉ hiện nút Đóng ở View Mode) --- */}
                {!isEditing && (
                    <SheetFooter className="p-5 border-t bg-white dark:bg-slate-950 shrink-0">
                        <Button variant="outline" className="w-full rounded-xl" onClick={onClose}>Đóng</Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}