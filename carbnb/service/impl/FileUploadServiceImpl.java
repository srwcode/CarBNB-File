package com.project.carbnb.service.impl;

import com.project.carbnb.entity.File;
import com.project.carbnb.entity.User;
import com.project.carbnb.repository.FileRepository;
import com.project.carbnb.service.FileUploadService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    private FileRepository fileRepository;

    public FileUploadServiceImpl(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public Long uploadFile(MultipartFile file, User user) throws IOException {

        String sanitizedFileName = file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_");
        Path path = Paths.get("upload/" + sanitizedFileName);

        // System.out.println(path.toAbsolutePath());
        Files.write(path, file.getBytes());

        File newFile = new File();
        newFile.setUser(user);
        newFile.setName(sanitizedFileName);
        newFile.setPath(path.toString());
        newFile.setStatus((short) 1);
        newFile = fileRepository.save(newFile);
        return newFile.getId();
    }

    public File findById(Long id) {
        File file = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        return file;
    }

}



