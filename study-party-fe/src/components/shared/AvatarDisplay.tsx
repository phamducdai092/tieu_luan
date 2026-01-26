import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {usePresenceStore} from "@/store/presence.store.ts";
import {cn} from "@/lib/utils.ts";

type AvatarDisplayProps = {
    src?: string;
    fallback?: string;
    alt?: string;
    size?: number;            // px
    position?: string;        // 'center' | 'top' | '50% 30%' ...
    className?: string;
    userId?: number;
    showStatus?: boolean;
}

const AvatarDisplay = ({
                           src,
                           fallback,
                           alt = "User Avatar",
                           size = 96,
                           position = "center",
                           userId,
                           showStatus = false,
                           className = "",
                       }: AvatarDisplayProps) => {

    const isOnline = usePresenceStore(state =>
        userId ? state.onlineUserIds.has(userId) : false
    );

    console.log("AvatarDisplay - isOnline:", isOnline, "for userId:", userId);

    return (
        <div className="relative inline-block">
            <Avatar
                style={{width: size, height: size}}
                className={`rounded-full overflow-hidden border-2 border-background shadow-md ${className}`}
            >
                <AvatarImage
                    src={src}
                    alt={alt}
                    className="w-full h-full"
                    style={{objectFit: "cover", objectPosition: position}}
                />
                <AvatarFallback
                    className="flex items-center justify-center bg-primary text-primary-foreground font-semibold">
                    {fallback?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
            </Avatar>

            {showStatus && isOnline && (
                <span className={cn(
                    "absolute bottom-0 right-0 block rounded-full ring-2 ring-white bg-green-500",
                    size > 40 ? "h-3.5 w-3.5" : "h-2.5 w-2.5"
                )}/>
            )}
        </div>
    );
};

export default AvatarDisplay;
