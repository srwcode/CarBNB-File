package com.project.carbnb.service;

import com.project.carbnb.dto.VehicleDto;
import java.util.List;

public interface VehicleService {
    List<VehicleDto> findAll();
    List<VehicleDto> findStatus();
    List<VehicleDto> findByUserId(Long id);
    VehicleDto findById(Long id);
    VehicleDto findByIdAndUserId(Long id, Long userId);
    void storeData(VehicleDto vehicleDto);
    void updateData(VehicleDto vehicle, VehicleDto vehicleDto);
    void removeData(VehicleDto vehicle);
}