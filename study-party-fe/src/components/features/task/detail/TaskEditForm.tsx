import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {format} from "date-fns";
import {Loader2, Save, X, Paperclip, Check, ChevronsUpDown} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription} from "@/components/ui/form";
import {Badge} from "@/components/ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {SubmissionType} from "@/types/enum/task.enum";
import {cn} from "@/lib/utils";
import {useGroupMembers} from "@/hooks/useGroupMember.ts";
import type {AssigneeResponse} from "@/types/user.type.ts";
import type {TaskDetailResponse} from "@/types/task/task.type.ts";
import AvatarDisplay from "@/components/shared/AvatarDisplay.tsx";

// Schema update thêm assigneeIds
const editSchema = z.object({
    title: z.string().min(5, "Tiêu đề ngắn quá (min 5)"),
    description: z.string().min(10, "Mô tả sơ sài quá (min 10)"),
    deadline: z.string().refine((val) => new Date(val) > new Date(), {
        message: "Deadline phải ở thì tương lai chứ bro!",
    }),
    submissionType: z.enum([SubmissionType.INDIVIDUAL, SubmissionType.GROUP]),
    assigneeIds: z.array(z.number()), // Thêm field này
    isAssignAll: z.boolean(), // Thêm cờ check giao tất cả
});

export type EditFormValues = z.infer<typeof editSchema>;

interface TaskEditFormProps {
    task: TaskDetailResponse;
    onSubmit: (values: EditFormValues, files: File[]) => void;
    onCancel: () => void;
    isPending: boolean;
}

export default function TaskEditForm({task, onSubmit, onCancel, isPending}: TaskEditFormProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [openCombobox, setOpenCombobox] = useState(false);

    // 1. Lấy danh sách thành viên nhóm để chọn
    const {data: memberData} = useGroupMembers(task?.groupId, {
        page: 0,
        size: 100, // Lấy nhiều chút
        enabled: !!task?.groupId
    });
    const members = memberData?.items || [];

    const form = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            title: "",
            description: "",
            deadline: "",
            submissionType: SubmissionType.INDIVIDUAL,
            assigneeIds: [],
            isAssignAll: true,
        },
    });

    // 2. Load dữ liệu cũ vào Form
    useEffect(() => {
        if (task) {
            // Check xem task đang giao cho ai
            const currentAssigneeIds = task.assignees?.map((u: AssigneeResponse) => u.id) || [];

            // Logic check "Assign All": Nếu số người được giao = 0 (logic cũ BE) hoặc = tổng thành viên (logic mới)
            // Tạm thời nếu list assignee rỗng hoặc null -> coi như Assign All (tùy logic BE lúc tạo của m)
            // Hoặc m có thể dựa vào một flag từ BE nếu có.
            // Ở đây t set mặc định: Nếu có list cụ thể -> false, ngược lại true.
            const isAll = currentAssigneeIds.length === 0;

            form.reset({
                title: task.title,
                description: task.description,
                deadline: task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm") : "",
                submissionType: task.submissionType,
                assigneeIds: currentAssigneeIds,
                isAssignAll: isAll
            });
            setFiles([]);
        }
    }, [task, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // Toggle chọn member
    const toggleMember = (memberId: number) => {
        const currentIds = form.getValues("assigneeIds");
        if (currentIds.includes(memberId)) {
            form.setValue("assigneeIds", currentIds.filter(id => id !== memberId));
        } else {
            form.setValue("assigneeIds", [...currentIds, memberId]);
        }
    };

    // UI Variables
    const isAssignAll = form.watch("isAssignAll");
    const selectedAssigneeIds = form.watch("assigneeIds");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => {
                // Logic submit: Nếu chọn Assign All -> Gửi mảng rỗng (hoặc mảng full member tùy BE)
                // Ở đây t làm theo logic: All -> Gửi [], BE tự hiểu là giữ nguyên hoặc assign all
                // Nhưng tốt nhất là gửi List ID chuẩn xác để BE update theo logic mới viết ở trên.
                const finalAssignees = values.isAssignAll ? [] : values.assigneeIds;
                onSubmit({...values, assigneeIds: finalAssignees}, files);
            })} className="space-y-6 px-1">

                {/* Basic Info Block */}
                <div
                    className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Tiêu đề</FormLabel>
                                <FormControl><Input className="bg-white dark:bg-slate-950" {...field} /></FormControl>
                                <FormMessage className="text-red-500"/>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Hạn chót ⏳</FormLabel>
                                    <FormControl><Input type="datetime-local"
                                                        className="bg-white dark:bg-slate-950" {...field} /></FormControl>
                                    <FormMessage className="text-red-500"/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="submissionType"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Thể loại</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger
                                            className="bg-white dark:bg-slate-950"><SelectValue/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value={SubmissionType.INDIVIDUAL}>👤 Cá nhân</SelectItem>
                                            <SelectItem value={SubmissionType.GROUP}>👥 Nhóm</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Mô tả chi tiết 📝</FormLabel>
                                <FormControl><Textarea
                                    className="min-h-[120px] bg-white dark:bg-slate-950" {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* --- ASSIGNEES SECTION (MỚI) --- */}
                <div className="p-4 border rounded-2xl bg-white dark:bg-slate-950 space-y-4">
                    <FormField
                        control={form.control}
                        name="isAssignAll"
                        render={({field}) => (
                            <FormItem
                                className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-slate-50 dark:bg-slate-900">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-semibold">Giao cho tất cả</FormLabel>
                                    <FormDescription>Thay đổi người được giao bài tập này.</FormDescription>
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
                                    <FormLabel>Chọn thành viên cụ thể</FormLabel>
                                    <Popover modal={true} open={openCombobox} onOpenChange={setOpenCombobox}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn("w-full justify-between", !field.value.length && "text-muted-foreground")}
                                                >
                                                    {field.value.length > 0
                                                        ? `Đang chọn ${field.value.length} người`
                                                        : "Tìm kiếm thành viên..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0" align="start">
                                            <Command shouldFilter={true}>
                                                <CommandInput placeholder="Tìm theo tên..."/>
                                                <CommandList>
                                                    <CommandEmpty>Không tìm thấy ai.</CommandEmpty>
                                                    <div className="max-h-[200px] overflow-auto">
                                                        {members.map((item) => (
                                                            <CommandItem
                                                                key={item.member.id}
                                                                value={`${item.member.displayName}-${item.member.id}`}
                                                                onSelect={() => toggleMember(item.member.id)}
                                                                className="cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4 text-primary",
                                                                            field.value.includes(item.member.id) ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <AvatarDisplay src={item.member.avatarUrl}
                                                                                   size={36}
                                                                                   fallback={item.member.displayName}
                                                                                   userId={item.member.id}
                                                                                   showStatus={true}
                                                                    />
                                                                    <span>{item.member.displayName}</span>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </div>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    {/* List Badges */}
                                    {selectedAssigneeIds.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {members
                                                .filter(m => selectedAssigneeIds.includes(m.member.id))
                                                .map(m => (
                                                    <Badge key={m.member.id} variant="secondary"
                                                           className="pl-1 pr-2 py-1 flex items-center gap-1">
                                                        <Avatar className="h-5 w-5">
                                                            <AvatarImage src={m.member.avatarUrl}/>
                                                            <AvatarFallback
                                                                className="text-[9px]">{m.member.displayName?.substring(0, 1)}</AvatarFallback>
                                                        </Avatar>
                                                        {m.member.displayName}
                                                        <X className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
                                                           onClick={() => toggleMember(m.member.id)}/>
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

                {/* File Upload Block */}
                <div
                    className="space-y-3 p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <FormLabel className="flex items-center gap-2 cursor-pointer"
                               onClick={() => document.getElementById('edit-file-upload')?.click()}>
                        <Paperclip className="h-4 w-4"/> Thêm tài liệu đính kèm
                    </FormLabel>
                    <Input id="edit-file-upload" type="file" multiple onChange={handleFileChange} className="hidden"/>
                    {files.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {files.map((f, i) => (
                                <Badge key={i} variant="secondary" onClick={() => removeFile(i)}
                                       className="cursor-pointer hover:bg-red-100 hover:text-red-600">
                                    {f.name} <X className="h-3 w-3 ml-1"/>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Buttons */}
                <div className="flex gap-3 w-full justify-end pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}
                            className="rounded-xl">
                        <X className="h-4 w-4 mr-2"/> Hủy bỏ
                    </Button>
                    <Button type="submit" disabled={isPending}
                            className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                            <Save className="h-4 w-4 mr-2"/>}
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </Form>
    );
}