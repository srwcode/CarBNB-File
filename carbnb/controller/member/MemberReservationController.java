package com.project.carbnb.controller.member;

import com.project.carbnb.dto.ReservationDto;
import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.dto.VehicleDto;
import com.project.carbnb.entity.Schedule;
import com.project.carbnb.entity.User;
import com.project.carbnb.service.ReservationService;
import com.project.carbnb.service.ScheduleService;
import com.project.carbnb.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("member/reservations")
public class MemberReservationController {

    private ReservationService reservationService;
    private UserService userService;
    private ScheduleService scheduleService;

    public MemberReservationController(ReservationService reservationService, UserService userService, ScheduleService scheduleService) {
        this.reservationService = reservationService;
        this.userService = userService;
        this.scheduleService = scheduleService;
    }

    @PostMapping("/index")
    public List<ReservationDto> index() {
        List<ScheduleDto> schedules = scheduleService.findByUserId(userService.userAuth().getId());
        return reservationService.findBySchedule(schedules);
    }

    @PostMapping("/list")
    public List<ReservationDto> list() {
        return reservationService.findByUserId(userService.userAuth().getId());
    }

    @PostMapping("/user/{username}")
    public List<ReservationDto> user(@PathVariable String username) {
        User user = userService.findByUsername(username);
        List<ScheduleDto> schedules = scheduleService.findByUserId(user.getId());
        return reservationService.findBySchedule(schedules);
    }

    @PostMapping("/show/{id}")
    public ReservationDto show(@PathVariable Long id) {
        List<ScheduleDto> schedules = scheduleService.findByUserId(userService.userAuth().getId());
        return reservationService.findByIdAndSchedule(id, schedules);
    }

    @PostMapping("/list/show/{id}")
    public ReservationDto showList(@PathVariable Long id) {
        return reservationService.findByIdAndUserId(id, userService.userAuth().getId());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Boolean> update(
            @PathVariable Long id,
            @RequestPart("reservation") ReservationDto reservationDto
    ) {
        ReservationDto reservation = reservationService.findById(id);
        boolean updated = false;

        if(reservationDto.getVehicle() != null) {

            reservationDto.setUser(reservation.getUser());
            reservationDto.setSchedule(reservation.getSchedule());
            reservationDto.setStatus(reservation.getStatus());
            reservationDto.setStartDateTime(reservation.getStartDateTime());
            reservationDto.setEndDateTime(reservation.getEndDateTime());

            reservationService.updateData(reservation, reservationDto);
            updated = true;
        }

        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/remove/{id}")
    public ResponseEntity<Boolean> remove(@PathVariable Long id) {
        boolean removed = false;
        ReservationDto reservation = reservationService.findById(id);

        if (reservation != null) {
            reservationService.cancelData(reservation);
            removed = true;
        }

        return ResponseEntity.ok(removed);
    }

    @PostMapping("/schedule/{id}")
    public List<ReservationDto> schedule(@PathVariable Long id) {
        return reservationService.findByScheduleId(id);
    }

    @PostMapping("/store/{id}")
    public ResponseEntity<Long> store(
            @PathVariable Long id,
            @RequestPart("reservation") ReservationDto reservationDto
    ) {
        long created = 0;

        if(reservationDto.getVehicle() != null &&
            reservationDto.getReservationDatetime() != null
        ) {
            reservationDto.setUser(userService.userAuth());
            reservationDto.setStatus((short) 1);

            Schedule schedule = scheduleService.findByScheduleId(id);
            reservationDto.setSchedule(schedule);

            String reservationDatetime = reservationDto.getReservationDatetime();

            if (reservationDatetime != null && !reservationDatetime.isEmpty()) {
                String[] dateTimeParts = reservationDatetime.split(" - ");

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

                LocalDateTime startDateTime = LocalDateTime.parse(dateTimeParts[0], formatter);
                LocalDateTime endDateTime = LocalDateTime.parse(dateTimeParts[1], formatter);

                reservationDto.setStartDateTime(startDateTime);
                reservationDto.setEndDateTime(endDateTime);
            }

            created = reservationService.saveData(reservationDto);
        }

        return ResponseEntity.ok(created);
    }
}