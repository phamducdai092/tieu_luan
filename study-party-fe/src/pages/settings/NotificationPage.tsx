import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {Loader2, MailOpen, UserPlus, Check, X} from "lucide-react";

// Components
import {JoinRequestCard} from "@/components/features/group/JoinRequestCard.tsx";
import {AppPagination} from "@/components/common/AppPagination.tsx";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"; // 👈 Import Tabs Shadcn

// Hooks & Services
import {useJoinRequests} from "@/hooks/useJoinRequests";
import {useInvitations, invitationKeys} from "@/hooks/useInvitations";
import {inviteService} from "@/services/invite.service.ts";
import {useEnumStore} from "@/store/enum.store.ts";
import type {EnumItem} from "@/types/enum.type.ts";
import type {InvitationResponse} from "@/types/group/invitation.type.ts";
import type {JoinRequestForUser} from "@/types/group/join_request.type.ts";
import {fmtDateTime} from "@/utils/date.ts";

export default function NotificationsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --- STATE ---
    // Không cần state activeTab nữa vì Tabs của Shadcn tự quản lý
    const [pageRequests, setPageRequests] = useState(0);
    const [pageInvites, setPageInvites] = useState(0);

    const requestStatus: EnumItem[] = useEnumStore().get("RequestStatus");

    // ================== 1. DATA FETCHING ==================

    const {
        data: requestsData,
        isLoading: isLoadingRequests
    } = useJoinRequests({
        page: pageRequests,
        size: 5
    });

    const {
        data: invitesData,
        isLoading: isLoadingInvites
    } = useInvitations({
        page: pageInvites,
        size: 5,
        status: 'PENDING'
    });

    // ================== 2. MUTATIONS ==================

    const acceptInviteMutation = useMutation({
        mutationFn: (token: string) => inviteService.acceptInvite(token),
        onSuccess: () => {
            toast.success("Đã tham gia nhóm thành công!");
            queryClient.invalidateQueries({queryKey: invitationKeys.all});
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Có lỗi xảy ra")
    });

    const declineInviteMutation = useMutation({
        mutationFn: (token: string) => inviteService.declineInvite(token),
        onSuccess: () => {
            toast.info("Đã từ chối lời mời.");
            queryClient.invalidateQueries({queryKey: invitationKeys.all});
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Có lỗi xảy ra")
    });

    const handleCancelRequest = (id: number) => {
        toast.info(`Tính năng hủy yêu cầu ${id} đang phát triển`);
    };

    // Helper tính số lượng an toàn (Fix lỗi undefined)
    const requestCount = requestsData?.meta?.totalItems ?? 0;
    const inviteCount = invitesData?.meta?.totalItems ?? 0;

    console.log(
        'requestsData, invitesData', requestsData, invitesData
    )

    // ================== 3. UI RENDERING ==================

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Thông báo & Lời mời</h1>
                    <p className="text-muted-foreground">Quản lý các yêu cầu tham gia và lời mời vào nhóm.</p>
                </div>
            </div>

            {/* 👇 DÙNG SHADCN TABS */}
            <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="requests" className="gap-2">
                        <UserPlus className="w-4 h-4"/>
                        Yêu cầu đã gửi
                        {requestCount > 0 && (
                            <Badge variant="secondary" className="ml-1">{requestCount}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="invites" className="gap-2">
                        <MailOpen className="w-4 h-4"/>
                        Lời mời nhận được
                        {inviteCount > 0 && (
                            <Badge variant="secondary" className="ml-1">{inviteCount}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* --- TAB 1: REQUESTS --- */}
                <TabsContent value="requests"
                             className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {isLoadingRequests ? (
                        <LoadingSkeleton/>
                    ) : (requestsData?.items?.length ?? 0) === 0 ? (
                        <EmptyState message="Bạn chưa gửi yêu cầu tham gia nhóm nào."/>
                    ) : (
                        <div className="grid gap-4">
                            {/* Ép kiểu item là any hoặc type chuẩn nếu có */}
                            {requestsData?.items?.map((item: JoinRequestForUser) => (
                                <JoinRequestCard
                                    key={item.joinRequestResponse.requestId}
                                    requestStatus={requestStatus.find(e => e.code === item.joinRequestResponse.status)}
                                    data={item}
                                    onCancel={handleCancelRequest}
                                    onView={(slug) => navigate(`/rooms/${slug}`)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {requestsData?.meta && (
                        <AppPagination
                            page={requestsData.meta.page}
                            totalPages={requestsData.meta.totalPages}
                            totalItems={requestsData.meta.totalItems}
                            onPageChange={setPageRequests}
                        />
                    )}
                </TabsContent>

                {/* --- TAB 2: INVITATIONS --- */}
                <TabsContent value="invites"
                             className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {isLoadingInvites ? (
                        <LoadingSkeleton/>
                    ) : (invitesData?.items?.length ?? 0) === 0 ? (
                        <EmptyState message="Hiện không có lời mời tham gia nhóm nào."/>
                    ) : (
                        <div className="grid gap-4">
                            {invitesData?.items?.map((invite: InvitationResponse) => (
                                <InvitationCard
                                    key={invite.id}
                                    invite={invite}
                                    onAccept={(token) => acceptInviteMutation.mutate(token)}
                                    onDecline={(token) => declineInviteMutation.mutate(token)}
                                    isProcessing={acceptInviteMutation.isPending || declineInviteMutation.isPending}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {invitesData?.meta && (
                        <AppPagination
                            page={invitesData.meta.page}
                            totalPages={invitesData.meta.totalPages}
                            totalItems={invitesData.meta.totalItems}
                            onPageChange={setPageInvites}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

// --- SUB COMPONENTS ---

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse"/>
            ))}
        </div>
    );
}

function EmptyState({message}: { message: string }) {
    return (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50/50">
            <p className="text-muted-foreground">{message}</p>
        </div>
    );
}

// Định nghĩa props để tránh lỗi any
interface InvitationCardProps {
    invite: InvitationResponse;
    onAccept: (token: string) => void;
    onDecline: (token: string) => void;
    isProcessing: boolean;
}

function InvitationCard({invite, onAccept, onDecline, isProcessing}: InvitationCardProps) {
    return (
        <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <MailOpen className="w-6 h-6"/>
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                        Lời mời tham gia nhóm <span className="text-blue-600">"{invite.groupName}"</span>
                    </h3>
                    <div className="text-sm text-muted-foreground flex gap-2 items-center">
                        <span>Từ: <strong>{invite.inviter.displayName}</strong></span>
                        <span>•</span>
                        <span>{fmtDateTime(invite.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <Button
                    variant="outline"
                    className="flex-1 md:flex-none gap-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    onClick={() => onDecline(invite.token)}
                    disabled={isProcessing}
                >
                    <X className="w-4 h-4"/> Từ chối
                </Button>
                <Button
                    className="flex-1 md:flex-none gap-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onAccept(invite.token)}
                    disabled={isProcessing}
                >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
                    Chấp nhận
                </Button>
            </div>
        </div>
    )
}