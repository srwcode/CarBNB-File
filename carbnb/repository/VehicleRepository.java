package com.project.carbnb.repository;

import com.project.carbnb.entity.Vehicle;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends MongoRepository<Vehicle, Long> {
    List<Vehicle> findByStatusIn(List<Short> statuses, Sort sort);
    List<Vehicle> findByUserAndStatusIn(Long id, List<Short> statuses, Sort sort);
    Optional<Vehicle> findByVehicleId(Long id);
    Optional<Vehicle> findByVehicleIdAndUserAndStatusIn(Long id, Long userId, List<Short> statuses);
}