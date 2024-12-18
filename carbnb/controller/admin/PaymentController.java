package com.project.carbnb.controller.admin;

import com.project.carbnb.dto.ReservationDto;
import com.project.carbnb.dto.UserDto;
import com.project.carbnb.dto.PaymentDto;
import com.project.carbnb.service.ReservationService;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;
import java.util.Objects;

@Controller
@RequestMapping("admin/payments")
public class PaymentController {

    private PaymentService paymentService;
    private UserService userService;
    private ReservationService reservationService;

    public PaymentController(PaymentService paymentService, UserService userService, ReservationService reservationService) {
        this.paymentService = paymentService;
        this.userService = userService;
        this.reservationService = reservationService;
    }

    @GetMapping
    public String index(Model model) {
        List<PaymentDto> payments = paymentService.findStatus();
        int count = payments.size();

        model.addAttribute("payments", payments);
        model.addAttribute("count", count);
        model.addAttribute("title", "Payments");
        model.addAttribute("route", "paymentsIndex");
        return "admin/payments/index";
    }

    @GetMapping("create")
    public String create(Model model) {
        if (!model.containsAttribute("payment")) {
            PaymentDto payment = new PaymentDto();
            model.addAttribute("payment", payment);
        }

        List<UserDto> users = userService.findAll();
        List<ReservationDto> reservations = reservationService.findAll();

        List<Long> reservationsExisting = paymentService.findAll().stream()
                .map(payment -> payment.getReservation().getId())
                .toList();

        List<ReservationDto> reservationsUnique = reservations.stream()
                .filter(reservation -> !reservationsExisting.contains(reservation.getId()))
                .toList();

        model.addAttribute("users", users);
        model.addAttribute("reservations", reservationsUnique);
        model.addAttribute("title", "Add Payment");
        return "admin/payments/create";
    }

    @PostMapping("store")
    public String store(
            @Valid @ModelAttribute("payment") PaymentDto paymentDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        if (paymentDto.getReservation() != null) {
            ReservationDto reservation = reservationService.findById(paymentDto.getReservation().getId());
            if (!Objects.equals(paymentDto.getUser().getId(), reservation.getUser().getId())) {
                result.rejectValue("reservation", null, "Selected reservation does not belong to the chosen user");
            }
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.payment", result);
            redirectAttributes.addFlashAttribute("payment", paymentDto);
            return "redirect:/admin/payments/create";
        }

        paymentService.storeData(paymentDto);
        redirectAttributes.addFlashAttribute("success", "Payment added successfully");
        return "redirect:/admin/payments";
    }

    @GetMapping("{id}")
    public String show(@PathVariable Long id, Model model) {
        PaymentDto payment = paymentService.findById(id);
        model.addAttribute("payment", payment);
        model.addAttribute("title", "Payment Details");
        return "admin/payments/show";
    }

    @GetMapping("{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("payment")) {
            PaymentDto payment = paymentService.findById(id);
            model.addAttribute("payment", payment);
        }

        List<UserDto> users = userService.findAll();
        List<ReservationDto> reservations = reservationService.findAll();

        List<Long> reservationsExisting = paymentService.findAll().stream()
                .map(payment -> payment.getReservation().getId())
                .toList();

        List<ReservationDto> reservationsUnique = reservations.stream()
                .filter(reservation -> !reservationsExisting.contains(reservation.getId()))
                .toList();

        model.addAttribute("users", users);
        model.addAttribute("reservations", reservationsUnique);
        model.addAttribute("title", "Edit Payment");
        return "admin/payments/edit";
    }

    @PutMapping("{id}/update")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("payment") PaymentDto paymentDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {
        PaymentDto payment = paymentService.findById(id);

        if (paymentDto.getReservation() != null) {
            ReservationDto reservation = reservationService.findById(paymentDto.getReservation().getId());
            if (!Objects.equals(paymentDto.getUser().getId(), reservation.getUser().getId())) {
                result.rejectValue("reservation", null, "Selected reservation does not belong to the chosen user");
            }
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.payment", result);
            redirectAttributes.addFlashAttribute("payment", payment);
            return "redirect:/admin/payments/" + payment.getId() + "/edit";
        }

        paymentService.updateData(payment, paymentDto);
        redirectAttributes.addFlashAttribute("success", "Payment updated successfully");
        return "redirect:/admin/payments/" + payment.getId() + "/edit";
    }

    @PatchMapping("{id}/remove")
    public String remove(@PathVariable Long id, @ModelAttribute("paymentRemove") PaymentDto paymentDto, RedirectAttributes redirectAttributes) {
        PaymentDto payment = paymentService.findById(id);
        paymentService.removeData(payment);
        redirectAttributes.addFlashAttribute("success", "Payment removed successfully");
        return "redirect:/admin/payments";
    }
}
