package com.web.study.party.utils;

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.page.CursorMeta;
import com.web.study.party.dto.page.PageMeta;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public class ResponseUtil {

    public static <T> ResponseEntity<ApiResponse<List<T>>> page(
            List<T> items, PageMeta meta, String message, HttpServletRequest req) {
        var body = ApiResponse.<List<T>>builder()
                .status(200).code("SUCCESS").message(message)
                .path(req.getRequestURI())
                .data(items)
                .meta(meta)
                .build();
        return ResponseEntity.ok(body);
    }

    public static <T> ResponseEntity<ApiResponse<List<T>>> cursor(
            List<T> items, CursorMeta meta, String message, HttpServletRequest req) {
        var body = ApiResponse.<List<T>>builder()
                .status(200).code("SUCCESS").message(message)
                .path(req.getRequestURI())
                .data(items)
                .meta(meta)
                .build();
        return ResponseEntity.ok(body);
    }
}
