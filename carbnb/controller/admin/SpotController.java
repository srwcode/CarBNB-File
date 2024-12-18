package com.project.carbnb.controller.admin;

import com.project.carbnb.dto.UserDto;
import com.project.carbnb.dto.SpotDto;
import com.project.carbnb.entity.File;
import com.project.carbnb.service.FileUploadService;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.SpotService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;

@Controller
@RequestMapping("admin/spots")
public class SpotController {

    private SpotService spotService;
    private UserService userService;
    private FileUploadService fileUploadService;

    public SpotController(SpotService spotService, UserService userService, FileUploadService fileUploadService) {
        this.spotService = spotService;
        this.userService = userService;
        this.fileUploadService = fileUploadService;
    }

    @GetMapping
    public String index(Model model) {
        List<SpotDto> spots = spotService.findStatus();
        int count = spots.size();

        model.addAttribute("spots", spots);
        model.addAttribute("count", count);
        model.addAttribute("title", "Spots");
        model.addAttribute("route", "spotsIndex");
        return "admin/spots/index";
    }

    @GetMapping("create")
    public String create(Model model) {
        if (!model.containsAttribute("spot")) {
            SpotDto spot = new SpotDto();
            model.addAttribute("spot", spot);
        }

        List<UserDto> users = userService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("title", "Add Spot");
        return "admin/spots/create";
    }

    @PostMapping("store")
    public String store(
            @Valid @ModelAttribute("spot") SpotDto spotDto,
            BindingResult result,
            RedirectAttributes redirectAttributes,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.spot", result);
            redirectAttributes.addFlashAttribute("spot", spotDto);
            return "redirect:/admin/spots/create";
        }

        Long uploadedFile = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
            } catch (Exception e) {
                result.rejectValue("imageFile", null, "Failed to upload file: " + e.getMessage());
                redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.spot", result);
                redirectAttributes.addFlashAttribute("spot", spotDto);
                return "redirect:/admin/spots/create";
            }
        }

        if (uploadedFile != null) {
            spotDto.setImageId(uploadedFile);
        }

        spotService.storeData(spotDto);
        redirectAttributes.addFlashAttribute("success", "Spot added successfully");
        return "redirect:/admin/spots";
    }

    @GetMapping("{id}")
    public String show(@PathVariable Long id, Model model) {
        SpotDto spot = spotService.findById(id);

        String imagePath = null;
        if(spot.getImageId() != null) {
            File file = fileUploadService.findById(spot.getImageId());
            if(file != null) {
                imagePath = "/" + file.getPath();
            }
        }

        model.addAttribute("imagePath", imagePath);
        model.addAttribute("spot", spot);
        model.addAttribute("title", "Spot Details");
        return "admin/spots/show";
    }

    @GetMapping("{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("spot")) {
            SpotDto spot = spotService.findById(id);

            String imagePath = null;
            if(spot.getImageId() != null) {
                File file = fileUploadService.findById(spot.getImageId());
                if(file != null) {
                    imagePath = "/" + file.getPath();
                }
            }

            model.addAttribute("imagePath", imagePath);
            model.addAttribute("spot", spot);
        }

        List<UserDto> users = userService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("title", "Edit Spot");
        return "admin/spots/edit";
    }

    @PutMapping("{id}/update")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("spot") SpotDto spotDto,
            BindingResult result,
            RedirectAttributes redirectAttributes,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {

        SpotDto spot = spotService.findById(id);

        if (result.hasErrors()) {
            String imagePath = null;
            if(spot.getImageId() != null) {
                File file = fileUploadService.findById(spot.getImageId());
                if(file != null) {
                    imagePath = "/" + file.getPath();
                }
            }

            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.spot", result);
            redirectAttributes.addFlashAttribute("spot", spot);
            redirectAttributes.addFlashAttribute("imagePath", imagePath);
            return "redirect:/admin/spots/" + spot.getSpotId() + "/edit";
        }

        Long uploadedFile = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
            } catch (Exception e) {
                result.rejectValue("imageFile", null, "Failed to upload file: " + e.getMessage());
                redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.spot", result);
                redirectAttributes.addFlashAttribute("spot", spot);
                return "redirect:/admin/spots/" + spot.getSpotId() + "/edit";
            }
        }

        if (uploadedFile != null) {
            spotDto.setImageId(uploadedFile);
        }

        spotService.updateData(spot, spotDto);
        redirectAttributes.addFlashAttribute("success", "Spot updated successfully");
        return "redirect:/admin/spots/" + spot.getSpotId() + "/edit";
    }

    @PatchMapping("{id}/remove")
    public String remove(@PathVariable Long id, @ModelAttribute("spotRemove") SpotDto spotDto, RedirectAttributes redirectAttributes) {
        SpotDto spot = spotService.findById(id);
        spotService.removeData(spot);
        redirectAttributes.addFlashAttribute("success", "Spot removed successfully");
        return "redirect:/admin/spots";
    }
}