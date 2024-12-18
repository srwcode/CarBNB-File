package com.project.carbnb.entity;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

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
@Table(name="bookmarks")
@IdClass(Bookmark.BookmarkId.class)
public class Bookmark implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @Column(name="spot_id", nullable=false)
    private Long spot;

    @Column(nullable=false, columnDefinition = "NUMERIC(1,0)")
    private Short status;

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

    public static class BookmarkId implements Serializable {

        private Long user;
        private Long spot;

        public BookmarkId() {}

        public BookmarkId(Long user, Long spot) {
            this.user = user;
            this.spot = spot;
        }
    }
}
