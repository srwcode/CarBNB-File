package com.project.carbnb.controller.member;

import com.project.carbnb.dto.ReviewDto;
import com.project.carbnb.dto.ReservationDto;
import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.service.ReviewService;
import com.project.carbnb.service.ReservationService;
import com.project.carbnb.service.ScheduleService;
import com.project.carbnb.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("member/reviews")
public class MemberReviewController {

    private ReviewService reviewService;
    private UserService userService;
    private ReservationService reservationService;
    private ScheduleService scheduleService;

    public MemberReviewController(ReviewService reviewService, UserService userService, ReservationService reservationService, ScheduleService scheduleService) {
        this.reviewService = reviewService;
        this.userService = userService;
        this.reservationService = reservationService;
        this.scheduleService = scheduleService;
    }

    @PostMapping("/index")
    public List<ReviewDto> index() {
        List<ScheduleDto> schedules = scheduleService.findByUserId(userService.userAuth().getId());
        List<ReservationDto> reservations = reservationService.findBySchedule(schedules);
        return reviewService.findByReservation(reservations);
    }

    @PostMapping("/schedule/{id}")
    public List<ReviewDto> schedule(@PathVariable Long id) {
        ScheduleDto schedule = scheduleService.findById(id);
        List<ReservationDto> reservations = reservationService.findByScheduleId(schedule.getId());
        return reviewService.findByReservation(reservations);
    }

    @PostMapping("/show/{id}")
    public ReviewDto show(@PathVariable Long id) {
        ReviewDto review = reviewService.findByReservationId(id);

        if (review == null) {
            review = new ReviewDto();
        }
        
        return review;
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<Integer> update(
            @PathVariable Long id,
            @RequestPart("review") ReviewDto reviewDto
    ) {
        ReviewDto review = reviewService.findByReservationId(id);
        int updated = 0;

        if(reviewDto.getRating() != null) {

            if(review != null) {
                reviewDto.setUser(review.getUser());
                reviewDto.setStatus(review.getStatus());
                reviewDto.setReservation(review.getReservation());
                reviewService.updateData(review, reviewDto);
                updated = 2;
            } else {
                reviewDto.setUser(userService.userAuth().getId());
                reviewDto.setStatus((short) 1);
                reviewDto.setReservation(id);
                reviewService.storeData(reviewDto);
                updated = 1;
            }
        }

        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/remove/{id}")
    public ResponseEntity<Boolean> remove(@PathVariable Long id) {
        boolean removed = false;
        ReviewDto review = reviewService.findByReservationId(id);

        if (review != null && Objects.equals(review.getUser(), userService.userAuth().getId())) {
            reviewService.removeData(review);
            removed = true;
        }

        return ResponseEntity.ok(removed);
    }
}