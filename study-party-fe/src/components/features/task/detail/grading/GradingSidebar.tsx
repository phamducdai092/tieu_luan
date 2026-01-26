import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { TaskStatus } from "@/types/enum/task.enum";
import type { SubmissionResponse } from "@/types/task/task.type";

// Schema vứt vào đây vì chỉ có thằng này dùng
const gradingSchema = z.object({
    grade: z.number().min(0, "Điểm âm à bro?").max(100, "100 là max rồi!"),
    reviewNotes: z.string().optional(),
    status: z.enum([TaskStatus.APPROVED, TaskStatus.REQUEST_CHANGE]),
});

export type GradingFormValues = z.infer<typeof gradingSchema>;

interface GradingSidebarProps {
    submission: SubmissionResponse;
    onSubmit: (values: GradingFormValues) => void;
    onClose: () => void;
    isPending: boolean;
}

export default function GradingSidebar({ submission, onSubmit, onClose, isPending }: GradingSidebarProps) {
    // Move useForm vào đây -> Typing chỉ re-render component này
    const form = useForm<GradingFormValues>({
        resolver: zodResolver(gradingSchema),
        defaultValues: {
            grade: 0,
            reviewNotes: "",
            status: TaskStatus.APPROVED
        }
    });

    // Reset form khi đổi bài
    useEffect(() => {
        if (submission) {
            form.reset({
                grade: submission.grade || 0,
                reviewNotes: submission.reviewNotes || "",
                status: submission.status === TaskStatus.APPROVED ? TaskStatus.APPROVED : TaskStatus.APPROVED
            });
        }
    }, [submission, form]);

    const setQuickGrade = (score: number) => {
        form.setValue("grade", score);
    };

    return (
        <div className="w-full lg:w-[420px] xl:w-[450px] bg-white dark:bg-slate-950 flex flex-col shadow-xl z-20 border-l border-slate-200 dark:border-slate-800 h-full">
            <div className="p-6 md:p-8 flex-1 flex flex-col overflow-y-auto">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500"/>
                        Bảng điểm
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Đánh giá và phản hồi</p>
                </div>

                <Form {...form}>
                    <form id="grading-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1 flex flex-col">
                        {/* Grade Input Big */}
                        <FormField
                            control={form.control}
                            name="grade"
                            render={({field}) => (
                                <FormItem className="space-y-4">
                                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-slate-500">Điểm số tổng kết</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="pl-6 h-24 text-6xl font-black tracking-tighter border-2 border-slate-200 focus-visible:ring-4 focus-visible:ring-indigo-100 focus-visible:border-indigo-500 transition-all bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-900 dark:text-white"
                                                placeholder="0"
                                                min={0}
                                                max={100}
                                            />
                                            <span className="absolute right-6 top-8 text-xl text-muted-foreground font-bold opacity-50 select-none">/ 100</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />

                                    {/* Quick Grade Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        {[100, 90, 80, 70, 50, 0].map(score => (
                                            <Button
                                                key={score}
                                                type="button"
                                                variant="outline"
                                                className="flex-1 h-9 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                                                onClick={() => setQuickGrade(score)}
                                            >
                                                {score}
                                            </Button>
                                        ))}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Separator className="bg-slate-100 dark:bg-slate-800" />

                        {/* Review Notes - Nguyên nhân lag chính nằm ở đây */}
                        <FormField
                            control={form.control}
                            name="reviewNotes"
                            render={({ field }) => (
                                <FormItem className="flex-1 flex flex-col space-y-4">
                                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-slate-500">Lời phê / Góp ý chi tiết</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ví dụ: Bài làm rất tốt, tuy nhiên cần chú ý phần..."
                                            className="flex-1 min-h-[200px] resize-none bg-slate-50 dark:bg-slate-900 border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-100 focus-visible:border-indigo-500 p-4 text-base leading-relaxed rounded-xl"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-3">
                <Button
                    form="grading-form"
                    type="submit"
                    className="w-full h-14 text-lg font-bold shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="animate-spin mr-2 h-6 w-6" /> : <CheckCircle2 className="mr-2 h-6 w-6" />}
                    Xác nhận kết quả
                </Button>
                <Button variant="ghost" className="w-full h-10 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-medium" onClick={onClose}>
                    Đóng cửa sổ
                </Button>
            </div>
        </div>
    );
}