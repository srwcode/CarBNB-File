package com.project.carbnb.controller.admin;

import com.project.carbnb.dto.PaymentDto;
import com.project.carbnb.dto.ReviewDto;
import com.project.carbnb.dto.ReservationDto;
import com.project.carbnb.dto.UserDto;
import com.project.carbnb.service.ReservationService;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;
import java.util.Objects;

@Controller
@RequestMapping("admin/reviews")
public class ReviewController {

    private ReviewService reviewService;
    private UserService userService;
    private ReservationService reservationService;

    public ReviewController(ReviewService reviewService, UserService userService, ReservationService reservationService) {
        this.reviewService = reviewService;
        this.userService = userService;
        this.reservationService = reservationService;
    }

    @GetMapping
    public String index(Model model) {
        List<ReviewDto> reviews = reviewService.findStatus();
        int count = reviews.size();

        model.addAttribute("reviews", reviews);
        model.addAttribute("count", count);
        model.addAttribute("title", "Reviews");
        model.addAttribute("route", "reviewsIndex");
        return "admin/reviews/index";
    }

    @GetMapping("create")
    public String create(Model model) {
        if (!model.containsAttribute("review")) {
            ReviewDto review = new ReviewDto();
            model.addAttribute("review", review);
        }

        List<UserDto> users = userService.findAll();
        List<ReservationDto> reservations = reservationService.findAll();

        List<Long> reservationsExisting = reviewService.findAll().stream()
                .map(ReviewDto::getReservation)
                .toList();

        List<ReservationDto> reservationsUnique = reservations.stream()
                .filter(reservation -> !reservationsExisting.contains(reservation.getId()))
                .toList();

        model.addAttribute("users", users);
        model.addAttribute("reservations", reservationsUnique);
        model.addAttribute("title", "Add Review");
        return "admin/reviews/create";
    }

    @PostMapping("store")
    public String store(
            @Valid @ModelAttribute("review") ReviewDto reviewDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        if (reviewDto.getReservation() != null) {
            ReservationDto reservation = reservationService.findById(reviewDto.getReservation());
            if (!Objects.equals(reviewDto.getUser(), reservation.getUser().getId())) {
                result.rejectValue("reservation", null, "Selected reservation does not belong to the chosen user");
            }
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.review", result);
            redirectAttributes.addFlashAttribute("review", reviewDto);
            return "redirect:/admin/reviews/create";
        }

        reviewService.storeData(reviewDto);
        redirectAttributes.addFlashAttribute("success", "Review added successfully");
        return "redirect:/admin/reviews";
    }

    @GetMapping("{id}")
    public String show(@PathVariable Long id, Model model) {
        ReviewDto review = reviewService.findById(id);
        model.addAttribute("review", review);
        model.addAttribute("title", "Review Details");
        return "admin/reviews/show";
    }

    @GetMapping("{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("review")) {
            ReviewDto review = reviewService.findById(id);
            model.addAttribute("review", review);
        }

        List<UserDto> users = userService.findAll();
        List<ReservationDto> reservations = reservationService.findAll();

        List<Long> reservationsExisting = reviewService.findAll().stream()
                .map(ReviewDto::getReservation)
                .toList();

        List<ReservationDto> reservationsUnique = reservations.stream()
                .filter(reservation -> !reservationsExisting.contains(reservation.getId()))
                .toList();

        model.addAttribute("users", users);
        model.addAttribute("reservations", reservationsUnique);
        model.addAttribute("title", "Edit Review");
        return "admin/reviews/edit";
    }

    @PutMapping("{id}/update")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("review") ReviewDto reviewDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        ReviewDto review = reviewService.findById(id);

        if (reviewDto.getReservation() != null) {
            ReservationDto reservation = reservationService.findById(reviewDto.getReservation());
            if (!Objects.equals(reviewDto.getUser(), reservation.getUser().getId())) {
                result.rejectValue("reservation", null, "Selected reservation does not belong to the chosen user");
            }
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.review", result);
            redirectAttributes.addFlashAttribute("review", review);
            return "redirect:/admin/reviews/" + review.getReviewId() + "/edit";
        }

        reviewService.updateData(review, reviewDto);
        redirectAttributes.addFlashAttribute("success", "Review updated successfully");
        return "redirect:/admin/reviews/" + review.getReviewId() + "/edit";
    }

    @PatchMapping("{id}/remove")
    public String remove(@PathVariable Long id, @ModelAttribute("reviewRemove") ReviewDto reviewDto, RedirectAttributes redirectAttributes) {
        ReviewDto review = reviewService.findById(id);
        reviewService.removeData(review);
        redirectAttributes.addFlashAttribute("success", "Review removed successfully");
        return "redirect:/admin/reviews";
    }
}
