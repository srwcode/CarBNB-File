package com.project.carbnb.repository;

import com.project.carbnb.entity.Spot;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface SpotRepository extends MongoRepository<Spot, Long> {
    List<Spot> findByStatusIn(List<Short> statuses, Sort sort);
    List<Spot> findByUserAndStatusIn(Long id, List<Short> statuses, Sort sort);
    List<Spot> findBySpotIdInAndStatusIn(List<Long> bookmarks, List<Short> statuses);
    Optional<Spot> findBySpotId(Long id);
    Optional<Spot> findBySpotIdAndUserAndStatusIn(Long id, Long userId, List<Short> statuses);
}