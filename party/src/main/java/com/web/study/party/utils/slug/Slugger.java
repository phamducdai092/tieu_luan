package com.web.study.party.utils.slug;

import org.springframework.stereotype.Component;

@Component
public class Slugger {

    /** Tạo slug thuần từ name */
    public String toSlug(String name) {
        return SlugUtils.toSlug(name);
    }

    /** Tạo segment ID- SLUG (ví dụ: 123-lap-trinh-java) */
    public String toIdSlug(long id, String name) {
        return SlugUtils.toIdSlug(id, name);
    }

    /** Parse ID từ {idSlug} */
    public long parseId(String idSlug) {
        return SlugUtils.parseId(idSlug);
    }

    /** Lấy phần slug từ {idSlug} (phục vụ kiểm tra canonical) */
    public String extractSlug(String idSlug) {
        return SlugUtils.extractSlug(idSlug);
    }

    /** Trả về canonical khác biệt để controller redirect 301 nếu người dùng nhập slug cũ/sai */
    public String canonicalIfDifferent(String currentIdSlug, long id, String trueName) {
        return SlugUtils.canonicalOrNull(currentIdSlug, id, trueName);
    }
}
