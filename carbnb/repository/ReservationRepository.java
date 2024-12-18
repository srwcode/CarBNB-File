package com.project.carbnb.repository;

import com.project.carbnb.entity.Reservation;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByStatusIn(List<Short> statuses, Sort sort);
    List<Reservation> findByUserIdAndStatusIn(Long id, List<Short> statuses, Sort sort);
    List<Reservation> findByScheduleIdAndStatusIn(Long id, List<Short> statuses, Sort sort);
    List<Reservation> findByScheduleIdInAndStatusIn(List<Long> schedules, List<Short> statuses, Sort sort);
    Optional<Reservation> findByIdAndUserIdAndStatusIn(Long id, Long userId, List<Short> statuses);
    Optional<Reservation> findByIdAndScheduleIdInAndStatusIn(Long id, List<Long> schedules, List<Short> statuses);
}