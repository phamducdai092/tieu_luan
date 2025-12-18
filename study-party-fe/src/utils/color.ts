import * as L from "lucide-react";
import {FootballIcon} from "@/assets/svg/FootballIcon.tsx";


// String -> stable HSL color + helpers (no deps)
export function stringToHue(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h % 360;
}

export function hsl(h: number, s = 65, l = 45) {
    return `hsl(${h} ${s}% ${l}%)`; // Tailwind v4 dùng space
}

// very tiny parse hsl(h s% l%) -> {h,s,l}
export function parseHsl(hslStr: string) {
    const m = hslStr.match(/hsl\\((\\d+)\\s+(\\d+)%\\s+(\\d+)%\\)/i);
    if (!m) return { h: 0, s: 0, l: 0 };
    return { h: +m[1], s: +m[2], l: +m[3] };
}

export function lighten(hslStr: string, delta = 8) {
    const { h, s, l } = parseHsl(hslStr);
    return `hsl(${h} ${s}% ${Math.min(98, l + delta)}%)`;
}
export function darken(hslStr: string, delta = 10) {
    const { h, s, l } = parseHsl(hslStr);
    return `hsl(${h} ${s}% ${Math.max(2, l - delta)}%)`;
}

// WCAG-ish contrast: pick white/black foreground
export function pickForeground(hslStr: string) {
    const { l } = parseHsl(hslStr);
    return l < 55 ? "#ffffff" : "#111111";
}

// Build CSS variables object for inline style
export function makeTopicVars(base: string) {
    return {
        "--topic-bg": base,
        "--topic-bg-hover": lighten(base, 6),
        "--topic-border": darken(base, 14),
        "--topic-fg": pickForeground(base),
    };
}

// Fallback color for a topic string
export function topicToColor(topic: string) {
    const hue = stringToHue(topic);
    return hsl(hue, 62, 46); // s & l đã test nhìn “study vibes”
}

export const topicColorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-600 ring-blue-200",
    pink: "bg-pink-500/10 text-pink-600 ring-pink-200",
    amber: "bg-amber-500/10 text-amber-600 ring-amber-200",
    violet: "bg-violet-500/10 text-violet-600 ring-violet-200",
    green: "bg-green-500/10 text-green-600 ring-green-200",
    red: "bg-red-500/10 text-red-600 ring-red-200",
    yellow: "bg-yellow-500/10 text-yellow-600 ring-yellow-200",
    purple: "bg-purple-500/10 text-purple-600 ring-purple-200",
    teal: "bg-teal-500/10 text-teal-600 ring-teal-200",
    orange: "bg-orange-500/10 text-orange-600 ring-orange-200",
    cyan: "bg-cyan-500/10 text-cyan-600 ring-cyan-200",
    brown: "bg-amber-800/10 text-amber-900 ring-amber-300",
    lime: "bg-lime-500/10 text-lime-600 ring-lime-200",
    indigo: "bg-indigo-500/10 text-indigo-600 ring-indigo-200",
    gray: "bg-gray-500/10 text-gray-600 ring-gray-200",
    black: "bg-gray-800/10 text-gray-900 ring-gray-300",
    zinc: "bg-zinc-500/10 text-zinc-600 ring-zinc-200",
    rose: "bg-rose-500/10 text-rose-600 ring-rose-200",
};
export const topicIconMap = {
    Code: L.Code,
    Palette: L.Palette,
    Megaphone: L.Megaphone,
    Briefcase: L.Briefcase,
    User: L.User,
    Heart: L.Heart,
    Globe: L.Globe,
    Camera: L.Camera,
    Atom: L.Atom,
    Book: L.Book,
    Map: L.Map,
    Coffee: L.Coffee,
    Gamepad: L.Gamepad2 ?? L.Gamepad, // tuỳ version
    Music: L.Music,
    CameraOff: L.CameraOff,
    Leaf: L.Leaf,
    Users: L.Users,
    DollarSign: L.DollarSign,
    Home: L.Home,
    Star: L.Star,
    Scissors: L.Scissors,
    Trophy: L.Trophy,
    LockOpen: L.LockOpen,
    Lock: L.Lock,
    DoorOpen: L.DoorOpen,
    MailQuestion: L.MailQuestion,
    UserPlus2: L.UserPlus2,
    FootballCustom: FootballIcon,
    MoreHorizontal: L.MoreHorizontal,
    Clock: L.Clock,
    CheckCircle2: L.CheckCircle2,
    CircleX: L.CircleX,
    Ban: L.Ban,
    Hourglass: L.Hourglass,
    Crown: L.Crown,
    Shield: L.Shield,
    UserCircle: L.UserCircle,
} as const;

export type IconKey = keyof typeof topicIconMap;

const iconAlias: Record<string, IconKey> = {
    Football: "FootballCustom",
    Soccer: "FootballCustom",
};
export function getIcon(icon?: string) {
    const key = (iconAlias[icon ?? ""] ?? icon) as IconKey | undefined;
    return (key && topicIconMap[key]) || L.BadgeInfo; // fallback cuối
}