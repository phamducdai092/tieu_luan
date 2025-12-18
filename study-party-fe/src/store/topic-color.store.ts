import { create } from "zustand";
import { topicToColor } from "@/utils/color.ts";
import type {TopicColorState} from "@/types/group/group.type.ts";

export const useTopicColorStore = create<TopicColorState>((set, get) => ({
    map: {},

    setMany: (entries) =>
        set((s) => {
            const m = { ...s.map };
            for (const { topic, color } of entries) m[topic] = color;
            return { map: m };
        }),

    setOne: (topic, color) =>
        set((s) => ({ map: { ...s.map, [topic]: color } })),

    getColor: (topic) => {
        const { map } = get();
        const c = map[topic];
        return c || topicToColor(topic);
    },
}));
