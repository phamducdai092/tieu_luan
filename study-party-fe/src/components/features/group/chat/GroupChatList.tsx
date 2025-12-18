import {useRoomChatMessage} from "@/hooks/useRoomChatMessage.ts";
import {getAccess} from "@/lib/token.ts";
import {useLayoutEffect, useRef, useState, useEffect} from "react";
import {type IMessage, MessageTypeEnum} from "@/types/chat/message.type.ts";
import {toast} from "sonner";
import useAuthStore from "@/store/auth.store.ts";
import {GroupChatCard} from "@/components/features/group/chat/GroupChatCard.tsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getGroupMessages} from "@/services/chat.service.ts";
import {Loader2} from "lucide-react";
import {ChatInput} from "@/components/features/group/chat/ChatInput.tsx";

export function GroupChatList({groupId}: { groupId: number }) {
    const {user} = useAuthStore();
    const token = getAccess();
    const queryClient = useQueryClient();

    if (!token) {
        throw new Error("Đăng nhập để sử dụng tính năng chat nhóm.");
    }

    // 1. Hook WebSocket chỉ làm nhiệm vụ "nghe"
    // Lưu ý: Nếu hook này trả về 1 mảng dồn tích, ta cần lấy phần tử cuối cùng
    const {groupMessages, error, sendMessage} = useRoomChatMessage(groupId, token);

    // REF này phải gắn vào thằng cha (Container), không phải thằng con
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // 2. React Query quản lý state chính (Lịch sử + Realtime)
    const {data: messageList = [], isLoading: loading} = useQuery({
        queryKey: ["group-message", groupId],
        queryFn: async () => {
            const res = await getGroupMessages(groupId);
            return res.data || [];
        },
        staleTime: Infinity, // 🔥 Set Infinity để không tự fetch lại khi cache đã update thủ công
        gcTime: 1000 * 60 * 10,
    });

    // 3. 🔥 ĐỒNG BỘ: WebSocket -> React Query Cache
    // Mỗi khi `groupMessages` (từ socket) thay đổi, ta nhét nó vào `messageList`
    useEffect(() => {
        if (groupMessages && groupMessages.length > 0) {
            // Lấy tin nhắn mới nhất từ Socket
            const rawMsg = groupMessages[groupMessages.length - 1];

            // 🔥 BƯỚC QUAN TRỌNG: Vá lỗi ID null
            // Nếu không có ID, tự bịa ra một cái ID dựa trên thời gian để React không bị loạn key
            const newSocketMsg = {
                ...rawMsg,
                messageId: rawMsg.messageId || (Date.now() + Math.random())
            };

            console.log("🔥 PROCESSING SOCKET MSG:", newSocketMsg);

            queryClient.setQueryData(["group-message", groupId], (oldData: IMessage[] | undefined) => {
                const currentList = oldData || [];

                // Check trùng lặp: Chỉ so sánh nếu ID CHÍNH THỨC trùng nhau
                // Nếu là ID tự chế (số lớn do Date.now) thì coi như là tin mới luôn
                const exists = currentList.some(msg => {
                    // Nếu cả 2 đều có ID xịn thì so sánh
                    if (msg.messageId && newSocketMsg.messageId) {
                        return String(msg.messageId) === String(newSocketMsg.messageId);
                    }
                    return false;
                });

                if (exists) {
                    console.log("⚠️ Message already exists in Cache");
                    return currentList;
                }

                console.log("✅ Adding new message to Cache");
                return [...currentList, newSocketMsg];
            });
        }
    }, [groupMessages, groupId, queryClient]);


    // 4. Auto Scroll (Logic cũ của bạn, áp dụng cho list đã merge)
    useLayoutEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            const lastMsg = messageList[messageList.length - 1];
            const isMyMsg = lastMsg?.sender.id === user?.id;
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

            if (isNearBottom || isMyMsg) {
                // Timeout nhỏ để đảm bảo React đã render DOM xong mới cuộn
                setTimeout(() => {
                    container.scrollTop = container.scrollHeight;
                }, 100);
            }
        }
    }, [messageList, user?.id]); // 🔥 Theo dõi messageList chứ không phải groupMessages


    const handleSend = async (content: string) => {

        try {
            // Gửi qua WebSocket (hoặc API)
            await sendMessage(groupId, {content: content, type: MessageTypeEnum.TEXT});

            // ⚠️ Lưu ý:
            // Nếu WebSocket của bạn có cơ chế "Echo" (Gửi xong Server bắn lại tin đó về):
            // -> Thì không cần update cache ở đây, useEffect ở trên sẽ lo.

            // Nếu WebSocket KHÔNG Echo lại cho người gửi (chỉ gửi cho người khác):
            // -> Thì bạn cần tự tạo tin nhắn giả (Optimistic Update) và nhét vào cache ở đây.

            /* Ví dụ Optimistic Update (nếu cần):
            const tempMsg: IMessage = {
                messageId: Date.now(), // ID tạm
                content: tempContent,
                senderId: user!.id,
                // ... các trường khác
            };
            queryClient.setQueryData(["group-message", groupId], (old: any) => [...old, tempMsg]);
            */

        } catch (err) {
            toast.error("Gửi lỗi. Vui lòng thử lại.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div
                ref={chatContainerRef}
                className="flex flex-col h-60 overflow-y-auto border rounded-md p-3 bg-white scroll-smooth"
            >
                {error && (
                    <div className="text-red-500 text-sm mb-2">Lỗi Socket: {error}</div>
                )}

                {/* Render List duy nhất từ React Query */}
                {messageList.map((msg) => (
                    // Không cần truyền ref xuống con nữa, trừ khi cần xử lý riêng
                    <GroupChatCard
                        key={msg.messageId || Math.random()}
                        msg={msg}
                        userId={user!.id}
                    />
                ))}
            </div>

            <ChatInput onSend={handleSend}/>
        </div>
    );
}