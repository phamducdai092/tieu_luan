package com.web.study.party.services.fileStorage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.web.study.party.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryStorageServiceImpl implements FileStorageService {

    private final Cloudinary cloudinary;

    // Tên folder gốc trên Cloudinary để dễ quản lý
    private static final String ROOT_FOLDER = "study-party"; 

    @Override
    public String uploadFile(MultipartFile file, String subFolder) {
        try {
            String fileNameWithoutExt = getString(file);

            String publicId = UUID.randomUUID() + "_" + fileNameWithoutExt;

            // 2. Tạo đường dẫn folder: study-party/tasks/1
            String fullFolderPath = ROOT_FOLDER + "/" + subFolder;

            // 3. Config tham số upload
            Map params = ObjectUtils.asMap(
                "folder", fullFolderPath,
                "public_id", publicId,
                "resource_type", "auto" // QUAN TRỌNG: Để nó tự nhận diện pdf, docx, img, video
            );

            // 4. Gọi Cloudinary Upload
            // file.getBytes() chuyển MultipartFile thành byte array
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

            // 5. Trả về Secure URL (https)
            return (String) uploadResult.get("secure_url");

        } catch (IOException e) {
            log.error("Cloudinary Upload Error: {}", e.getMessage());
            throw new BusinessException("Lỗi khi upload file lên server: " + e.getMessage());
        }
    }

    @Nullable
    private static String getString(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException("File không được rỗng");
        }

        // 1. Tạo tên file unique (UUID)
        // Ví dụ: file gốc "bai-tap.pdf" -> lưu thành "abcd-1234-xyz_bai-tap" (bỏ đuôi .pdf vì Cloudinary tự thêm)
        String originalFilename = file.getOriginalFilename();
        return originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(0, originalFilename.lastIndexOf("."))
                : originalFilename;
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) return;
        
        try {
            // Cần lấy Public ID từ URL để xóa
            String publicId = extractPublicIdFromUrl(fileUrl);
            if (publicId != null) {
                // Determine resource type based on extension or URL structure is tricky
                // Defaulting to "image" or "raw" might be needed based on your logic
                // Ở đây t để auto detect hoặc loop qua các type nếu cần kỹ
                
                // Thử xóa với type mặc định (image/raw/video)
                cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
                cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "raw"));
                cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "video"));
                
                log.info("Deleted file on Cloudinary: {}", publicId);
            }
        } catch (Exception e) {
            log.error("Delete file error: {}", e.getMessage());
            // Không throw exception để tránh rollback transaction chính
        }
    }

    // Helper: Trích xuất Public ID từ URL
    // URL: https://res.cloudinary.com/.../upload/v1234/study-party/tasks/1/file-name.pdf
    // Public ID: study-party/tasks/1/file-name
    private String extractPublicIdFromUrl(String url) {
        try {
            int uploadIdx = url.indexOf("upload/");
            if (uploadIdx == -1) return null;
            
            // Cắt từ sau chữ "upload/"
            String path = url.substring(uploadIdx + 7);
            
            // Bỏ version (v123456/) nếu có
            if (path.startsWith("v") && path.indexOf("/") > 0) {
                path = path.substring(path.indexOf("/") + 1);
            }
            
            // Bỏ extension cuối cùng (.pdf, .jpg)
            int dotIdx = path.lastIndexOf(".");
            if (dotIdx > 0) {
                path = path.substring(0, dotIdx);
            }
            
            // Decode URL nếu có ký tự đặc biệt (khoảng trắng %20...)
            return java.net.URLDecoder.decode(path, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return null;
        }
    }
}