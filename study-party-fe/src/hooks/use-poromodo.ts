import {useEffect, useMemo, useState} from "react";

function usePomodoro(initial = 25 * 60) {
    const [total, setTotal] = useState(initial);
    const [left, setLeft] = useState(initial);
    const [running, setRunning] = useState(false);
    useEffect(() => {
        if (!running) return;
        const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(t);
    }, [running]);
    const percent = useMemo(() => (left / total) * 100, [left, total]);
    const mm = Math.floor(left / 60)
        .toString()
        .padStart(2, "0");
    const ss = (left % 60).toString().padStart(2, "0");
    return {
        leftLabel: `${mm}:${ss}`,
        percent,
        running,
        start: () => setRunning(true),
        pause: () => setRunning(false),
        reset: (sec = total) => {
            setRunning(false);
            setTotal(sec);
            setLeft(sec);
        },
        set25: () => {
            const sec = 25 * 60;
            setTotal(sec);
            setLeft(sec);
        },
        set50: () => {
            const sec = 50 * 60;
            setTotal(sec);
            setLeft(sec);
        },
    };
}

export default usePomodoro;