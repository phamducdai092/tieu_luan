import { useRoomChatMessage } from "@/hooks/useRoomChatMessage";
import { getAccess } from "@/lib/token";
import { useLayoutEffect, useRef, useEffect, useState, useMemo } from "react";
import { MessageTypeEnum } from "@/types/chat/message.type";
import useAuthStore from "@/store/auth.store";
import { GroupChatCard } from "@/components/features/group/chat/GroupChatCard";
import { useInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { getGroupMessages } from "@/services/chat.service";
import { Loader2, ArrowDown } from "lucide-react";
import { ChatInput } from "@/components/features/group/chat/ChatInput";
import { useInView } from "react-intersection-observer";

export function GroupChatList({ groupId }: { groupId: number }) {
    const { user } = useAuthStore();
    const token = getAccess();
    const queryClient = useQueryClient();

    // UI Refs
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollBottom, setShowScrollBottom] = useState(false);

    // Ref check scroll top để load more
    const { ref: topObserverRef, inView: isAtTop } = useInView();

    // Ref để track tin nhắn socket cuối cùng đã xử lý
    const lastProcessedMsgIdRef = useRef<number | string | null>(null);

    if (!token) throw new Error("Đăng nhập để sử dụng tính năng chat nhóm.");

    // 1. WebSocket Hook
    const { groupMessages, error, sendMessage } = useRoomChatMessage(groupId);

    // 2. INFINITE QUERY
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["group-message", groupId],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await getGroupMessages(groupId, pageParam, 20);
            return res.data || [];
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length < 20 ? undefined : allPages.length;
        },
        staleTime: Infinity,
    });

    // 3. Flatten Data & DEDUPLICATE
    const messageList = useMemo(() => {
        if (!data) return [];
        const flatList = data.pages.flat();
        const uniqueMessagesMap = new Map();

        flatList.forEach((msg) => {
            if (msg.messageId) {
                uniqueMessagesMap.set(String(msg.messageId), msg);
            } else {
                const tempKey = `${msg.content}-${msg.createdAt}`;
                uniqueMessagesMap.set(tempKey, msg);
            }
        });

        const uniqueList = Array.from(uniqueMessagesMap.values());
        return uniqueList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [data]);

    // 4. Load More Logic
    useEffect(() => {
        if (isAtTop && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isAtTop, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // 5. Handle Realtime Messages
    useEffect(() => {
        if (groupMessages && groupMessages.length > 0) {
            const newestMsg = groupMessages[groupMessages.length - 1];
            if (lastProcessedMsgIdRef.current === newestMsg.messageId) return;
            lastProcessedMsgIdRef.current = newestMsg.messageId;

            queryClient.setQueryData<InfiniteData<any>>(["group-message", groupId], (oldData) => {
                if (!oldData) return oldData;
                const newPages = [...oldData.pages];
                const firstPage = [...newPages[0]];
                const exists = firstPage.some(m => String(m.messageId) === String(newestMsg.messageId));
                if (!exists) {
                    firstPage.unshift(newestMsg);
                    newPages[0] = firstPage;
                }
                return { ...oldData, pages: newPages };
            });

            setTimeout(scrollToBottom, 100);
        }
    }, [groupMessages, groupId, queryClient]);

    // 6. Scroll Handling
    const prevScrollHeightRef = useRef<number>(0);
    const prevMsgCountRef = useRef<number>(0);

    useLayoutEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;
        const currentScrollHeight = container.scrollHeight;
        const currentMsgCount = messageList.length;

        if (prevScrollHeightRef.current > 0 && currentMsgCount > prevMsgCountRef.current) {
            if (isFetchingNextPage) {
                container.scrollTop = currentScrollHeight - prevScrollHeightRef.current;
            }
        }
        else if (prevMsgCountRef.current === 0 && currentMsgCount > 0) {
            container.scrollTop = container.scrollHeight;
        }

        prevScrollHeightRef.current = currentScrollHeight;
        prevMsgCountRef.current = currentMsgCount;
    }, [messageList.length, isFetchingNextPage]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
        }
    };

    const handleSend = async (content: string, files: File[]) => {
        try {
            await sendMessage(
                groupId,
                { content: content, type: MessageTypeEnum.TEXT },
                files
            );
        } catch (err) {
            // Error handling
        }
    };

    let lastVideoCallIndex = -1;
    messageList.forEach((msg, index) => {
        if (msg.type === "VIDEO_CALL") {
            lastVideoCallIndex = index;
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center h-full items-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full relative space-y-4">
            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 flex flex-col overflow-y-auto border rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50 scrollbar-thin"
            >
                {isFetchingNextPage && (
                    <div className="flex justify-center py-2 shrink-0">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>
                    </div>
                )}

                <div ref={topObserverRef} className="h-1 shrink-0"/>

                {error && <div className="text-red-500 text-xs mb-2 text-center">Socket Error: {error}</div>}

                <div className="flex flex-col gap-2 mt-auto">
                    {messageList.map((msg, index) => (
                        <GroupChatCard
                            key={msg.messageId || Math.random()}
                            msg={msg}
                            userId={user!.id}
                            forceEnded={msg.type === "VIDEO_CALL" && index !== lastVideoCallIndex}
                        />
                    ))}
                </div>
            </div>

            {showScrollBottom && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-16 right-6 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-all animate-bounce z-10"
                >
                    <ArrowDown className="h-4 w-4" />
                </button>
            )}
            <div className="shrink-0">
                <ChatInput onSend={handleSend}/>
            </div>
        </div>
    );
}