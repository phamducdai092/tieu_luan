import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskStatus } from "@/types/enum/task.enum";
import { toast } from "sonner";
import {reviewSubmission} from "@/services/task.service";

interface ReviewFormProps {
    groupId: number;
    taskId: number;
    submissionId: number;
    initialStatus?: TaskStatus;
    initialGrade?: number;
    initialNotes?: string;
    onSuccess: () => void;
}

export default function ReviewForm({
                                       groupId, taskId, submissionId,
                                       initialStatus = TaskStatus.SUBMITTED,
                                       initialGrade, initialNotes,
                                       onSuccess
                                   }: ReviewFormProps) {

    const [status, setStatus] = useState<TaskStatus>(initialStatus);
    const [grade, setGrade] = useState<number | undefined>(initialGrade);
    const [notes, setNotes] = useState(initialNotes || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (status === TaskStatus.SUBMITTED || status === TaskStatus.ASSIGNED) {
            toast.warning("Vui lòng chọn trạng thái Duyệt hoặc Yêu cầu sửa");
            return;
        }

        setIsLoading(true);
        try {
            await reviewSubmission(groupId, taskId, submissionId, {
                status,
                grade,
                reviewNotes: notes
            });
            toast.success("Đã chấm bài xong!");
            onSuccess();
        } catch (error: any) {
            toast.error("Lỗi: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <h4 className="font-semibold text-sm">Chấm điểm & Nhận xét</h4>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Trạng thái</Label>
                    <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
                        <SelectTrigger className={status === TaskStatus.APPROVED ? "text-green-600 font-medium border-green-200 bg-green-50" : status === TaskStatus.REQUEST_CHANGE ? "text-orange-600 font-medium border-orange-200 bg-orange-50" : ""}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={TaskStatus.APPROVED}>✅ Duyệt (Approved)</SelectItem>
                            <SelectItem value={TaskStatus.REQUEST_CHANGE}>⚠️ Yêu cầu sửa (Reject)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Điểm số (0-100)</Label>
                    <Input
                        type="number"
                        min={0} max={100}
                        value={grade || ""}
                        onChange={(e) => setGrade(Number(e.target.value))}
                        placeholder="VD: 90"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Lời phê của giáo viên</Label>
                <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nhập nhận xét..."
                />
            </div>

            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
                {isLoading ? "Đang lưu..." : "Lưu kết quả"}
            </Button>
        </div>
    );
}