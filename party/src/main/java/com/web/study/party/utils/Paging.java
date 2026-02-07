package com.web.study.party.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class Paging {

    // Helper: Parse chuỗi "field,direction" hoặc "field:direction"
    private static Sort parseSortString(String sortStr) {
        if (sortStr == null || sortStr.isBlank()) {
            return Sort.unsorted();
        }

        // Hỗ trợ cả dấu phẩy (URL param) và dấu hai chấm
        String[] parts = sortStr.contains(",") ? sortStr.split(",", 2) : sortStr.split(":", 2);
        String prop = parts[0].trim();

        // Mặc định là DESC
        Sort.Direction dir = Sort.Direction.DESC;

        if (parts.length > 1) {
            String dirStr = parts[1].trim();
            if ("asc".equalsIgnoreCase(dirStr)) {
                dir = Sort.Direction.ASC;
            }
        }
        return Sort.by(dir, prop);
    }

    /**
     * @param page số trang
     * @param size kích thước trang
     * @param sortParam tham số sort từ Client gửi lên (VD: "name,asc")
     * @param defaultSort tham số sort mặc định nếu Client không gửi (VD: "createdAt:desc")
     */
    public static Pageable parsePageable(int page, int size, String sortParam, String defaultSort) {
        String targetSortStr;

        // 1. Ưu tiên lấy của Client gửi lên
        if (sortParam != null && !sortParam.isBlank()) {
            targetSortStr = sortParam;
        }
        // 2. Nếu Client không gửi -> Dùng mặc định do Controller quy định
        else if (defaultSort != null && !defaultSort.isBlank()) {
            targetSortStr = defaultSort;
        }
        // 3. Đường cùng: Không sort gì cả (tránh lỗi crash app)
        else {
            return PageRequest.of(page, size, Sort.unsorted());
        }

        Sort sort = parseSortString(targetSortStr);
        return PageRequest.of(page, size, sort);
    }

    // mặc định là unsorted (hoặc id)
    public static Pageable parsePageable(int page, int size, String sortParam) {
        return parsePageable(page, size, sortParam, null);
    }

    public static String sortString(Sort sort) {
        if (sort == null || sort.isUnsorted()) return "";
        StringBuilder sb = new StringBuilder();
        sort.forEach(o -> {
            if (!sb.isEmpty()) sb.append(",");
            sb.append(o.getProperty()).append(": ").append(o.getDirection().name());
        });
        return sb.toString();
    }
}