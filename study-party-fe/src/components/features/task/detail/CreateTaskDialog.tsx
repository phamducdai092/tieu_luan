import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {CalendarIcon, Check, ChevronsUpDown, Paperclip, X, Loader2, User} from "lucide-react";
import {toast} from "sonner";
import {cn} from "@/lib/utils.ts";

// --- Service & Types ---
import {SubmissionType} from "@/types/enum/task.enum.ts";
import type {CreateTaskRequest} from "@/types/task/task.type.ts";
import {createTask} from "@/services/task.service.ts";
import {useGroupMembers} from "@/hooks/useGroupMember.ts";
import AvatarDisplay from "@/components/shared/AvatarDisplay.tsx";
import useAuthStore from "@/store/auth.store.ts";

// --- SCHEMA FIX ---
const formSchema = z.object({
    title: z.string().min(5, "Tiêu đề tối thiểu 5 ký tự"),
    description: z.string().min(10, "Mô tả tối thiểu 10 ký tự"),
    deadline: z.string().refine((val) => new Date(val) > new Date(), {
        message: "Deadline phải ở thì tương lai",
    }),
    // FIX 1: Thay nativeEnum bằng enum cụ thể để tránh lỗi deprecated và type mismatch
    submissionType: z.enum([SubmissionType.INDIVIDUAL, SubmissionType.GROUP]),

    // FIX 2: Bỏ .default([]) ở đây để schema strict hơn (bắt buộc phải là array)
    // React Hook Form sẽ lo phần default value
    assigneeIds: z.array(z.number()),

    // FIX 3: Bỏ .default(true)
    isAssignAll: z.boolean(),
});

// Tạo type từ schema để dùng cho useForm
type FormValues = z.infer<typeof formSchema>;

interface CreateTaskDialogProps {
    groupId: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreateTaskDialog({groupId, isOpen, onClose, onSuccess}: CreateTaskDialogProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openCombobox, setOpenCombobox] = useState(false);

    // Giả sử m lấy user hiện tại (Để demo t lấy tạm ID = 1 hoặc m truyền props vào)
    const {user} = useAuthStore();
    const currentUserId = user!.id;

    const {data: memberData, isLoading: isLoadingMembers} = useGroupMembers(groupId, {
        page: 0,
        size: 100,
        enabled: isOpen
    });

    const members = memberData?.items || [];

    // FIX 4: Explicit Generic Type <FormValues> cho useForm
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            deadline: "",
            submissionType: SubmissionType.INDIVIDUAL,
            assigneeIds: [], // Default value khai báo ở đây là chuẩn nhất
            isAssignAll: true,
        },
    });

    const isAssignAll = form.watch("isAssignAll");
    const selectedAssigneeIds = form.watch("assigneeIds");

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            const finalAssignees = values.isAssignAll ? [] : values.assigneeIds;

            const requestData: CreateTaskRequest = {
                title: values.title,
                description: values.description,
                deadline: new Date(values.deadline).toISOString(),
                submissionType: values.submissionType as SubmissionType,
                assigneeIds: finalAssignees,
            };

            await createTask(groupId, requestData, files);

            toast.success("Đã giao bài tập thành công!");

            form.reset({
                title: "",
                description: "",
                deadline: "",
                submissionType: SubmissionType.INDIVIDUAL,
                assigneeIds: [],
                isAssignAll: true
            });
            setFiles([]);
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Lỗi khi giao bài tập");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(Array.from(e.target.files));
    };

    const toggleMember = (memberId: number) => {
        const currentIds = form.getValues("assigneeIds");
        if (currentIds.includes(memberId)) {
            form.setValue("assigneeIds", currentIds.filter(id => id !== memberId));
        } else {
            form.setValue("assigneeIds", [...currentIds, memberId]);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>📝 Giao bài tập mới</DialogTitle>
                    <DialogDescription>Tạo nhiệm vụ và phân công cho thành viên.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Tiêu đề <span
                                            className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="VD: Bài tập Chapter 1..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="deadline"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Hạn chót</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type="datetime-local" {...field}
                                                           className="pl-10 cursor-pointer"/>
                                                    <CalendarIcon
                                                        className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="submissionType"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Hình thức nộp</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn loại"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={SubmissionType.INDIVIDUAL}>👤 Cá nhân</SelectItem>
                                                    <SelectItem value={SubmissionType.GROUP}>👥 Theo nhóm</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 space-y-4">
                            <FormField
                                control={form.control}
                                name="isAssignAll"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base font-semibold">Giao cho tất cả</FormLabel>
                                            <FormDescription>Bài tập sẽ được giao cho toàn bộ thành viên
                                                nhóm.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-primary cursor-pointer"
                                                checked={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {!isAssignAll && (
                                <FormField
                                    control={form.control}
                                    name="assigneeIds"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <div className="flex justify-between items-center">
                                                <FormLabel>Chọn thành viên cụ thể</FormLabel>
                                                {/* 👇 NÚT GIAO CHO TÔI */}
                                                {/* M cần map đúng ID của user đang login vào hàm toggleMember */}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-xs text-primary hover:bg-primary/10"
                                                    onClick={() => toggleMember(currentUserId)}
                                                >
                                                    <User className="h-3 w-3 mr-1"/> Giao cho tôi
                                                </Button>
                                            </div>
                                            <Popover modal={true} open={openCombobox} onOpenChange={setOpenCombobox}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn("w-full justify-between", !field.value.length && "text-muted-foreground")}
                                                            disabled={isLoadingMembers}
                                                        >
                                                            {isLoadingMembers
                                                                ? <span className="flex items-center gap-2"><Loader2
                                                                    className="h-4 w-4 animate-spin"/> Đang tải...</span>
                                                                : (field.value.length > 0 ? `Đã chọn ${field.value.length} người` : "Tìm kiếm thành viên...")}
                                                            <ChevronsUpDown
                                                                className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[400px] p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Tìm theo tên..."/>
                                                        <CommandList>
                                                            <CommandEmpty>Không tìm thấy ai.</CommandEmpty>
                                                            <div className="max-h-[200px] overflow-auto">
                                                                {members.map((item) => (
                                                                    <CommandItem
                                                                        // 👇 QUAN TRỌNG: value phải là unique string và không dấu để search chuẩn
                                                                        // Nối thêm ID vào để chắc chắn không bị trùng (2 người cùng tên là crash app ngay)
                                                                        value={`${item.member.displayName}-${item.member.id}`}
                                                                        key={item.member.id}
                                                                        onSelect={() => {
                                                                            toggleMember(item.member.id);
                                                                            // setOpenCombobox(false); // Có thể comment dòng này nếu muốn chọn nhiều
                                                                        }}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <div className="flex items-center gap-2 flex-1">
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4 text-primary",
                                                                                    field.value.includes(item.member.id) ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                            <AvatarDisplay src={item!.member.avatarUrl}
                                                                                           fallback={item!.member.displayName}
                                                                                           alt={item!.member.displayName}
                                                                                           size={32}
                                                                                           userId={item!.member.id}
                                                                                           showStatus={true}
                                                                            />
                                                                            <div className="flex flex-col">
                                                                                <span
                                                                                    className="font-medium">{item.member.displayName}</span>
                                                                            </div>
                                                                        </div>
                                                                    </CommandItem>
                                                                ))}
                                                            </div>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            {selectedAssigneeIds.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {members
                                                        .filter(m => selectedAssigneeIds.includes(m.member.id))
                                                        .map(m => (
                                                            <Badge key={m.member.id} variant="secondary"
                                                                   className="pl-1 pr-2 py-1 flex items-center gap-1">
                                                                <AvatarDisplay src={m!.member.avatarUrl}
                                                                               fallback={m!.member.displayName}
                                                                               alt={m!.member.displayName} size={32}/>
                                                                {m.member.displayName}
                                                                <X
                                                                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
                                                                    onClick={() => toggleMember(m.member.id)}
                                                                />
                                                            </Badge>
                                                        ))
                                                    }
                                                </div>
                                            )}
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Nội dung chi tiết</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Mô tả yêu cầu..."
                                                      className="min-h-[120px]" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel className="font-semibold">Tài liệu đính kèm</FormLabel>
                                <div
                                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
                                    onClick={() => document.getElementById('file-upload-task')?.click()}
                                >
                                    <Paperclip className="h-8 w-8 text-muted-foreground mb-2"/>
                                    <span className="text-sm text-muted-foreground">Nhấn để tải file hoặc kéo thả</span>
                                    <Input
                                        id="file-upload-task"
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                {files.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {files.map((f, i) => (
                                            <div key={i}
                                                 className="flex items-center justify-between p-2 text-sm border rounded bg-background shadow-sm">
                                                <div className="flex items-center gap-2 truncate">
                                                    <span
                                                        className="font-bold text-xs uppercase bg-muted p-1 rounded">{f.name.split('.').pop()}</span>
                                                    <span className="truncate max-w-[150px]"
                                                          title={f.name}>{f.name}</span>
                                                </div>
                                                <Button
                                                    type="button" variant="ghost" size="icon" className="h-6 w-6"
                                                    onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                                                >
                                                    <X className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {isSubmitting ? "Đang tạo..." : "Giao bài ngay"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}