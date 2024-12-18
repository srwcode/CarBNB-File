package com.project.carbnb.dto;

import java.math.BigDecimal;
import java.time.Instant;
import com.project.carbnb.entity.Reservation;
import com.project.carbnb.entity.User;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {

    private Long id;

    @NotNull(message = "User should not be empty")
    private User user;

    @NotNull(message = "Reservation should not be empty")
    private Reservation reservation;

    @NotNull(message = "Status should not be empty")
    @Min(value = 1, message = "Invalid status")
    @Max(value = 4, message = "Invalid status")
    private Short status;

    @NotNull(message = "Amount should not be empty")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be positive")
    @Digits(integer = 7, fraction = 2, message = "Invalid amount")
    private BigDecimal amount;

    @NotEmpty(message = "Method should not be empty")
    @Size(min = 1, max = 50, message = "Method should be between 1 and 50 characters")
    private String method;

    private Instant createdAt;
    private Instant updatedAt;
}