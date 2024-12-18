package com.project.carbnb.repository;

import com.project.carbnb.entity.Payment;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatusIn(List<Short> statuses, Sort sort);
    List<Payment> findByUserIdAndStatusIn(Long id, List<Short> statuses, Sort sort);
    Optional<Payment> findByIdAndUserIdAndStatusIn(Long id, Long userId, List<Short> statuses);
    Optional<Payment> findByReservationId(Long id);
}
