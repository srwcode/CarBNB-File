package com.project.carbnb.dto;

import java.math.BigDecimal;
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
public class SpotDto {

    private Long spotId;

    @NotNull(message = "User should not be empty")
    private Long user;

    @NotNull(message = "Status should not be empty")
    @Min(value = 1, message = "Invalid status")
    @Max(value = 3, message = "Invalid status")
    private Short status;

    @NotEmpty(message = "Name should not be empty")
    private String name;

    @NotNull(message = "Type should not be empty")
    @Min(value = 1, message = "Invalid type")
    @Max(value = 2, message = "Invalid type")
    private Short type;

    @NotEmpty(message = "Location should not be empty")
    private String location;

    @NotEmpty(message = "Address should not be empty")
    private String address;

    private String description;

    @NotNull(message = "Width should not be empty")
    @DecimalMin(value = "0.0", inclusive = false, message = "Width must be positive")
    @Digits(integer = 7, fraction = 2, message = "Invalid width")
    private BigDecimal sizeWidth;

    @NotNull(message = "Length should not be empty")
    @DecimalMin(value = "0.0", inclusive = false, message = "Length must be positive")
    @Digits(integer = 7, fraction = 2, message = "Invalid length")
    private BigDecimal sizeLength;

    @DecimalMin(value = "0.0", inclusive = false, message = "Height must be positive")
    @Digits(integer = 7, fraction = 2, message = "Invalid height")
    private BigDecimal sizeHeight;

    private Long imageId;
    private MultipartFile imageFile;
    private Integer imageRemove;
    private String imagePath;

    private Double latitude;
    private Double longitude;

    private String username;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String userImagePath;

    private Instant createdAt;
    private Instant updatedAt;
}