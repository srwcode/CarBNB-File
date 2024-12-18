package com.project.carbnb.controller.member;

import com.project.carbnb.dto.VehicleDto;
import com.project.carbnb.service.FileUploadService;
import com.project.carbnb.service.VehicleService;
import com.project.carbnb.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("member/vehicles")
public class MemberVehicleController {

    private VehicleService vehicleService;
    private UserService userService;
    private FileUploadService fileUploadService;

    public MemberVehicleController(VehicleService vehicleService, UserService userService, FileUploadService fileUploadService) {
        this.vehicleService = vehicleService;
        this.userService = userService;
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/index")
    public List<VehicleDto> index() {
        return vehicleService.findByUserId(userService.userAuth().getId());
    }

    @PostMapping("/store")
    public ResponseEntity<Boolean> store(
            @RequestPart("vehicle") VehicleDto vehicleDto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        boolean created = false;

        if(vehicleDto.getType() != null &&
            vehicleDto.getLicensePlate() != null &&
            vehicleDto.getBrand() != null &&
            vehicleDto.getModel() != null &&
            vehicleDto.getColor() != null
        ) {
            vehicleDto.setUser(userService.userAuth().getId());
            vehicleDto.setStatus((short) 1);

            Long uploadedFile = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
                } catch (Exception ignored) {}
            }

            if (uploadedFile != null) {
                vehicleDto.setImageId(uploadedFile);
            }

            vehicleService.storeData(vehicleDto);
            created = true;
        }

        return ResponseEntity.ok(created);
    }

    @PostMapping("/show/{id}")
    public VehicleDto show(@PathVariable Long id) {
        return vehicleService.findByIdAndUserId(id, userService.userAuth().getId());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Boolean> update(
            @PathVariable Long id,
            @RequestPart("vehicle") VehicleDto vehicleDto,
            @RequestPart(value = "deleteImage", required = false) String deleteImage,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        VehicleDto vehicle = vehicleService.findById(id);
        boolean updated = false;

        if(vehicleDto.getType() != null &&
            vehicleDto.getLicensePlate() != null &&
            vehicleDto.getBrand() != null &&
            vehicleDto.getModel() != null &&
            vehicleDto.getColor() != null
        ) {
            vehicleDto.setUser(vehicle.getUser());
            vehicleDto.setStatus(vehicle.getStatus());

            if(Objects.equals(deleteImage, "true")) {
                vehicleDto.setImageRemove(1);
            }

            Long uploadedFile = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
                } catch (Exception ignored) {}
            }

            if (uploadedFile != null) {
                vehicleDto.setImageId(uploadedFile);
            }

            vehicleService.updateData(vehicle, vehicleDto);
            updated = true;
        }

        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/remove/{id}")
    public ResponseEntity<Boolean> remove(@PathVariable Long id) {
        boolean removed = false;
        VehicleDto vehicle = vehicleService.findById(id);

        if (vehicle != null && Objects.equals(vehicle.getUser(), userService.userAuth().getId())) {
            vehicleService.removeData(vehicle);
            removed = true;
        }

        return ResponseEntity.ok(removed);
    }
}