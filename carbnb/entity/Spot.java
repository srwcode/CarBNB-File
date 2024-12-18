package com.project.carbnb.entity;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
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
@Document(collection = "parking_spots")
public class Spot implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("spot_id")
    private Long spotId;

    @Field("user_id")
    private Long user;

    @Field("status")
    private Short status;

    @Field("name")
    private String name;

    @Field("type")
    private Short type;

    @Field("location")
    private String location;

    @Field("address")
    private String address;

    @Field("description")
    private String description;

    @Field("size_width")
    private BigDecimal sizeWidth;

    @Field("size_length")
    private BigDecimal sizeLength;

    @Field("size_height")
    private BigDecimal sizeHeight;

    @Field("image_id")
    private Long imageId;

    @Field("latitude")
    private Double latitude;

    @Field("longitude")
    private Double longitude;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;
}
