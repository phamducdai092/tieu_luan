import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Plus, Loader2} from "lucide-react";
import TaskCard from "./TaskCard";
import TaskDetailSheet from "./detail/TaskDetailSheet.tsx";
import CreateTaskDialog from "./detail/CreateTaskDialog.tsx";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useGroupTasks} from "@/hooks/task/useGroupTasks.ts";
import type {TaskSummaryResponse} from "@/types/task/task.type.ts";
import {AppPagination} from "@/components/common/AppPagination.tsx";

export default function TaskBoard({groupId, isMod}: { groupId: number, isMod: boolean }) {
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [page, setPage] = useState(0);
    // const [keyword, setKeyword] = useState("");
    // const [debouncedKeyword, setDebouncedKeyword] = useState("");

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setDebouncedKeyword(keyword);
    //         setPage(0);
    //     }, 500)
    //     return () => clearTimeout(timer);
    // }, [keyword]);

    const {data, isLoading, isPlaceholderData, refetch} = useGroupTasks(groupId, {
        page: page,
        size: 2,
    })

    const tasks = data?.items || [];
    const totalPages = data?.meta?.totalPages || 0;
    const totalItems = data?.meta?.totalItems || 0;

    return (
        <div className="h-full flex flex-col bg-slate-50/50 dark:bg-slate-900/20 overflow-hidden">
            {/* Header & Filters */}
            <div
                className="p-4 border-b flex justify-between items-center bg-background/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">Danh sách bài tập</h3>
                    {/* Hiển thị số lượng bài tập */}
                    {!isLoading && <span
                        className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{tasks.length}</span>}
                </div>

                {isMod && (
                    <Button size="sm" className="h-8 gap-1" onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4"/> Giao bài
                    </Button>
                )}
            </div>

            {/* Task List */}
            <ScrollArea className="flex-1 min-h-0 w-full p-4">
                {/* 4. Xử lý trạng thái Loading */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-primary"/>
                        <span className="text-xs">Đang tải bài tập...</span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks
                            .filter((task: TaskSummaryResponse) => !task.isDeleted)
                            .map((task: TaskSummaryResponse) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={() => setSelectedTaskId(task.id)}
                                />
                            ))
                        }

                        {/* Empty State */}
                        {tasks.length === 0 && (
                            <div className="text-center py-10 flex flex-col items-center gap-2 text-muted-foreground">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
                                    className="w-16 h-16 opacity-50 grayscale"
                                    alt="No task"
                                />
                                <span className="text-sm">Chưa có bài tập nào. Hãy nghỉ ngơi!</span>
                            </div>
                        )}
                    </div>
                )}
            </ScrollArea>

            <div className="pt-2 border-t mt-auto shrink-0">
                <AppPagination
                    page={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={setPage}
                />
            </div>

            {/* Detail Sheet */}
            <TaskDetailSheet
                groupId={groupId}
                taskId={selectedTaskId}
                isOpen={!!selectedTaskId}
                onClose={() => setSelectedTaskId(null)}
                isMod={isMod}
                // Nếu m muốn khi sửa task xong (vd update deadline) thì list cập nhật lại
                // onUpdateSuccess={refetch}
            />

            {/* Create Dialog */}
            {isMod && (
                <CreateTaskDialog
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    groupId={groupId}
                    onSuccess={refetch}
                />
            )}
        </div>

    );
}