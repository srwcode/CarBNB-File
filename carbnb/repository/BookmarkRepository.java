package com.project.carbnb.repository;

import com.project.carbnb.entity.Bookmark;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByStatusIn(List<Short> statuses, Sort sort);
    List<Bookmark> findByUserIdAndStatusIn(Long id, List<Short> statuses, Sort sort);
    Optional<Bookmark> findByUserIdAndSpot(Long userId, Long spotId);
}