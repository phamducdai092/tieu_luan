import {useEffect, useState} from "react";
import {getJoinRequestsByUser} from "@/services/join_request.service.ts";
import type {EnumItem} from "@/types/enum.type.ts";
import {useEnumStore} from "@/store/enum.store.ts";
import {toast} from "sonner";
import type {JoinRequestForUser} from "@/types/group/join_request.type.ts";
import type {ApiError} from "@/types/api.type.ts";
import type {PagingResponse} from "@/types/paging.type.ts";
import {useNavigate} from "react-router-dom";
import {JoinRequestCard} from "@/components/features/group/JoinRequestCard.tsx";
import {AppPagination} from "@/components/common/AppPagination.tsx";


export default function NotificationsPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError[] | null>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [joinRequests, setJoinRequests] = useState<JoinRequestForUser[]>([]);
    const [paging, setPaging] = useState<PagingResponse | null>(null);

    // filtering
    const requestStatus: EnumItem[] = useEnumStore().get("RequestStatus");

    const nav = useNavigate();

    const handleCancelRequest = (id: number) => {
        console.log("Cancel request:", id);
        // Gọi API cancel ở đây
        toast.info("Tính năng hủy đang phát triển");
    };

    const handleViewRoom = (slug: string) => {
        nav(`/rooms/${slug}`);
    };

    useEffect(() => {
        const fetchJoinRequests = async () => {
            try {
                setLoading(true);
                const response = await getJoinRequestsByUser();
                setJoinRequests(response.data || []);
                setPaging(response.meta || null);
                setError([]);
            } catch (err: any) {
                setError(err?.fieldErrors);
            } finally {
                setLoading(false);
            }
        };
        fetchJoinRequests();
    }, [currentPage]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Header Page */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Lịch sử yêu cầu tham gia</h1>
                <p className="text-muted-foreground">Theo dõi trạng thái các yêu cầu tham gia nhóm của bạn.</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse"/>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && joinRequests.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Bạn chưa gửi yêu cầu tham gia nhóm nào.</p>
                </div>
            )}

            {/* List */}
            <div className="grid gap-4">
                {joinRequests.map((item) => (
                    <JoinRequestCard
                        requestStatus={requestStatus.find(e => e.code === item.joinRequestResponse.status)}
                        key={item.joinRequestResponse.requestId}
                        data={item}
                        onCancel={handleCancelRequest}
                        onView={handleViewRoom}
                    />
                ))}
            </div>

            <AppPagination
                page={paging?.page || 0}
                totalPages={paging?.totalPages || 0}
                totalItems={paging?.totalItems}
                onPageChange={(p) => setCurrentPage(p)}
            />
        </div>
    );
}