package com.project.carbnb.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

import com.project.carbnb.entity.Spot;
import com.project.carbnb.entity.User;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDto {

    private Long id;

    @NotNull(message = "User should not be empty")
    private User user;

    private String userImagePath;

    @NotNull(message = "Spot should not be empty")
    private Long spot;

    private String spotName;
    private Short spotType;
    private String spotLocation;
    private String spotAddress;
    private String spotDescription;
    private BigDecimal spotSizeWidth;
    private BigDecimal spotSizeLength;
    private BigDecimal spotSizeHeight;
    private String spotImagePath;
    private Double spotLatitude;
    private Double spotLongitude;

    @NotNull(message = "Status should not be empty")
    @Min(value = 1, message = "Invalid status")
    @Max(value = 3, message = "Invalid status")
    private Short status;

    @NotNull(message = "Price per hour should not be empty")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price per hour must be positive")
    @Digits(integer = 7, fraction = 2, message = "Invalid price per hour")
    private BigDecimal pricePerHour;

    @Min(value = 2, message = "Invalid minimum hour")
    @Max(value = 10000, message = "Invalid minimum hour")
    private Integer minimumHour;

    @Max(value = 1, message = "Invalid charger")
    private Short charger;

    @DecimalMin(value = "0.0", inclusive = false, message = "Charger price must be positive")
    @Digits(integer = 7, fraction = 2, message = "Invalid charger price")
    private BigDecimal chargerPrice;

    private String description;

    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    @NotEmpty(message = "Schedule datetime should not be empty")
    private String scheduleDatetime;

    private Float reviews;

    private Instant createdAt;
    private Instant updatedAt;
}