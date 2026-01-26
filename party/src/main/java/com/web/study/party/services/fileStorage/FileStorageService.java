package com.web.study.party.services.fileStorage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * Upload file lên Cloud
     * @param file File nhận từ Controller
     * @param folderName Tên folder con (vd: "tasks/1", "submissions/5")
     * @return URL của file sau khi upload (String)
     */
    String uploadFile(MultipartFile file, String folderName);

    /**
     * Xóa file trên Cloud (Dùng khi update/xóa bài)
     * @param fileUrl URL của file cần xóa
     */
    void deleteFile(String fileUrl);
}