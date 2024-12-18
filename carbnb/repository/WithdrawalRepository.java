package com.project.carbnb.repository;

import com.project.carbnb.entity.Withdrawal;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    List<Withdrawal> findByStatusIn(List<Short> statuses, Sort sort);
    List<Withdrawal> findByUserIdAndStatusIn(Long id, List<Short> statuses, Sort sort);
    Optional<Withdrawal> findByIdAndUserIdAndStatusIn(Long id, Long userId, List<Short> statuses);
}
