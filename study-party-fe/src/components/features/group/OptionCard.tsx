import React from "react";

export default function OptionCard({
                                       selected,
                                       icon,
                                       title,
                                       desc,
                                   }: {
    selected: boolean
    icon: React.ReactNode
    title: string
    desc: string
}) {
    return (
        <div
            className={[
                "flex items-center w-full gap-3 rounded-2xl border p-4 transition-all",
                "bg-card/50 hover:bg-muted/40",
                "shadow-sm",
                selected ? "ring-2 ring-primary/60 border-transparent" : "border-border",
            ].join(" ")}
        >
            <div className="">{icon}</div>
            <div className="space-y-1">
                <div className="text-sm font-medium leading-none">{title}</div>
                <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
        </div>
    )
}