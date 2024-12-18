package com.project.carbnb.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import com.project.carbnb.entity.User;
import com.project.carbnb.entity.Schedule;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {

    private Long id;

    @NotNull(message = "User should not be empty")
    private User user;

    @NotNull(message = "Schedule should not be empty")
    private Schedule schedule;

    private Long spotId;
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

    @NotNull(message = "Vehicle should not be empty")
    private Long vehicle;

    private String vehicleType;
    private String vehicleLicensePlate;
    private String vehicleProvince;
    private String vehicleBrand;
    private String vehicleModel;
    private String vehicleColor;

    @NotNull(message = "Status should not be empty")
    @Min(value = 1, message = "Invalid status")
    @Max(value = 4, message = "Invalid status")
    private Short status;

    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;

    @NotEmpty(message = "Reservation datetime should not be empty")
    private String reservationDatetime;

    private String method;
    private BigDecimal amount;
    private String imagePath;

    private Long reviewId;
    private Short reviewRating;
    private String reviewComment;

    private Instant createdAt;
    private Instant updatedAt;
}