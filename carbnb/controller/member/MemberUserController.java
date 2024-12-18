package com.project.carbnb.controller.member;

import com.project.carbnb.dto.SpotDto;
import com.project.carbnb.dto.UserDto;
import com.project.carbnb.entity.User;
import com.project.carbnb.service.FileUploadService;
import com.project.carbnb.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Objects;

@RestController
@RequestMapping("member/users")
public class MemberUserController {

    private UserService userService;
    private PasswordEncoder passwordEncoder;
    private FileUploadService fileUploadService;

    public MemberUserController(UserService userService, PasswordEncoder passwordEncoder, FileUploadService fileUploadService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/index")
    public UserDto index() {
        return userService.findById(userService.userAuth().getId());
    }

    @PostMapping("/show/{username}")
    public UserDto show(@PathVariable String username) {
        User user = userService.findByUsername(username);
        return userService.findById(user.getId());
    }

    @PutMapping("/update")
    public ResponseEntity<Integer> update(
            @RequestPart("user") UserDto userDto,
            @RequestPart(value = "deleteImage", required = false) String deleteImage,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        UserDto user = userService.findById(userService.userAuth().getId());
        int updated = 0;

        if (userDto.getUsername() != null &&
            userDto.getEmail() != null &&
            userDto.getFirstName() != null &&
            userDto.getLastName() != null
        ) {
            userDto.setStatus(user.getStatus());
            userDto.setRole(user.getRole());

            if(userDto.getCurrentPassword() != null) {

                if(!passwordEncoder.matches(userDto.getCurrentPassword(), user.getPassword())) {
                    updated = 3;
                } else if (userDto.getPassword() == null) {
                    updated = 4;
                } else if (userDto.getPassword().length() < 6 || userDto.getPassword().length() > 100) {
                    updated = 4;
                } else if (!userDto.getPassword().equals(userDto.getConfirmPassword())) {
                    updated = 5;
                } else {
                    userService.updateData(user, userDto);
                    updated = 2;
                }

            } else {

                if (Objects.equals(deleteImage, "true")) {
                    userDto.setImageRemove(1);
                }

                Long uploadedFile = null;
                if (imageFile != null && !imageFile.isEmpty()) {
                    try {
                        uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
                    } catch (Exception ignored) {
                    }
                }

                if (uploadedFile != null) {
                    userDto.setImageId(uploadedFile);
                }

                userService.updateData(user, userDto);
                updated = 1;
            }
        }

        return ResponseEntity.ok(updated);
    }
}