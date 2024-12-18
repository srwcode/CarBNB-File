package com.project.carbnb.service.impl;

import com.project.carbnb.dto.VehicleDto;
import com.project.carbnb.entity.File;
import com.project.carbnb.entity.Vehicle;
import com.project.carbnb.entity.User;
import com.project.carbnb.repository.FileRepository;
import com.project.carbnb.repository.UserRepository;
import com.project.carbnb.repository.VehicleRepository;
import com.project.carbnb.service.VehicleService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleServiceImpl implements VehicleService {

    private VehicleRepository vehicleRepository;
    private UserRepository userRepository;
    private FileRepository fileRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, UserRepository userRepository, FileRepository fileRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
    }

    @Override
    public List<VehicleDto> findAll() {
        List<Vehicle> vehicles = vehicleRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return vehicles.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<VehicleDto> findStatus() {
        List<Vehicle> vehicles = vehicleRepository.findByStatusIn(Arrays.asList((short) 1, (short) 2), Sort.by(Sort.Direction.DESC, "createdAt"));
        return vehicles.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<VehicleDto> findByUserId(Long id) {
        List<Vehicle> vehicles = vehicleRepository.findByUserAndStatusIn(id, Arrays.asList((short) 1), Sort.by(Sort.Direction.DESC, "createdAt"));
        return vehicles.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public VehicleDto findById(Long id) {
        Vehicle vehicle = vehicleRepository.findByVehicleId(id).orElseThrow(() -> new RuntimeException("Vehicle not found"));
        return convertEntityToDto(vehicle);
    }

    @Override
    public VehicleDto findByIdAndUserId(Long id, Long userId) {
        Vehicle vehicle = vehicleRepository.findByVehicleIdAndUserAndStatusIn(id, userId, Arrays.asList((short) 1)).orElseThrow(() -> new RuntimeException("Vehicle not found"));
        return convertEntityToDto(vehicle);
    }

    @Override
    public void storeData(VehicleDto vehicleDto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleId(vehicleRepository.count() + 1);
        vehicle.setUser(vehicleDto.getUser());
        vehicle.setStatus(vehicleDto.getStatus());
        vehicle.setType(vehicleDto.getType());
        vehicle.setLicensePlate(vehicleDto.getLicensePlate());
        vehicle.setProvince(vehicleDto.getProvince());
        vehicle.setBrand(vehicleDto.getBrand());
        vehicle.setModel(vehicleDto.getModel());
        vehicle.setColor(vehicleDto.getColor());
        vehicle.setImageId(vehicleDto.getImageId());
        vehicle.setCreatedAt(Instant.now());
        vehicle.setUpdatedAt(Instant.now());
        vehicleRepository.save(vehicle);
    }

    @Override
    public void updateData(VehicleDto currentVehicle, VehicleDto vehicleDto) {
        Vehicle vehicle = vehicleRepository.findByVehicleId(currentVehicle.getVehicleId()).orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setUser(vehicleDto.getUser());
        vehicle.setStatus(vehicleDto.getStatus());
        vehicle.setType(vehicleDto.getType());
        vehicle.setLicensePlate(vehicleDto.getLicensePlate());
        vehicle.setProvince(vehicleDto.getProvince());
        vehicle.setBrand(vehicleDto.getBrand());
        vehicle.setModel(vehicleDto.getModel());
        vehicle.setColor(vehicleDto.getColor());
        vehicle.setUpdatedAt(Instant.now());

        if (vehicleDto.getImageId() != null) {
            vehicle.setImageId(vehicleDto.getImageId());
        } else if (vehicleDto.getImageRemove() != null && vehicleDto.getImageRemove() == 1) {
            vehicle.setImageId(null);
        }

        vehicleRepository.save(vehicle);
    }

    @Override
    public void removeData(VehicleDto currentVehicle) {
        Vehicle vehicle = vehicleRepository.findByVehicleId(currentVehicle.getVehicleId()).orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setStatus((short) 3);
        vehicle.setUpdatedAt(Instant.now());
        vehicleRepository.save(vehicle);
    }

    private VehicleDto convertEntityToDto(Vehicle vehicle) {
        VehicleDto vehicleDto = new VehicleDto();
        vehicleDto.setVehicleId(vehicle.getVehicleId());
        vehicleDto.setUser(vehicle.getUser());
        vehicleDto.setStatus(vehicle.getStatus());
        vehicleDto.setType(vehicle.getType());
        vehicleDto.setLicensePlate(vehicle.getLicensePlate());
        vehicleDto.setProvince(vehicle.getProvince());
        vehicleDto.setBrand(vehicle.getBrand());
        vehicleDto.setModel(vehicle.getModel());
        vehicleDto.setColor(vehicle.getColor());
        vehicleDto.setImageId(vehicle.getImageId());
        vehicleDto.setCreatedAt(vehicle.getCreatedAt());
        vehicleDto.setUpdatedAt(vehicle.getUpdatedAt());

        User user = userRepository.findById(vehicle.getUser()).orElseThrow(() -> new RuntimeException("User not found"));
        vehicleDto.setUsername(user.getUsername());

        if (vehicle.getImageId() != null) {
            File file = fileRepository.findById(vehicle.getImageId()).orElseThrow(() -> new RuntimeException("File not found"));

            if (file != null) {
                vehicleDto.setImagePath(file.getPath());
            }
        }

        return vehicleDto;
    }
}