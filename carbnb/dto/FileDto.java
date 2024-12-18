package com.project.carbnb.dto;

import java.time.Instant;
import com.project.carbnb.entity.User;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {

    private Long id;

    @NotNull(message = "User should not be empty")
    private User user;

    @NotNull(message = "Status should not be empty")
    @Min(value = 1, message = "Invalid status")
    @Max(value = 3, message = "Invalid status")
    private Short status;

    @NotEmpty(message = "Name should not be empty")
    private String name;

    @NotEmpty(message = "Path should not be empty")
    private String path;

    private Instant createdAt;
    private Instant updatedAt;
}