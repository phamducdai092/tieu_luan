import { useState, useEffect } from "react";
import {
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteUsers,
    useRTCClient,
    useIsConnected,
    useNetworkQuality
} from "agora-rtc-react";
import { toast } from "sonner";

export function useAgoraCall(
    appId: string,
    channelName: string,
    token: string | null | undefined,
    uid: number | string,
    onLeave?: () => void
) {
    const client = useRTCClient();
    const isConnected = useIsConnected();

    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [screenOn, setScreenOn] = useState(false);
    const [handUp, setHandUp] = useState(false);
    const [time, setTime] = useState(0);
    const networkQuality = useNetworkQuality();

    // Debug Log: Kiểm tra đầu vào
    useEffect(() => {
        if (token) {
            console.log("🔄 [AgoraHook] Nhận tín hiệu Join:", {
                appId, channelName, token, uid,
                uidType: typeof uid,
                ready: !!appId && token !== undefined
            });
        }
    }, [token, appId, channelName, uid]);

    // Điều kiện kích hoạt: Phải có AppID và Token
    const isReadyToCall = !!appId && token !== undefined;

    // 5. Logic Join Room
    const { isLoading: isJoining, error: joinError } = useJoin(
        {
            appid: appId,
            channel: channelName,
            token: token === undefined ? null : token,
            uid: String(uid) // Ép kiểu String
        },
        isReadyToCall // Chỉ chạy khi ready
    );

    // Log trạng thái Join
    useEffect(() => {
        if (isJoining) console.log("⏳ [AgoraHook] Đang kết nối tới server...");
        if (isConnected) console.log("✅ [AgoraHook] Đã vào phòng thành công!");
    }, [isJoining, isConnected]);

    // 6. Tracks
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(isReadyToCall && micOn);
    const { localCameraTrack } = useLocalCameraTrack(isReadyToCall && camOn);

    usePublish([localMicrophoneTrack, localCameraTrack]);
    const remoteUsers = useRemoteUsers();

    // Log Remote Users (Xem có nhận được người khác không)
    useEffect(() => {
        if (remoteUsers.length > 0) {
            console.log("👥 [AgoraHook] Danh sách người dùng trong phòng:", remoteUsers);
        }
    }, [remoteUsers]);

    // Xử lý lỗi
    useEffect(() => {
        if (joinError) {
            console.error("❌ [AgoraHook] Lỗi Join:", joinError);
            toast.error(`Không thể vào phòng: ${joinError.message}`);
            onLeave?.();
        }
    }, [joinError, onLeave]);

    // Timer
    useEffect(() => {
        if (!isConnected) {
            setTime(0);
            return;
        }
        const t = setInterval(() => setTime((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, [isConnected]);

    const mm = String(Math.floor(time / 60)).padStart(2, "0");
    const ss = String(time % 60).padStart(2, "0");

    const getQualityStr = () => {
        const q = networkQuality.uplinkNetworkQuality;
        if (q === 1 || q === 2) return "good";
        if (q === 3 || q === 4) return "fair";
        return "poor";
    };

    return {
        client,
        joined: isConnected,
        isJoining,
        remoteUsers,
        localCameraTrack,
        micOn, camOn, screenOn, handUp,
        quality: getQualityStr(),
        callTime: `${mm}:${ss}`,
        toggleMic: () => setMicOn((prev) => !prev),
        toggleCam: () => setCamOn((prev) => !prev),
        toggleScreen: () => {
            setScreenOn((prev) => !prev);
            toast.info("Tính năng chia sẻ màn hình đang phát triển");
        },
        toggleHand: () => {
            setHandUp((prev) => !prev);
            toast.success(handUp ? "Đã hạ tay" : "Đã giơ tay phát biểu");
        },
        leave: () => {
            setMicOn(false);
            setCamOn(false);
            onLeave?.();
        },
    };
}