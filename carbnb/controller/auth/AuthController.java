package com.project.carbnb.controller.auth;

import com.project.carbnb.dto.UserDto;
import com.project.carbnb.entity.User;
import com.project.carbnb.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Objects;

@Controller
public class AuthController {

    private UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/checkAuth")
    public ResponseEntity<Boolean> checkAuth() {
        boolean isAuthenticated = false;

        if (userService != null && userService.userAuth() != null) {
            isAuthenticated = true;
        }

        return ResponseEntity.ok(isAuthenticated);
    }

    @PostMapping("/checkRole")
    public ResponseEntity<Boolean> checkRole() {
        boolean role = false;

        if (userService != null && userService.userAuth() != null) {
            if(Objects.equals(userService.userAuth().getRole(), "admin")) {
                role = true;
            }
        }

        return ResponseEntity.ok(role);
    }


    @GetMapping("/login")
    public String loginForm() {
        return "auth/login";
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        if (!model.containsAttribute("user")) {
            UserDto user = new UserDto();
            model.addAttribute("user", user);
        }

        return "auth/register";
    }

    @PostMapping("/register/save")
    public String registration(
            @Valid @ModelAttribute("user") UserDto userDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        User usernameExisting = userService.findByUsername(userDto.getUsername());
        if (usernameExisting != null) {
            result.rejectValue("username", null, "Username already exists");
        }

        User emailExisting = userService.findByEmail(userDto.getEmail());
        if (emailExisting != null) {
            result.rejectValue("email", null, "Email already exists");
        }

        if (userDto.getPassword().length() < 6 || userDto.getPassword().length() > 100) {
            result.rejectValue("password", null, "Password should be between 6 and 100 characters");
        }

        if (!Objects.equals(userDto.getPassword(), userDto.getConfirmPassword())) {
            result.rejectValue("password", null, "Password and confirm password do not match");
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.user", result);
            redirectAttributes.addFlashAttribute("user", userDto);
            return "redirect:/register";
        }

        userService.saveUser(userDto);
        return "redirect:/login?success";
    }
}
