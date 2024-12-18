package com.project.carbnb.service;

import com.project.carbnb.dto.ReviewDto;
import com.project.carbnb.dto.ReservationDto;
import java.util.List;

public interface ReviewService {
    List<ReviewDto> findAll();
    List<ReviewDto> findStatus();
    List<ReviewDto> findByReservation(List<ReservationDto> reservationDto);
    ReviewDto findById(Long id);
    ReviewDto findByReservationId(Long id);
    ReviewDto findByIdAndReservation(Long id, List<ReservationDto> reservationDto);
    void storeData(ReviewDto reviewDto);
    void updateData(ReviewDto review, ReviewDto reviewDto);
    void removeData(ReviewDto review);
}
