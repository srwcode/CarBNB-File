package com.project.carbnb.controller.admin;

import com.project.carbnb.dto.ReservationDto;
import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.dto.UserDto;
import com.project.carbnb.dto.VehicleDto;
import com.project.carbnb.service.ScheduleService;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.ReservationService;
import com.project.carbnb.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
@RequestMapping("admin/reservations")
public class ReservationController {

    private ReservationService reservationService;
    private UserService userService;
    private ScheduleService scheduleService;
    private VehicleService vehicleService;

    public ReservationController(ReservationService reservationService, UserService userService, ScheduleService scheduleService, VehicleService vehicleService) {
        this.reservationService = reservationService;
        this.userService = userService;
        this.scheduleService = scheduleService;
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public String index(Model model) {
        List<ReservationDto> reservations = reservationService.findStatus();
        int count = reservations.size();

        model.addAttribute("reservations", reservations);
        model.addAttribute("count", count);
        model.addAttribute("title", "Reservations");
        model.addAttribute("route", "reservationsIndex");
        return "admin/reservations/index";
    }

    @GetMapping("create")
    public String create(Model model) {
        if (!model.containsAttribute("reservation")) {
            ReservationDto reservation = new ReservationDto();
            model.addAttribute("reservation", reservation);
        }

        List<UserDto> users = userService.findAll();
        List<ScheduleDto> schedules = scheduleService.findAll();
        List<VehicleDto> vehicles = vehicleService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("schedules", schedules);
        model.addAttribute("vehicles", vehicles);
        model.addAttribute("title", "Add Reservation");
        return "admin/reservations/create";
    }

    @PostMapping("store")
    public String store(
            @Valid @ModelAttribute("reservation") ReservationDto reservationDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        String reservationDatetime = reservationDto.getReservationDatetime();

        if (reservationDatetime != null && !reservationDatetime.isEmpty()) {
            String[] dateTimeParts = reservationDatetime.split(" - ");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            LocalDateTime startDateTime = LocalDateTime.parse(dateTimeParts[0], formatter);
            LocalDateTime endDateTime = LocalDateTime.parse(dateTimeParts[1], formatter);

            reservationDto.setStartDateTime(startDateTime);
            reservationDto.setEndDateTime(endDateTime);
        }

        if (reservationDto.getStartDateTime() != null && reservationDto.getEndDateTime() != null) {
            Duration duration = Duration.between(reservationDto.getStartDateTime(), reservationDto.getEndDateTime());

            if (duration.toHours() < 1) {
                result.rejectValue("reservationDatetime", null, "Duration must be at least 1 hour");
            }
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.reservation", result);
            redirectAttributes.addFlashAttribute("reservation", reservationDto);
            return "redirect:/admin/reservations/create";
        }

        reservationService.storeData(reservationDto);
        redirectAttributes.addFlashAttribute("success", "Reservation added successfully");
        return "redirect:/admin/reservations";
    }

    @GetMapping("{id}")
    public String show(@PathVariable Long id, Model model) {
        ReservationDto reservation = reservationService.findById(id);
        model.addAttribute("reservation", reservation);
        model.addAttribute("title", "Reservation Details");
        return "admin/reservations/show";
    }

    @GetMapping("{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("reservation")) {
            ReservationDto reservation = reservationService.findById(id);
            model.addAttribute("reservation", reservation);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            model.addAttribute("formattedStartDateTime", reservation.getStartDateTime().format(formatter));
            model.addAttribute("formattedEndDateTime", reservation.getEndDateTime().format(formatter));
        }

        List<UserDto> users = userService.findAll();
        List<ScheduleDto> schedules = scheduleService.findAll();
        List<VehicleDto> vehicles = vehicleService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("schedules", schedules);
        model.addAttribute("vehicles", vehicles);
        model.addAttribute("title", "Edit Reservation");
        return "admin/reservations/edit";
    }

    @PutMapping("{id}/update")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("reservation") ReservationDto reservationDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        ReservationDto reservation = reservationService.findById(id);

        String reservationDatetime = reservationDto.getReservationDatetime();

        if (reservationDatetime != null && !reservationDatetime.isEmpty()) {
            String[] dateTimeParts = reservationDatetime.split(" - ");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            LocalDateTime startDateTime = LocalDateTime.parse(dateTimeParts[0], formatter);
            LocalDateTime endDateTime = LocalDateTime.parse(dateTimeParts[1], formatter);

            reservationDto.setStartDateTime(startDateTime);
            reservationDto.setEndDateTime(endDateTime);
        }

        if (reservationDto.getStartDateTime() != null && reservationDto.getEndDateTime() != null) {
            Duration duration = Duration.between(reservationDto.getStartDateTime(), reservationDto.getEndDateTime());

            if (duration.toHours() < 1) {
                result.rejectValue("reservationDatetime", null, "Duration must be at least 1 hour");
            }
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.reservation", result);
            redirectAttributes.addFlashAttribute("reservation", reservation);
            return "redirect:/admin/reservations/" + reservation.getId() + "/edit";
        }

        reservationService.updateData(reservation, reservationDto);
        redirectAttributes.addFlashAttribute("success", "Reservation updated successfully");
        return "redirect:/admin/reservations/" + reservation.getId() + "/edit";
    }

    @PatchMapping("{id}/remove")
    public String remove(@PathVariable Long id, @ModelAttribute("reservationRemove") ReservationDto reservationDto, RedirectAttributes redirectAttributes) {
        ReservationDto reservation = reservationService.findById(id);
        reservationService.removeData(reservation);
        redirectAttributes.addFlashAttribute("success", "Reservation removed successfully");
        return "redirect:/admin/reservations";
    }
}
