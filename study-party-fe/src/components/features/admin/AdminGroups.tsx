import { useState, useEffect } from 'react';
import { adminService } from '@/services/admin.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Lock, Unlock, Loader2, Users } from 'lucide-react';
import { AppPagination } from "@/components/common/AppPagination";
import { useAdminGroups } from "@/hooks/admin/useAdminGroups";

export default function AdminGroups() {
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

    // 3. Gọi Hook
    const { data, isLoading, isPlaceholderData, refetch } = useAdminGroups({
        page: page,
        size: 10,
        keyword: debouncedKeyword,
        sortBy: "id",
        order: "desc"
    });

    const groups = data?.items || [];
    const totalPages = data?.meta?.totalPages || 0;
    const totalItems = data?.meta?.totalItems || 0;

    // 4. Toggle Status Group
    const handleToggleStatus = async (groupId: number, active: boolean) => {
        try {
            await adminService.toggleGroupStatus(groupId);
            toast.success(active ? "Đã khóa nhóm" : "Đã mở khóa nhóm");
            await refetch();
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái nhóm");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Quản lý Nhóm học tập</h1>
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tên nhóm..."
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
                            <TableHead>Tên nhóm</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Thành viên</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groups.length === 0 && !isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    Không tìm thấy nhóm nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            groups.map((group) => (
                                <TableRow key={group.id} className={isPlaceholderData ? "opacity-50" : ""}>
                                    <TableCell className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{group.name}</span>
                                            <span className="text-xs text-muted-foreground">ID: {group.id}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="max-w-[300px] truncate" title={group.description}>
                                        {group.description || "Chưa có mô tả"}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4 text-muted-foreground" />
                                            <span>{group.memberCount || 0}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {group.active ? (
                                            <Badge className="bg-green-600 hover:bg-green-700">Hoạt động</Badge>
                                        ) : (
                                            <Badge variant="destructive">Đã khóa</Badge>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant={group.active ? "destructive" : "default"}
                                            onClick={() => handleToggleStatus(group.id, group.active)}
                                            className="min-w-[80px]"
                                        >
                                            {group.active ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                                            {group.active ? "Khóa" : "Mở"}
                                        </Button>
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