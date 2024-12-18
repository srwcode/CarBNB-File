package com.project.carbnb.entity;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="schedules")
public class Schedule implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "spot_id", nullable=false)
    private Long spot;

    @Column(nullable=false, columnDefinition = "NUMERIC(1,0)")
    private Short status;

    @Column(name = "price_per_hour", nullable=false, precision = 9, scale = 2)
    private BigDecimal pricePerHour;

    @Column(name = "minimum_hour")
    private Integer minimumHour;

    @Column(columnDefinition = "NUMERIC(1,0)")
    private Short charger;

    @Column(name = "charger_price", precision = 9, scale = 2)
    private BigDecimal chargerPrice;

    private String description;

    @Column(name = "start_datetime", nullable=false)
    private LocalDateTime startDateTime;

    @Column(name = "end_datetime", nullable=false)
    private LocalDateTime endDateTime;

    @Column(name="created_at", nullable=false, updatable=false)
    private Instant createdAt;

    @Column(name="updated_at", nullable=false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
