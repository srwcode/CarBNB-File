package com.project.carbnb.service.impl;

import com.project.carbnb.dto.FileDto;
import com.project.carbnb.entity.File;
import com.project.carbnb.repository.FileRepository;
import com.project.carbnb.service.FileService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileServiceImpl implements FileService {

    private FileRepository fileRepository;

    public FileServiceImpl(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Override
    public List<FileDto> findAll() {
        List<File> files = fileRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return files.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<FileDto> findStatus() {
        List<File> files = fileRepository.findByStatusIn(Arrays.asList((short) 1, (short) 2), Sort.by(Sort.Direction.DESC, "createdAt"));
        return files.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public FileDto findById(Long id) {
        File file = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        return convertEntityToDto(file);
    }

    @Override
    public void updateData(FileDto currentFile, FileDto fileDto) {
        File file = fileRepository.findById(currentFile.getId()).orElseThrow(() -> new RuntimeException("File not found"));
        file.setStatus(fileDto.getStatus());
        file.setName(fileDto.getName());
        fileRepository.save(file);
    }

    @Override
    public void removeData(FileDto currentFile) {
        File file = fileRepository.findById(currentFile.getId()).orElseThrow(() -> new RuntimeException("File not found"));
        file.setStatus((short) 3);
        fileRepository.save(file);
    }

    private FileDto convertEntityToDto(File file) {
        FileDto fileDto = new FileDto();
        fileDto.setId(file.getId());
        fileDto.setUser(file.getUser());
        fileDto.setStatus(file.getStatus());
        fileDto.setName(file.getName());
        fileDto.setPath(file.getPath());
        fileDto.setCreatedAt(file.getCreatedAt());
        fileDto.setUpdatedAt(file.getUpdatedAt());
        return fileDto;
    }
}
