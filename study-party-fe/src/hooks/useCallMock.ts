import { useState, useEffect } from "react";

export function useCallMock() {
    const [joined, setJoined] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [screenOn, setScreenOn] = useState(false);
    const [handUp, setHandUp] = useState(false);
    const [quality, setQuality] = useState<"good" | "fair" | "poor">("good");
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (!joined) return;
        const t = setInterval(() => setTime((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, [joined]);

    useEffect(() => {
        const t = setInterval(() => {
            const v = Math.random();
            setQuality(v > 0.8 ? "poor" : v > 0.5 ? "fair" : "good");
        }, 5000);
        return () => clearInterval(t);
    }, []);

    const mm = String(Math.floor(time / 60)).padStart(2, "0");
    const ss = String(time % 60).padStart(2, "0");

    return {
        joined,
        micOn,
        camOn,
        screenOn,
        handUp,
        quality,
        callTime: `${mm}:${ss}`,
        toggleMic: () => setMicOn((s) => !s),
        toggleCam: () => setCamOn((s) => !s),
        toggleScreen: () => setScreenOn((s) => !s),
        toggleHand: () => setHandUp((s) => !s),
        leave: () => setJoined(false),
        join: () => setJoined(true),
    };
}