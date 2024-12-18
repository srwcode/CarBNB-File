package com.project.carbnb.repository;

import com.project.carbnb.entity.File;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findByStatusIn(List<Short> statuses, Sort sort);
}