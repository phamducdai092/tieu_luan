package com.web.study.party.utils.slug;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public final class SlugUtils {
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
    private static final Pattern DASHES = Pattern.compile("-{2,}");

    private SlugUtils() {
    }

    /**
     * Tạo slug từ name: bỏ dấu, thường hóa, thay khoảng trắng -> '-'
     */
    public static String toSlug(String input) {
        if (input == null || input.isBlank()) return "n-a";
        // Normalize: bỏ dấu tiếng Việt, ký tự tổ hợp
        String nowhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        slug = slug.replaceAll("đ", "d").replaceAll("Đ", "D"); // quick fix riêng tiếng Việt
        slug = slug.toLowerCase(Locale.ROOT);
        slug = DASHES.matcher(slug).replaceAll("-");
        slug = slug.replaceAll("^-|-$", ""); // trim đầu/cuối
        return slug.isEmpty() ? "n-a" : slug;
    }

    /**
     * Kết hợp ID + slug thành 1 segment: 42-lap-trinh-java
     */
    public static String toIdSlug(long id, String name) {
        return id + "-" + toSlug(name);
    }

    /**
     * Lấy ID từ "{id}-{slug}" — ví dụ "42-lap-trinh-java" -> 42
     */
    public static long parseId(String idSlug) {
        if (idSlug == null || idSlug.isBlank()) throw new IllegalArgumentException("idSlug is blank");
        int dash = idSlug.indexOf('-');
        String idPart = dash > 0 ? idSlug.substring(0, dash) : idSlug;
        try {
            return Long.parseLong(idPart);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid idSlug: " + idSlug);
        }
    }

    /**
     * Lấy phần slug (sau ID) — "42-lap-trinh-java" -> "lap-trinh-java", không có thì trả ""
     */
    public static String extractSlug(String idSlug) {
        if (idSlug == null) return "";
        int dash = idSlug.indexOf('-');
        return (dash > 0 && dash + 1 < idSlug.length()) ? idSlug.substring(dash + 1) : "";
    }

    /**
     * So sánh slug hiện tại với slug chuẩn → nếu khác thì trả về slug chuẩn để redirect
     */
    public static String canonicalOrNull(String currentIdSlug, long id, String trueName) {
        String canonical = toIdSlug(id, trueName);
        return canonical.equals(currentIdSlug) ? null : canonical;
    }
}
