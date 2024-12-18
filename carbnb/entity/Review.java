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
@Document(collection = "reviews")
public class Review implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("review_id")
    private Long reviewId;

    @Field("user_id")
    private Long user;

    @Field("reservation_id")
    private Long reservation;

    @Field("status")
    private Short status;

    @Field("rating")
    private Short rating;

    @Field("comment")
    private String comment;

    @Field("created_at")
    private Instant createdAt;

    @Field("updated_at")
    private Instant updatedAt;
}
