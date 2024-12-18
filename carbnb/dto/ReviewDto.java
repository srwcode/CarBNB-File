package com.project.carbnb.dto;

import java.time.Instant;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {

    private Long reviewId;

    @NotNull(message = "User should not be empty")
    private Long user;

    private String username;
    private String firstName;
    private String lastName;
    private String imagePath;

    @NotNull(message = "Reservation should not be empty")
    private Long reservation;

    @NotNull(message = "Status should not be empty")
    @Min(value = 1, message = "Invalid status")
    @Max(value = 3, message = "Invalid status")
    private Short status;

    @NotNull(message = "Rating should not be empty")
    @Min(value = 1, message = "Invalid rating")
    @Max(value = 5, message = "Invalid rating")
    private Short rating;

    private String comment;

    private Instant createdAt;
    private Instant updatedAt;
}