package com.web.study.party.exeption;

import com.web.study.party.dto.response.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1) @Valid trên @RequestBody (DTO) => MethodArgumentNotValidException
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError<Void>> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpServletRequest req) {

        var errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> new ApiError.FieldError(
                        fe.getField(),
                        fe.getDefaultMessage(),
                        fe.getRejectedValue()))
                .collect(Collectors.toList());

        var body = ApiError.<Void>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .code("VALIDATION_ERROR")
                .message("Validation failed")
                .path(req.getRequestURI())
                .fieldErrors(errors)
                .build();

        return ResponseEntity.badRequest().body(body);
    }

    // 2) @Validated trên @RequestParam/@PathVariable => ConstraintViolationException
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError<Void>> handleConstraintViolation(
            ConstraintViolationException ex, HttpServletRequest req) {

        var errors = ex.getConstraintViolations().stream()
                .map(cv -> new ApiError.FieldError(
                        extractParamName(cv), // ví dụ: "age" từ "register.arg0.age" hoặc "age"
                        cv.getMessage(),
                        cv.getInvalidValue()))
                .collect(Collectors.toList());

        var body = ApiError.<Void>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .code("VALIDATION_ERROR")
                .message("Validation failed")
                .path(req.getRequestURI())
                .fieldErrors(errors)
                .build();

        return ResponseEntity.badRequest().body(body);
    }

    // 3) Body JSON sai format
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError<Void>> handleNotReadable(
            HttpMessageNotReadableException ex, HttpServletRequest req) {
        var body = ApiError.<Void>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .code("BAD_REQUEST")
                .message("Malformed JSON request")
                .path(req.getRequestURI())
                .build();
        return ResponseEntity.badRequest().body(body);
    }

    // 4) Kiểu dữ liệu path/param sai (e.g. id=abc nhưng cần Long)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError<Void>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest req) {
        var body = ApiError.<Void>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .code("TYPE_MISMATCH")
                .message("Parameter type mismatch: " + ex.getName())
                .path(req.getRequestURI())
                .fieldError(new ApiError.FieldError(ex.getName(), "Invalid type", ex.getValue()))
                .build();
        return ResponseEntity.badRequest().body(body);
    }

    // 5) AuthN/AuthZ
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError<Void>> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest req) {
        var body = ApiError.<Void>builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .code("UNAUTHORIZED")
                .message("Invalid email or password")
                .path(req.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError<Void>> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest req) {
        var body = ApiError.<Void>builder()
                .status(HttpStatus.FORBIDDEN.value())
                .code("FORBIDDEN")
                .message("Access denied")
                .path(req.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    // 6) Method not allowed
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError<Void>> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex, HttpServletRequest req) {
        var body = ApiError.<Void>builder()
                .status(HttpStatus.METHOD_NOT_ALLOWED.value())
                .code("METHOD_NOT_ALLOWED")
                .message("Method not allowed")
                .path(req.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(body);
    }

    // 7) BindException (thường cho @ModelAttribute)
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiError<Void>> handleBindException(
            BindException ex, HttpServletRequest req) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> new ApiError.FieldError(fe.getField(), fe.getDefaultMessage(), fe.getRejectedValue()))
                .collect(Collectors.toList());
        var body = ApiError.<Void>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .code("VALIDATION_ERROR")
                .message("Validation failed")
                .path(req.getRequestURI())
                .fieldErrors(errors)
                .build();
        return ResponseEntity.badRequest().body(body);
    }

    // 8) BusinessException của riêng app (tuỳ teo định nghĩa)
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError<Void>> handleBusiness(
            BusinessException ex, HttpServletRequest req) {
        var status = ex.getStatus() != null ? ex.getStatus() : HttpStatus.BAD_REQUEST;
        var body = ApiError.<Void>builder()
                .status(status.value())
                .code(ex.getCode() != null ? ex.getCode() : "BUSINESS_ERROR")
                .message(ex.getMessage())
                .path(req.getRequestURI())
                .build();
        return ResponseEntity.status(status).body(body);
    }

    // 9) Chốt hạ: lỗi chưa bắt
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError<Void>> handleAll(
            Exception ex, HttpServletRequest req) {
        var body = ApiError.<Void>builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .code("INTERNAL_ERROR")
                .message("Something went wrong")
                .path(req.getRequestURI())
                .build();
        // TODO: log ex đầy đủ (stacktrace) vào logger
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    private String extractParamName(ConstraintViolation<?> cv) {
        // cv.getPropertyPath() => "register.arg0.email" / "email" ... tuỳ case
        var path = cv.getPropertyPath().toString();
        if (path.contains(".")) {
            return path.substring(path.lastIndexOf('.') + 1);
        }
        return path;
    }
}
