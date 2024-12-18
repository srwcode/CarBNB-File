package com.project.carbnb.repository;

import com.project.carbnb.entity.Review;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, Long> {
    List<Review> findByStatusIn(List<Short> statuses, Sort sort);
    List<Review> findByReservationInAndStatusIn(List<Long> reservations, List<Short> statuses, Sort sort);
    Optional<Review> findByReviewId(Long id);
    Optional<Review> findByIdAndReservationInAndStatusIn(Long id, List<Long> reservations, List<Short> statuses);
    Optional<Review> findByReservationAndStatusIn(Long id, List<Short> statuses);
}