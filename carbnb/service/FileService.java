package com.project.carbnb.service;

import com.project.carbnb.dto.FileDto;

import java.util.List;

public interface FileService {
    List<FileDto> findAll();
    List<FileDto> findStatus();
    FileDto findById(Long id);
    void updateData(FileDto file, FileDto fileDto);
    void removeData(FileDto file);
}
