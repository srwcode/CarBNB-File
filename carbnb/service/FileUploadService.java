package com.project.carbnb.service;

import com.project.carbnb.entity.File;
import com.project.carbnb.entity.User;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileUploadService {
    File findById(Long id);
    Long uploadFile(MultipartFile file, User user) throws IOException;;
}