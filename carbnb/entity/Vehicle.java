package com.project.carbnb.entity;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vehicles")
public class Vehicle implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("vehicle_id")
    private Long vehicleId;

    @Field("user_id")
    private Long user;

    @Field("status")
    private Short status;

    @Field("type")
    private String type;

    @Field("license_plate")
    private String licensePlate;

    @Field("province")
    private String province;

    @Field("brand")
    private String brand;

    @Field("model")
    private String model;

    @Field("color")
    private String color;

    @Field("image_id")
    private Long imageId;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;
}