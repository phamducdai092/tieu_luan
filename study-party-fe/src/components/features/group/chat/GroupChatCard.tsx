import type {IMessage} from "@/types/chat/message.type.ts";
import AvatarDisplay from "@/components/shared/AvatarDisplay.tsx";


export function GroupChatCard({msg, userId}: {
    msg: IMessage;
    userId: number;
}) {

    const isMe = msg.sender.id === userId;

    return (
        <div
            key={msg.messageId}
            className={`mb-2 flex items-center ${isMe ? 'justify-end' : 'justify-start'}`}
        >
            {!isMe && (
                <div className="mr-2">
                    <AvatarDisplay src={msg.sender.avatarUrl} fallback={msg.sender.displayName} size={48}/>
                </div>
            )}
            <div
                className={`p-2 rounded-md max-w-xs ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
                <div className="text-sm">{msg.content}</div>
                <div
                    className={`self-start text-[12px] mt-1 ${isMe ? 'text-white opacity-80' : 'text-gray-500'}`}>{new Date(msg.createdAt).toLocaleTimeString()}</div>
            </div>
        </div>
    )
}