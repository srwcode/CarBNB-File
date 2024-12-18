package com.project.carbnb.repository;

import com.project.carbnb.entity.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUsername(String username);
    List<User> findByStatusIn(List<Short> statuses, Sort sort);
}
