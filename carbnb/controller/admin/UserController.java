package com.project.carbnb.controller.admin;

import com.project.carbnb.dto.UserDto;
import com.project.carbnb.entity.File;
import com.project.carbnb.entity.User;
import com.project.carbnb.service.FileUploadService;
import com.project.carbnb.service.UserService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;

@Controller
@RequestMapping("admin/users")
public class UserController {

    private UserService userService;
    private FileUploadService fileUploadService;

    public UserController(UserService userService, FileUploadService fileUploadService) {
        this.userService = userService;
        this.fileUploadService = fileUploadService;
    }

    @GetMapping
    public String index(Model model) {
        List<UserDto> users = userService.findStatus();
        int count = users.size();

        model.addAttribute("users", users);
        model.addAttribute("count", count);
        model.addAttribute("title", "Users");
        model.addAttribute("route", "usersIndex");
        return "admin/users/index";
    }

    @GetMapping("create")
    public String create(Model model) {
        if (!model.containsAttribute("user")) {
            UserDto user = new UserDto();
            model.addAttribute("user", user);
        }

        model.addAttribute("title", "Add User");
        return "admin/users/create";
    }

    @PostMapping("store")
    public String store(
            @Valid @ModelAttribute("user") UserDto userDto,
            BindingResult result,
            RedirectAttributes redirectAttributes,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {

        User usernameExisting = userService.findByUsername(userDto.getUsername());
        if (usernameExisting != null) {
            result.rejectValue("username", null, "Username already exists");
        }

        User emailExisting = userService.findByEmail(userDto.getEmail());
        if (emailExisting != null) {
            result.rejectValue("email", null, "Email already exists");
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.user", result);
            redirectAttributes.addFlashAttribute("user", userDto);
            return "redirect:/admin/users/create";
        }

        Long uploadedFile = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
            } catch (Exception e) {
                result.rejectValue("imageFile", null, "Failed to upload file: " + e.getMessage());
                redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.user", result);
                redirectAttributes.addFlashAttribute("user", userDto);
                return "redirect:/admin/users/create";
            }
        }

        if (uploadedFile != null) {
            userDto.setImageId(uploadedFile);
        }

        userService.storeData(userDto);
        redirectAttributes.addFlashAttribute("success", "User added successfully");
        return "redirect:/admin/users";
    }

    @GetMapping("{id}")
    public String show(@PathVariable Long id, Model model) {
        UserDto user = userService.findById(id);

        String imagePath = null;
        if(user.getImageId() != null) {
            File file = fileUploadService.findById(user.getImageId());
            if(file != null) {
                imagePath = "/" + file.getPath();
            }
        }

        model.addAttribute("imagePath", imagePath);
        model.addAttribute("user", user);
        model.addAttribute("title", "User Details");
        return "admin/users/show";
    }

    @GetMapping("{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("user")) {
            UserDto user = userService.findById(id);

            String imagePath = null;
            if(user.getImageId() != null) {
                File file = fileUploadService.findById(user.getImageId());
                if(file != null) {
                    imagePath = "/" + file.getPath();
                }
            }

            model.addAttribute("imagePath", imagePath);
            model.addAttribute("user", user);
        }
        model.addAttribute("title", "Edit User");
        return "admin/users/edit";
    }

    @PutMapping("{id}/update")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("user") UserDto userDto,
            BindingResult result,
            RedirectAttributes redirectAttributes,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {

        UserDto user = userService.findById(id);

        User usernameExisting = userService.findByUsername(userDto.getUsername());
        if (usernameExisting != null && !usernameExisting.getId().equals(user.getId())) {
            result.rejectValue("username", null, "Username already exists");
        }

        User emailExisting = userService.findByEmail(userDto.getEmail());
        if (emailExisting != null && !emailExisting.getId().equals(user.getId())) {
            result.rejectValue("email", null, "Email already exists");
        }

        if (result.hasErrors()) {
            String imagePath = null;
            if(user.getImageId() != null) {
                File file = fileUploadService.findById(user.getImageId());
                if(file != null) {
                    imagePath = "/" + file.getPath();
                }
            }

            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.user", result);
            redirectAttributes.addFlashAttribute("user", user);
            redirectAttributes.addFlashAttribute("imagePath", imagePath);
            return "redirect:/admin/users/" + user.getId() + "/edit";
        }

        Long uploadedFile = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
            } catch (Exception e) {
                result.rejectValue("imageFile", null, "Failed to upload file: " + e.getMessage());
                redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.user", result);
                redirectAttributes.addFlashAttribute("user", user);
                return "redirect:/admin/users/" + user.getId() + "/edit";
            }
        }

        if (uploadedFile != null) {
            userDto.setImageId(uploadedFile);
        }

        userService.updateData(user, userDto);
        redirectAttributes.addFlashAttribute("success", "User updated successfully");
        return "redirect:/admin/users/" + user.getId() + "/edit";
    }

    @PatchMapping("{id}/remove")
    public String remove(@PathVariable Long id, @ModelAttribute("userRemove") UserDto userDto, RedirectAttributes redirectAttributes) {
        UserDto user = userService.findById(id);
        userService.removeData(user);
        redirectAttributes.addFlashAttribute("success", "User removed successfully");
        return "redirect:/admin/users";
    }
}
