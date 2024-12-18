package com.project.carbnb.dto;

import java.time.Instant;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {

    private Long vehicleId;

    @NotNull(message = "User should not be empty")
    private Long user;

    private String username;

    @NotNull(message = "Status should not be empty")
    @Min(value = 1, message = "Invalid status")
    @Max(value = 3, message = "Invalid status")
    private Short status;

    @NotEmpty(message = "Type should not be empty")
    private String type;

    @NotEmpty(message = "License Plate should not be empty")
    private String licensePlate;

    @NotEmpty(message = "Province should not be empty")
    private String province;

    @NotEmpty(message = "Brand should not be empty")
    private String brand;

    @NotEmpty(message = "Model should not be empty")
    private String model;

    @NotEmpty(message = "Color should not be empty")
    private String color;

    private Long imageId;
    private MultipartFile imageFile;
    private Integer imageRemove;
    private String imagePath;

    private Instant createdAt;
    private Instant updatedAt;
}