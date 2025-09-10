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
