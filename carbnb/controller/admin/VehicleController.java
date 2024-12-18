package com.project.carbnb.controller.admin;

import com.project.carbnb.dto.UserDto;
import com.project.carbnb.dto.VehicleDto;
import com.project.carbnb.entity.File;
import com.project.carbnb.service.FileUploadService;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;

@Controller
@RequestMapping("admin/vehicles")
public class VehicleController {
    
    private VehicleService vehicleService;
    private UserService userService;
    private FileUploadService fileUploadService;

    public VehicleController(VehicleService vehicleService, UserService userService, FileUploadService fileUploadService) {
        this.vehicleService = vehicleService;
        this.userService = userService;
        this.fileUploadService = fileUploadService;
    }

    @GetMapping
    public String index(Model model) {
        List<VehicleDto> vehicles = vehicleService.findStatus();
        int count = vehicles.size();

        model.addAttribute("vehicles", vehicles);
        model.addAttribute("count", count);
        model.addAttribute("title", "Vehicles");
        model.addAttribute("route", "vehiclesIndex");
        return "admin/vehicles/index";
    }

    @GetMapping("create")
    public String create(Model model) {
        if (!model.containsAttribute("vehicle")) {
            VehicleDto vehicle = new VehicleDto();
            model.addAttribute("vehicle", vehicle);
        }

        List<UserDto> users = userService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("title", "Add Vehicle");
        return "admin/vehicles/create";
    }

    @PostMapping("store")
    public String store(
            @Valid @ModelAttribute("vehicle") VehicleDto vehicleDto,
            BindingResult result,
            RedirectAttributes redirectAttributes,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.vehicle", result);
            redirectAttributes.addFlashAttribute("vehicle", vehicleDto);
            return "redirect:/admin/vehicles/create";
        }

        Long uploadedFile = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
            } catch (Exception e) {
                result.rejectValue("imageFile", null, "Failed to upload file: " + e.getMessage());
                redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.vehicle", result);
                redirectAttributes.addFlashAttribute("vehicle", vehicleDto);
                return "redirect:/admin/vehicles/create";
            }
        }

        if (uploadedFile != null) {
            vehicleDto.setImageId(uploadedFile);
        }

        vehicleService.storeData(vehicleDto);
        redirectAttributes.addFlashAttribute("success", "Vehicle added successfully");
        return "redirect:/admin/vehicles";
    }

    @GetMapping("{id}")
    public String show(@PathVariable Long id, Model model) {
        VehicleDto vehicle = vehicleService.findById(id);

        String imagePath = null;
        if(vehicle.getImageId() != null) {
            File file = fileUploadService.findById(vehicle.getImageId());
            if(file != null) {
                imagePath = "/" + file.getPath();
            }
        }

        model.addAttribute("imagePath", imagePath);
        model.addAttribute("vehicle", vehicle);
        model.addAttribute("title", "Vehicle Details");
        return "admin/vehicles/show";
    }

    @GetMapping("{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("vehicle")) {
            VehicleDto vehicle = vehicleService.findById(id);

            String imagePath = null;
            if(vehicle.getImageId() != null) {
                File file = fileUploadService.findById(vehicle.getImageId());
                if(file != null) {
                    imagePath = "/" + file.getPath();
                }
            }

            model.addAttribute("imagePath", imagePath);
            model.addAttribute("vehicle", vehicle);
        }

        List<UserDto> users = userService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("title", "Edit Vehicle");
        return "admin/vehicles/edit";
    }

    @PutMapping("{id}/update")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("vehicle") VehicleDto vehicleDto,
            BindingResult result,
            RedirectAttributes redirectAttributes,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {

        VehicleDto vehicle = vehicleService.findById(id);

        if (result.hasErrors()) {
            String imagePath = null;
            if(vehicle.getImageId() != null) {
                File file = fileUploadService.findById(vehicle.getImageId());
                if(file != null) {
                    imagePath = "/" + file.getPath();
                }
            }

            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.vehicle", result);
            redirectAttributes.addFlashAttribute("vehicle", vehicle);
            redirectAttributes.addFlashAttribute("imagePath", imagePath);
            return "redirect:/admin/vehicles/" + vehicle.getVehicleId() + "/edit";
        }

        Long uploadedFile = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
            } catch (Exception e) {
                result.rejectValue("imageFile", null, "Failed to upload file: " + e.getMessage());
                redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.vehicle", result);
                redirectAttributes.addFlashAttribute("vehicle", vehicle);
                return "redirect:/admin/vehicles/" + vehicle.getVehicleId() + "/edit";
            }
        }

        if (uploadedFile != null) {
            vehicleDto.setImageId(uploadedFile);
        }

        vehicleService.updateData(vehicle, vehicleDto);
        redirectAttributes.addFlashAttribute("success", "Vehicle updated successfully");
        return "redirect:/admin/vehicles/" + vehicle.getVehicleId() + "/edit";
    }

    @PatchMapping("{id}/remove")
    public String remove(@PathVariable Long id, @ModelAttribute("vehicleRemove") VehicleDto vehicleDto, RedirectAttributes redirectAttributes) {
        VehicleDto vehicle = vehicleService.findById(id);
        vehicleService.removeData(vehicle);
        redirectAttributes.addFlashAttribute("success", "Vehicle removed successfully");
        return "redirect:/admin/vehicles";
    }
}