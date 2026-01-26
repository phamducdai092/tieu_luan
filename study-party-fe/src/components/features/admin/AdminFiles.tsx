import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, FileText, Download, Trash2, Calendar, HardDrive } from 'lucide-react';
import { AppPagination } from "@/components/common/AppPagination";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAdminFiles } from '@/hooks/admin/useAdminFiles';

export default function AdminFiles() {
    // 1. State params
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");

    // 2. Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [keyword]);

    // 3. Gọi Hook (M cần tạo hook này tương tự useAdminGroups)
    const { data, isLoading, isPlaceholderData, refetch } = useAdminFiles({
        page: page,
        size: 10,
        keyword: debouncedKeyword,
        sortBy: "uploadedAt",
        order: "desc"
    });

    const files = data?.items || [];
    const totalPages = data?.meta?.totalPages || 0;
    const totalItems = data?.meta?.totalItems || 0;

    // Helper: Format File Size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Helper: Get File Icon Color based on extension (Optional)
    const getFileBadgeColor = (type: string) => {
        const t = type.toLowerCase();
        if (['java', 'js', 'ts', 'html'].includes(t)) return "bg-orange-100 text-orange-700 border-orange-200";
        if (['pdf', 'doc', 'docx'].includes(t)) return "bg-blue-100 text-blue-700 border-blue-200";
        if (['jpg', 'png', 'jpeg'].includes(t)) return "bg-pink-100 text-pink-700 border-pink-200";
        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    // Handle Delete File
    // const handleDeleteFile = async (fileId: number) => {
    //     if(!confirm("Bạn có chắc muốn xóa file này không?")) return;
    //
    //     try {
    //         // await adminService.deleteFile(fileId);
    //         toast.success("Đã xóa file thành công");
    //         // refetch();
    //     } catch (error) {
    //         toast.error("Lỗi khi xóa file");
    //     }
    // };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Quản lý Tài liệu</h1>
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên file..."
                        className="pl-8"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-md bg-white relative min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">ID</TableHead>
                            <TableHead>Tên File</TableHead>
                            <TableHead>Định dạng</TableHead>
                            <TableHead>Kích thước</TableHead>
                            <TableHead>Ngày đăng</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {files.length === 0 && !isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    Không tìm thấy tài liệu nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            files.map((file) => (
                                <TableRow key={file.id} className={isPlaceholderData ? "opacity-50" : ""}>
                                    <TableCell className="text-muted-foreground text-xs">{file.id}</TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-slate-50 border flex items-center justify-center text-slate-500">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col max-w-[250px]">
                                                <a
                                                    href={file.fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-medium hover:text-primary hover:underline truncate"
                                                    title={file.fileName}
                                                >
                                                    {file.fileName}
                                                </a>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    User ID: {file.uploadedById || 'System'}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="outline" className={getFileBadgeColor(file.fileType)}>
                                            {file.fileType.toUpperCase()}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-slate-600">
                                            <HardDrive className="w-3.5 h-3.5" />
                                            {formatFileSize(file.fileSize)}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-slate-600">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {file.uploadedAt ? format(new Date(file.uploadedAt), "dd/MM/yyyy HH:mm", { locale: vi }) : "N/A"}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 px-2 lg:px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                                asChild
                                            >
                                                <a href={file.fileUrl} target="_blank" rel="noreferrer">
                                                    <Download className="w-4 h-4 mr-1" /> Tải
                                                </a>
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                // onClick={() => handleDeleteFile(file.id)}
                                                className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AppPagination
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setPage}
            />
        </div>
    );
}