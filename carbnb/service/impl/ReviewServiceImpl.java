package com.project.carbnb.service.impl;

import com.project.carbnb.dto.ReviewDto;
import com.project.carbnb.dto.ReservationDto;
import com.project.carbnb.entity.File;
import com.project.carbnb.entity.Review;
import com.project.carbnb.entity.User;
import com.project.carbnb.repository.FileRepository;
import com.project.carbnb.repository.ReviewRepository;
import com.project.carbnb.repository.UserRepository;
import com.project.carbnb.service.ReviewService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private ReviewRepository reviewRepository;
    private UserRepository userRepository;
    private FileRepository fileRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, UserRepository userRepository, FileRepository fileRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
    }

    @Override
    public List<ReviewDto> findAll() {
        List<Review> reviews = reviewRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return reviews.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<ReviewDto> findStatus() {
        List<Review> reviews = reviewRepository.findByStatusIn(Arrays.asList((short) 1, (short) 2), Sort.by(Sort.Direction.DESC, "createdAt"));
        return reviews.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<ReviewDto> findByReservation(List<ReservationDto> reservationDto) {
        List<Long> reservations = reservationDto.stream().map(ReservationDto::getId).collect(Collectors.toList());
        List<Review> reviews = reviewRepository.findByReservationInAndStatusIn(reservations, Arrays.asList((short) 1), Sort.by(Sort.Direction.DESC, "createdAt"));
        return reviews.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public ReviewDto findById(Long id) {
        Review review = reviewRepository.findByReviewId(id).orElseThrow(() -> new RuntimeException("Review not found"));
        return convertEntityToDto(review);
    }

    @Override
    public ReviewDto findByReservationId(Long id) {
        Optional<Review> reviewOptional = reviewRepository.findByReservationAndStatusIn(id, Arrays.asList((short) 1));

        return reviewOptional.map(this::convertEntityToDto).orElse(null);

    }

    @Override
    public ReviewDto findByIdAndReservation(Long id, List<ReservationDto> reservationDto) {
        List<Long> reservations = reservationDto.stream().map(ReservationDto::getId).collect(Collectors.toList());
        Review review = reviewRepository.findByIdAndReservationInAndStatusIn(id, reservations, Arrays.asList((short) 1)).orElseThrow(() -> new RuntimeException("Review not found"));
        return convertEntityToDto(review);
    }

    @Override
    public void storeData(ReviewDto reviewDto) {
        Review review = new Review();
        review.setReviewId(reviewRepository.count() + 1);
        review.setUser(reviewDto.getUser());
        review.setReservation(reviewDto.getReservation());
        review.setStatus(reviewDto.getStatus());
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        review.setCreatedAt(Instant.now());
        review.setUpdatedAt(Instant.now());
        reviewRepository.save(review);
    }

    @Override
    public void updateData(ReviewDto currentReview, ReviewDto reviewDto) {
        Review review = reviewRepository.findByReviewId(currentReview.getReviewId()).orElseThrow(() -> new RuntimeException("Review not found"));
        review.setUser(reviewDto.getUser());
        review.setReservation(reviewDto.getReservation());
        review.setStatus(reviewDto.getStatus());
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        review.setUpdatedAt(Instant.now());
        reviewRepository.save(review);
    }

    @Override
    public void removeData(ReviewDto currentReview) {
        Review review = reviewRepository.findByReviewId(currentReview.getReviewId()).orElseThrow(() -> new RuntimeException("Review not found"));
        review.setStatus((short) 3);
        reviewRepository.save(review);
    }

    private ReviewDto convertEntityToDto(Review review) {
        User user = userRepository.findById(review.getUser()).orElseThrow(() -> new RuntimeException("User not found"));

        ReviewDto reviewDto = new ReviewDto();
        reviewDto.setReviewId(review.getReviewId());
        reviewDto.setUser(review.getUser());
        reviewDto.setReservation(review.getReservation());
        reviewDto.setStatus(review.getStatus());
        reviewDto.setRating(review.getRating());
        reviewDto.setComment(review.getComment());
        reviewDto.setCreatedAt(review.getCreatedAt());
        reviewDto.setUpdatedAt(review.getUpdatedAt());

        reviewDto.setUsername(user.getUsername());
        reviewDto.setFirstName(user.getFirstName());
        reviewDto.setLastName(user.getLastName());

        if (user.getImageId() != null) {
            File file = fileRepository.findById(user.getImageId()).orElseThrow(() -> new RuntimeException("File not found"));

            if (file != null) {
                reviewDto.setImagePath(file.getPath());
            }
        }

        return reviewDto;
    }
}