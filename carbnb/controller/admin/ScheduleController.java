package com.project.carbnb.controller.admin;

import com.project.carbnb.dto.SpotDto;
import com.project.carbnb.dto.UserDto;
import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.service.SpotService;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.ScheduleService;
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
import java.util.Objects;

@Controller
@RequestMapping("admin/schedules")
public class ScheduleController {

    private ScheduleService scheduleService;
    private UserService userService;
    private SpotService spotService;

    public ScheduleController(ScheduleService scheduleService, UserService userService, SpotService spotService) {
        this.scheduleService = scheduleService;
        this.userService = userService;
        this.spotService = spotService;
    }

    @GetMapping
    public String index(Model model) {
        List<ScheduleDto> schedules = scheduleService.findStatus();
        int count = schedules.size();

        model.addAttribute("schedules", schedules);
        model.addAttribute("count", count);
        model.addAttribute("title", "Schedules");
        model.addAttribute("route", "schedulesIndex");
        return "admin/schedules/index";
    }

    @GetMapping("create")
    public String create(Model model) {
        if (!model.containsAttribute("schedule")) {
            ScheduleDto schedule = new ScheduleDto();
            model.addAttribute("schedule", schedule);
        }

        List<UserDto> users = userService.findAll();
        List<SpotDto> spots = spotService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("spots", spots);
        model.addAttribute("title", "Add Schedule");
        return "admin/schedules/create";
    }

    @PostMapping("store")
    public String store(
            @Valid @ModelAttribute("schedule") ScheduleDto scheduleDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        String scheduleDatetime = scheduleDto.getScheduleDatetime();

        if (scheduleDatetime != null && !scheduleDatetime.isEmpty()) {
            String[] dateTimeParts = scheduleDatetime.split(" - ");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            LocalDateTime startDateTime = LocalDateTime.parse(dateTimeParts[0], formatter);
            LocalDateTime endDateTime = LocalDateTime.parse(dateTimeParts[1], formatter);

            scheduleDto.setStartDateTime(startDateTime);
            scheduleDto.setEndDateTime(endDateTime);
        }

        if (scheduleDto.getStartDateTime() != null && scheduleDto.getEndDateTime() != null) {
            Duration duration = Duration.between(scheduleDto.getStartDateTime(), scheduleDto.getEndDateTime());

            if (duration.toHours() < 1) {
                result.rejectValue("scheduleDatetime", null, "Duration must be at least 1 hour");
            }
        }

        if (scheduleDto.getSpot() != null) {
            SpotDto spot = spotService.findById(scheduleDto.getSpot());
            if (!Objects.equals(scheduleDto.getUser().getId(), spot.getUser())) {
                result.rejectValue("spot", null, "Selected spot does not belong to the chosen user");
            }
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.schedule", result);
            redirectAttributes.addFlashAttribute("schedule", scheduleDto);
            return "redirect:/admin/schedules/create";
        }

        scheduleService.storeData(scheduleDto);
        redirectAttributes.addFlashAttribute("success", "Schedule added successfully");
        return "redirect:/admin/schedules";
    }

    @GetMapping("{id}")
    public String show(@PathVariable Long id, Model model) {
        ScheduleDto schedule = scheduleService.findById(id);
        model.addAttribute("schedule", schedule);
        model.addAttribute("title", "Schedule Details");
        return "admin/schedules/show";
    }

    @GetMapping("{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("schedule")) {
            ScheduleDto schedule = scheduleService.findById(id);
            model.addAttribute("schedule", schedule);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            model.addAttribute("formattedStartDateTime", schedule.getStartDateTime().format(formatter));
            model.addAttribute("formattedEndDateTime", schedule.getEndDateTime().format(formatter));
        }

        List<UserDto> users = userService.findAll();
        List<SpotDto> spots = spotService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("spots", spots);
        model.addAttribute("title", "Edit Schedule");
        return "admin/schedules/edit";
    }

    @PutMapping("{id}/update")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("schedule") ScheduleDto scheduleDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        ScheduleDto schedule = scheduleService.findById(id);

        String scheduleDatetime = scheduleDto.getScheduleDatetime();

        if (scheduleDatetime != null && !scheduleDatetime.isEmpty()) {
            String[] dateTimeParts = scheduleDatetime.split(" - ");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            LocalDateTime startDateTime = LocalDateTime.parse(dateTimeParts[0], formatter);
            LocalDateTime endDateTime = LocalDateTime.parse(dateTimeParts[1], formatter);

            scheduleDto.setStartDateTime(startDateTime);
            scheduleDto.setEndDateTime(endDateTime);
        }

        if (scheduleDto.getStartDateTime() != null && scheduleDto.getEndDateTime() != null) {
            Duration duration = Duration.between(scheduleDto.getStartDateTime(), scheduleDto.getEndDateTime());

            if (duration.toHours() < 1) {
                result.rejectValue("scheduleDatetime", null, "Duration must be at least 1 hour");
            }
        }

        if (scheduleDto.getSpot() != null) {
            SpotDto spot = spotService.findById(scheduleDto.getSpot());
            if (!Objects.equals(scheduleDto.getUser().getId(), spot.getUser())) {
                result.rejectValue("spot", null, "Selected spot does not belong to the chosen user");
            }
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.schedule", result);
            redirectAttributes.addFlashAttribute("schedule", schedule);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            redirectAttributes.addFlashAttribute("formattedStartDateTime", schedule.getStartDateTime().format(formatter));
            redirectAttributes.addFlashAttribute("formattedEndDateTime", schedule.getEndDateTime().format(formatter));
            
            return "redirect:/admin/schedules/" + schedule.getId() + "/edit";
        }

        scheduleService.updateData(schedule, scheduleDto);
        redirectAttributes.addFlashAttribute("success", "Schedule updated successfully");
        return "redirect:/admin/schedules/" + schedule.getId() + "/edit";
    }

    @PatchMapping("{id}/remove")
    public String remove(@PathVariable Long id, @ModelAttribute("scheduleRemove") ScheduleDto scheduleDto, RedirectAttributes redirectAttributes) {
        ScheduleDto schedule = scheduleService.findById(id);
        scheduleService.removeData(schedule);
        redirectAttributes.addFlashAttribute("success", "Schedule removed successfully");
        return "redirect:/admin/schedules";
    }
}
