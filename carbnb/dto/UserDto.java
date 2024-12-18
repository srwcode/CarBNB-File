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
public class UserDto {

    private Long id;

    @NotEmpty(message = "Username should not be empty")
    @Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9-_]{3,29}$",
            message = "Username should start with a letter, be between 4 and 30 characters long, and can include letters, numbers, hyphens, and underscores")
    private String username;

    @NotEmpty(message = "Email should not be empty")
    @Email(message = "Email should be valid")
    private String email;

    // @NotEmpty(message = "Password should not be empty")
    // @Size(min = 6, max = 100, message = "Password should be between 6 and 100 characters")
    private String password;

    private String confirmPassword;

    private String currentPassword;

    @NotNull(message = "Status should not be empty")
    @Min(value = 1, message = "Invalid status")
    @Max(value = 3, message = "Invalid status")
    private Short status;

    @NotEmpty(message = "Role should not be empty")
    private String role;

    @NotEmpty(message = "First name should not be empty")
    @Size(min = 1, max = 50, message = "First name should be between 1 and 50 characters")
    private String firstName;

    @NotEmpty(message = "Last name should not be empty")
    @Size(min = 1, max = 50, message = "Last name should be between 1 and 50 characters")
    private String lastName;

    private Long imageId;
    private MultipartFile imageFile;
    private Integer imageRemove;
    private String imagePath;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$|^$", message = "Phone number should be valid")
    private String phoneNumber;

    @DecimalMin(value = "0.0", inclusive = true, message = "Balance must be positive or zero")
    @Digits(integer = 7, fraction = 2, message = "Invalid balance")
    private BigDecimal balance;

    private Instant createdAt;
    private Instant updatedAt;
}