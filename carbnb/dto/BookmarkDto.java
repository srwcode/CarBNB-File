package com.project.carbnb.dto;

import java.time.Instant;
import com.project.carbnb.entity.User;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkDto {

    @NotNull(message = "User should not be empty")
    private User user;

    @NotNull(message = "Spot should not be empty")
    private Long spot;

    private String spotName;

    @NotNull(message = "Status should not be empty")
    @Min(value = 1, message = "Invalid status")
    @Max(value = 2, message = "Invalid status")
    private Short status;

    private Instant createdAt;
    private Instant updatedAt;
}