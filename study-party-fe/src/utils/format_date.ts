
export const fmtDateTime = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(d);
};

export const initials = (name: string | undefined) => {
    if (!name) return "";
    const parts = name.split(" ").filter(Boolean);
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? "").join("");
};