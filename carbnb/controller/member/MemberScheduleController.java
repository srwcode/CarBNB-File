package com.project.carbnb.controller.member;

import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.entity.User;
import com.project.carbnb.service.ScheduleService;
import com.project.carbnb.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("member/schedules")
public class MemberScheduleController {

    private ScheduleService scheduleService;
    private UserService userService;

    public MemberScheduleController(ScheduleService scheduleService, UserService userService) {
        this.scheduleService = scheduleService;
        this.userService = userService;
    }

    @PostMapping("/index")
    public List<ScheduleDto> index() {
        return scheduleService.findByUserId(userService.userAuth().getId());
    }

    @PostMapping("/search")
    public List<ScheduleDto> search() {
        return scheduleService.findStatus();
    }

    @PostMapping("/display/{id}")
    public ScheduleDto display(@PathVariable Long id) {
        return scheduleService.findById(id);
    }

    @PostMapping("/user/{username}")
    public List<ScheduleDto> user(@PathVariable String username) {
        User user = userService.findByUsername(username);
        return scheduleService.findByUserId(user.getId());
    }

    @PostMapping("/spot/{id}")
    public List<ScheduleDto> spot(@PathVariable Long id) {
        return scheduleService.findBySpotId(id);
    }

    @PostMapping("/store")
    public ResponseEntity<Boolean> store(
            @RequestPart("schedule") ScheduleDto scheduleDto
    ) {
        boolean created = false;

        if(scheduleDto.getSpot() != null &&
            scheduleDto.getScheduleDatetime() != null &&
            scheduleDto.getPricePerHour() != null
        ) {
            scheduleDto.setUser(userService.userAuth());
            scheduleDto.setStatus((short) 1);

            String scheduleDatetime = scheduleDto.getScheduleDatetime();

            if (scheduleDatetime != null && !scheduleDatetime.isEmpty()) {
                String[] dateTimeParts = scheduleDatetime.split(" - ");

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

                LocalDateTime startDateTime = LocalDateTime.parse(dateTimeParts[0], formatter);
                LocalDateTime endDateTime = LocalDateTime.parse(dateTimeParts[1], formatter);

                scheduleDto.setStartDateTime(startDateTime);
                scheduleDto.setEndDateTime(endDateTime);
            }

            if(scheduleDto.getMinimumHour() != null && scheduleDto.getMinimumHour() == 1) {
                scheduleDto.setMinimumHour(null);
            }

            scheduleService.storeData(scheduleDto);
            created = true;
        }

        return ResponseEntity.ok(created);
    }

    @PostMapping("/show/{id}")
    public ScheduleDto show(@PathVariable Long id) {
        return scheduleService.findByIdAndUserId(id, userService.userAuth().getId());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Boolean> update(
            @PathVariable Long id,
            @RequestPart("schedule") ScheduleDto scheduleDto
    ) {
        ScheduleDto schedule = scheduleService.findById(id);
        boolean updated = false;

        if(scheduleDto.getSpot() != null &&
            scheduleDto.getScheduleDatetime() != null &&
            scheduleDto.getPricePerHour() != null
        ) {
            scheduleDto.setUser(schedule.getUser());
            scheduleDto.setStatus(schedule.getStatus());

            String scheduleDatetime = scheduleDto.getScheduleDatetime();

            if (scheduleDatetime != null && !scheduleDatetime.isEmpty()) {
                String[] dateTimeParts = scheduleDatetime.split(" - ");

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

                LocalDateTime startDateTime = LocalDateTime.parse(dateTimeParts[0], formatter);
                LocalDateTime endDateTime = LocalDateTime.parse(dateTimeParts[1], formatter);

                scheduleDto.setStartDateTime(startDateTime);
                scheduleDto.setEndDateTime(endDateTime);
            }

            if(scheduleDto.getMinimumHour() != null && scheduleDto.getMinimumHour() == 1) {
                scheduleDto.setMinimumHour(null);
            }

            scheduleService.updateData(schedule, scheduleDto);
            updated = true;
        }

        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/remove/{id}")
    public ResponseEntity<Boolean> remove(@PathVariable Long id) {
        boolean removed = false;
        ScheduleDto schedule = scheduleService.findById(id);

        if (schedule != null && Objects.equals(schedule.getUser().getId(), userService.userAuth().getId())) {
            scheduleService.removeData(schedule);
            removed = true;
        }

        return ResponseEntity.ok(removed);
    }
}