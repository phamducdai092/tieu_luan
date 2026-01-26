import {useState, useEffect} from 'react';
import {adminService} from '@/services/admin.service';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {toast} from 'sonner';
import {Search, Lock, Unlock, Loader2} from 'lucide-react';
import {useAdminUsers} from "@/hooks/admin/useAdminUsers";
import AvatarDisplay from "@/components/shared/AvatarDisplay";
import {AppPagination} from "@/components/common/AppPagination";
import {AccountStatusType} from "@/types/enum/account.status.type.ts";

export default function AdminUsers() {
    // 1. State điều khiển params
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");

    // 2. Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
            setPage(0); // Reset về trang 1 khi search
        }, 500);
        return () => clearTimeout(timer);
    }, [keyword]);

    // 3. Hook React Query
    const {
        data,
        isLoading,
        isPlaceholderData,
        refetch
    } = useAdminUsers({
        page: page,
        size: 10,
        keyword: debouncedKeyword,
        sortBy: "id",
        order: "desc"
    });

    const users = data?.items || [];
    const totalPages = data?.meta?.totalPages || 0;
    const totalItems = data?.meta?.totalItems || 0;

    // 4. Toggle Status
    const handleToggleStatus = async (userId: number, currentStatus: string) => {
        try {
            await adminService.toggleUserStatus(userId);
            // Logic thông báo dựa trên trạng thái hiện tại
            const isBanning = currentStatus === AccountStatusType.ACTIVE;
            toast.success(isBanning ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");
            await refetch();
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Tìm theo tên hoặc email..."
                        className="pl-8"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-md bg-white relative min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 && !isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    Không tìm thấy người dùng nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => {
                                // Xác định trạng thái để render
                                const isActive = user.accountStatus === AccountStatusType.ACTIVE;
                                const isBanned = user.accountStatus === AccountStatusType.BANNED;
                                const isDeactivated = user.accountStatus === AccountStatusType.DEACTIVATED;

                                return (
                                    <TableRow key={user.id} className={isPlaceholderData ? "opacity-50" : ""}>
                                        <TableCell className="flex items-center gap-3">
                                            <AvatarDisplay
                                                src={user.avatarUrl}
                                                fallback={user.displayName?.charAt(0)}
                                                showStatus={true}
                                                userId={user.id}
                                                size={36}
                                            />
                                            <span className="font-medium">{user.displayName}</span>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{user.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {isActive ? (
                                                <Badge className="bg-green-600 hover:bg-green-700">Hoạt động</Badge>
                                            ) : isBanned ? (
                                                <Badge variant="destructive">Đã khóa</Badge>
                                            ) : isDeactivated? (
                                                <Badge className="bg-orange-600 hover:bg-orange-700" >Đã hủy kích hoạt</Badge>
                                            ) : (
                                                <Badge variant="secondary">Không xác định</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant={isActive ? "destructive" : "default"}
                                                onClick={() => handleToggleStatus(user.id, user.accountStatus)}
                                                className="min-w-[80px]"
                                            >
                                                {isActive ? <Lock className="w-4 h-4 mr-1"/> : <Unlock className="w-4 h-4 mr-1"/>}
                                                {isActive ? "Khóa" : "Mở"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
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