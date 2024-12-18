package com.project.carbnb.repository;

import com.project.carbnb.entity.Schedule;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByStatusIn(List<Short> statuses, Sort sort);
    List<Schedule> findByUserIdAndStatusIn(Long id, List<Short> statuses, Sort sort);
    List<Schedule> findBySpotAndStatusIn(Long id, List<Short> statuses, Sort sort);
    Optional<Schedule> findByIdAndUserIdAndStatusIn(Long id, Long userId, List<Short> statuses);
}