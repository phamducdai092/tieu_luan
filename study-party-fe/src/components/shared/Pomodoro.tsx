// src/components/focus/Pomodoro.tsx
import {useEffect, useMemo, useRef, useState} from "react"
import {Pause, Play, RotateCcw, Timer, Maximize2, Minimize2, ImagePlus, X} from "lucide-react"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import {Button} from "@/components/ui/button"
import usePomodoro from "@/hooks/use-poromodo" // đổi đuôi .ts nếu dự án yêu cầu
import {cn} from "@/lib/utils"

/**
 * Pomodoro — Lofi Chill Edition
 * - Rộng hơn (size: md | lg | xl)
 * - Fullscreen thật (chiếm toàn bộ screen + bỏ max-width khi FS)
 * - Upload ảnh nền (persist localStorage), có ảnh mặc định Unsplash
 * - Overlay dịu, noise nhẹ để giữ tập trung
 */
export default function Pomodoro({
                                     title = "Pomodoro cá nhân",
                                     size = "xl",
                                     className,
                                     defaultBg =
                                         "https://images.unsplash.com/vector-1752947542367-bb88db918ba8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHN0dWR5fGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&q=60&w=500",
                                 }: {
    title?: string
    size?: "md" | "lg" | "xl"
    className?: string
    defaultBg?: string
}) {
    const pomo = usePomodoro()

    // ---- width preset (non-fullscreen) ----
    const widthClass = useMemo(() => {
        switch (size) {
            case "md":
                return "max-w-2xl"
            case "lg":
                return "max-w-4xl"
            default:
                return "max-w-6xl" // xl
        }
    }, [size])

    // ---- Background image (persist) ----
    const [bg, setBg] = useState<string | null>(() => {
        try {
            return localStorage.getItem("pomo.bg") || null
        } catch {
            return null
        }
    })
    // nếu chưa có thì dùng defaultBg (không ghi vào LS ngay để user đổi thì mới lưu)
    const effectiveBg = bg || defaultBg

    const fileRef = useRef<HTMLInputElement>(null)
    const onPickBg = () => fileRef.current?.click()
    const onBgChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            const dataUrl = String(reader.result)
            setBg(dataUrl)
            try {
                localStorage.setItem("pomo.bg", dataUrl)
            } catch {
                console.log("data url:", dataUrl)
            }
        }
        reader.readAsDataURL(file)
    }
    const clearBg = () => {
        setBg(null)
        try {
            localStorage.removeItem("pomo.bg")
        } catch {
            console.log("can not remove local storage item")
        }
    }

    // ---- Fullscreen (fix: remove max-width & stretch 100vh when FS) ----
    const containerRef = useRef<HTMLDivElement>(null)
    const [isFs, setIsFs] = useState(false)
    const toggleFullscreen = async () => {
        const el = containerRef.current
        if (!el) return
        if (!document.fullscreenElement) {
            await el.requestFullscreen().catch(() => {
            })
        } else {
            await document.exitFullscreen().catch(() => {
            })
        }
    }
    useEffect(() => {
        const onFs = () => setIsFs(!!document.fullscreenElement)
        document.addEventListener("fullscreenchange", onFs)
        return () => document.removeEventListener("fullscreenchange", onFs)
    }, [])

    // classes khi fullscreen
    // wrapper class: khi fullscreen thì phủ kín và bỏ padding/margin
    const wrapClass = isFs
        ? "fixed inset-0 w-screen h-screen max-w-none m-0 p-0 overflow-hidden"
        : cn("w-full mx-auto px-4", widthClass)
    const fsCard = isFs ? "h-full rounded-none shadow-none" : "rounded-2xl"
    const fsContent = isFs ? "h-full py-10 md:py-12 lg:py-14" : "py-6"

    return (
        <div ref={containerRef} className={cn(wrapClass, className)}>
            <Card
                className={cn("relative overflow-hidden border-muted/40 bg-transparent", fsCard)}
            >
                {/* Background layer */}
                <div
                    aria-hidden
                    className="absolute inset-0 z-0 transition-all duration-500"
                    style={{
                        backgroundImage: effectiveBg ? `url(${effectiveBg})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        // lofi tone: giảm saturation + contrast nhẹ
                        filter: effectiveBg ? "saturate(0.85) contrast(0.98)" : undefined,
                    }}
                />
                <CardHeader className="pb-2 relative z-20">
                    <div className="flex items-center justify-between gap-3">
                        <CardTitle className="flex items-center gap-2 text-foreground/90">
                            <Timer className="h-5 w-5 text-primary"/>
                            {title}
                        </CardTitle>

                        <div className="flex items-center gap-2">
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onBgChange}/>
                            <Button variant="outline" size="sm" className="gap-2" onClick={onPickBg}>
                                <ImagePlus className="h-4 w-4"/> Ảnh nền
                            </Button>
                            {bg ? (
                                <Button variant="ghost" size="sm" className="gap-2" onClick={clearBg}>
                                    <X className="h-4 w-4"/> Xoá
                                </Button>
                            ) : null}

                            <Button variant="secondary" size="sm" className="gap-2" onClick={toggleFullscreen}>
                                {isFs ? <Minimize2 className="h-4 w-4"/> : <Maximize2 className="h-4 w-4"/>}
                                {isFs ? "Thu nhỏ" : "Toàn màn hình"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className={cn(fsContent, "relative z-20")}>
                    <div className="h-full flex flex-col items-center justify-between gap-8 md:gap-9">
                        {/* Time big & chill */}
                        <div
                            className="bg-background p-4 rounded-xl md:text-7xl lg:text-8xl font-bold tabular-nums tracking-tight drop-shadow-sm">
                            {pomo.leftLabel}
                        </div>

                        <div className="w-full">
                            <Progress value={pomo.percent} className="w-full h-2 bg-muted/60"/>

                            <div className="flex flex-wrap mt-6 items-center justify-center gap-3">
                                {!pomo.running ? (
                                    <Button onClick={pomo.start} className="gap-2 bg-primary/90 hover:bg-primary">
                                        <Play className="h-4 w-4"/> Bắt đầu
                                    </Button>
                                ) : (
                                    <Button onClick={pomo.pause} variant="secondary" className="gap-2">
                                        <Pause className="h-4 w-4"/> Tạm dừng
                                    </Button>
                                )}

                                <Button onClick={() => pomo.reset()} variant="outline" className="gap-2">
                                    <RotateCcw className="h-4 w-4"/> Reset
                                </Button>
                                <Button onClick={pomo.set25} variant="outline">25'</Button>
                                <Button onClick={pomo.set50} variant="outline">50'</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
