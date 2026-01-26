import type {IMessage} from "@/types/chat/message.type";
import AvatarDisplay from "@/components/shared/AvatarDisplay";
import {fmtDateTime} from "@/utils/date";
import {FileText, Download, Video} from "lucide-react";
import type {AttachmentResponse} from "@/types/attachment/attachment.type";
import {Button} from "@/components/ui/button.tsx";
import {useRoomContext} from "@/context/GroupContext.ts";

// Helper check file ảnh
const isImage = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
};

export function GroupChatCard({msg, userId, forceEnded}: {
    msg: IMessage;
    userId: number;
    forceEnded: boolean;
}) {
    // 1. Tạo biến an toàn
    const rawSender = msg.sender || {};
    const sender = {
        id: rawSender.id || 0,
        displayName: rawSender.displayName || "Unknown",
        avatarUrl: rawSender.avatarUrl || "",
    };

    const isMe = sender.id === userId;

    // Check an toàn cho attachment
    const hasAttachments = msg.attachments && msg.attachments.length > 0;

    const {onJoinCall} = useRoomContext();

    // 2. Render Video Call
    if (msg.type === "VIDEO_CALL") {
        return (
            <div className="flex w-full justify-center my-4">
                <div
                    className="bg-slate-800 text-white p-4 rounded-xl shadow-lg flex flex-col items-center gap-3 min-w-[280px] border border-slate-700">
                    <div className="flex items-center gap-3 w-full">
                        <div
                            className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center animate-pulse shrink-0">
                            <Video className="w-6 h-6 text-white"/>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-bold text-base">Cuộc gọi video</span>
                            <span className="text-xs text-gray-300 truncate">
                                {isMe ? "Bạn đã bắt đầu cuộc gọi" : `${sender.displayName} đang gọi...`}
                            </span>
                        </div>
                    </div>

                    {!forceEnded && (
                        <Button
                            size="sm"
                            onClick={onJoinCall}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all mt-1"
                        >
                            Tham gia ngay
                        </Button>
                    )}

                    <span className="text-[10px] text-gray-400 w-full text-right">
                        {fmtDateTime(msg.createdAt)}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            key={msg.messageId}
            className={`mb-2 flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
        >
            {/* Avatar người khác */}
            {!isMe && (
                <div className="mb-1">
                    <AvatarDisplay
                        src={sender.avatarUrl}
                        fallback={sender.displayName}
                        size={36}
                        userId={sender.id}
                        showStatus={true}
                    />
                </div>
            )}

            <div className={`flex flex-col max-w-[70%] sm:max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && <span className="text-[10px] text-gray-500 ml-1 mb-0.5">{sender.displayName}</span>}

                <div
                    className={`p-3 rounded-2xl shadow-sm relative group ${
                        isMe
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                    }`}
                >
                    {/* Nội dung Text */}
                    {msg.content && <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>}

                    {/* --- HIỂN THỊ ATTACHMENTS --- */}
                    {hasAttachments && (
                        <div
                            className={`flex flex-col gap-2 ${msg.content ? 'mt-3 pt-2 border-t border-white/20' : ''}`}>
                            {/* FIX: Thêm dấu ? trước .map để tránh lỗi possibly undefined */}
                            {msg.attachments?.map((att: AttachmentResponse, idx: number) => {
                                if (isImage(att.fileName)) {
                                    return (
                                        <div key={idx} className="relative mt-1">
                                            <a href={att.fileUrl} target="_blank" rel="noreferrer">
                                                <img
                                                    src={att.fileUrl}
                                                    alt={att.fileName}
                                                    className="rounded-lg max-h-60 object-cover hover:opacity-90 transition-opacity border border-black/10 bg-black/5"
                                                />
                                            </a>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <a
                                            key={idx}
                                            href={att.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors border ${
                                                isMe
                                                    ? 'bg-blue-700/50 border-blue-500/50 hover:bg-blue-700'
                                                    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-950'
                                            }`}
                                        >
                                            <div
                                                className={`p-2 rounded-full ${isMe ? 'bg-blue-100/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                                <FileText className="h-4 w-4"/>
                                            </div>
                                            <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                                                <span className="text-xs font-semibold truncate" title={att.fileName}>
                                                    {att.fileName}
                                                </span>
                                                <span
                                                    className={`text-[10px] ${isMe ? 'text-blue-100' : 'text-slate-500'}`}>
                                                    Click để tải
                                                </span>
                                            </div>
                                            <Download
                                                className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'text-white' : 'text-slate-500'}`}/>
                                        </a>
                                    );
                                }
                            })}
                        </div>
                    )}

                    {/* Time Stamp */}
                    <div className={`text-[10px] mt-1 text-right w-full ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </div>
                </div>
            </div>
        </div>
    );
}