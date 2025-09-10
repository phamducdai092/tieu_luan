import {Badge} from "@/components/ui/badge";
import {makeTopicVars} from "@/utils/color";
import {useTopicColorStore} from "@/store/group/topicColorStore";
import type {TopicProps} from "@/types/group.type.ts";
import React from "react";

export default function TopicBadge({topic, color, className, size = "md"}: TopicProps) {
    const getColor = useTopicColorStore((s) => s.getColor);
    const final = color || getColor(topic);
    const style = makeTopicVars(final);

    return (
        <Badge
            // Tailwind v4: dùng CSS vars
            className={[
                "bg-[--topic-bg] text-[--topic-fg] border border-[--topic-border] hover:bg-[--topic-bg-hover] transition-colors",
                size === "sm" ? "text-xs py-0.5 px-2 rounded-md" : "text-sm py-1 px-2.5 rounded-lg",
                className || ""
            ].join(" ")}
            style={style as React.CSSProperties}
        >
            {topic}
        </Badge>
    );
}
