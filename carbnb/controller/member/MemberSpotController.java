package com.project.carbnb.controller.member;

import com.project.carbnb.dto.BookmarkDto;
import com.project.carbnb.dto.ScheduleDto;
import com.project.carbnb.dto.SpotDto;
import com.project.carbnb.entity.User;
import com.project.carbnb.service.BookmarkService;
import com.project.carbnb.service.FileUploadService;
import com.project.carbnb.service.SpotService;
import com.project.carbnb.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("member/spots")
public class MemberSpotController {

    private SpotService spotService;
    private UserService userService;
    private BookmarkService bookmarkService;
    private FileUploadService fileUploadService;

    public MemberSpotController(SpotService spotService, UserService userService, BookmarkService bookmarkService, FileUploadService fileUploadService) {
        this.spotService = spotService;
        this.userService = userService;
        this.bookmarkService = bookmarkService;
        this.fileUploadService = fileUploadService;
    }

    public static boolean isValidURL(String url) {
        try {
            URL u = new URL(url);
            return true;
        } catch (MalformedURLException e) {
            return false;
        }
    }

    @PostMapping("/index")
    public List<SpotDto> index() {
        return spotService.findByUserId(userService.userAuth().getId());
    }

    @PostMapping("/user/{username}")
    public List<SpotDto> user(@PathVariable String username) {
        User user = userService.findByUsername(username);
        return spotService.findByUserId(user.getId());
    }


    @PostMapping("/store")
    public ResponseEntity<Boolean> store(
            @RequestPart("spot") SpotDto spotDto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        boolean created = false;

        if(spotDto.getName() != null &&
            spotDto.getType() != null &&
            spotDto.getLocation() != null && isValidURL(spotDto.getLocation()) &&
            spotDto.getAddress() != null && !spotDto.getAddress().isEmpty() &&
            spotDto.getSizeWidth() != null && spotDto.getSizeWidth().compareTo(BigDecimal.ZERO) > 0 &&
            spotDto.getSizeLength() != null && spotDto.getSizeLength().compareTo(BigDecimal.ZERO) > 0
        ) {
            spotDto.setUser(userService.userAuth().getId());
            spotDto.setStatus((short) 1);

            Long uploadedFile = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
                } catch (Exception ignored) {}
            }

            if (uploadedFile != null) {
                spotDto.setImageId(uploadedFile);
            }

            spotService.storeData(spotDto);
            created = true;
        }

        return ResponseEntity.ok(created);
    }

    @PostMapping("/show/{id}")
    public SpotDto show(@PathVariable Long id) {
        return spotService.findByIdAndUserId(id, userService.userAuth().getId());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Boolean> update(
            @PathVariable Long id,
            @RequestPart("spot") SpotDto spotDto,
            @RequestPart(value = "deleteImage", required = false) String deleteImage,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        SpotDto spot = spotService.findById(id);
        boolean updated = false;

        if(spotDto.getName() != null &&
            spotDto.getType() != null &&
            spotDto.getLocation() != null && isValidURL(spotDto.getLocation()) &&
            spotDto.getAddress() != null && !spotDto.getAddress().isEmpty() &&
            spotDto.getSizeWidth() != null && spotDto.getSizeWidth().compareTo(BigDecimal.ZERO) > 0 &&
            spotDto.getSizeLength() != null && spotDto.getSizeLength().compareTo(BigDecimal.ZERO) > 0
        ) {
            spotDto.setUser(spot.getUser());
            spotDto.setStatus(spot.getStatus());

            if(Objects.equals(deleteImage, "true")) {
                spotDto.setImageRemove(1);
            }

            Long uploadedFile = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    uploadedFile = fileUploadService.uploadFile(imageFile, userService.userAuth());
                } catch (Exception ignored) {}
            }

            if (uploadedFile != null) {
                spotDto.setImageId(uploadedFile);
            }

            spotService.updateData(spot, spotDto);
            updated = true;
        }

        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/remove/{id}")
    public ResponseEntity<Boolean> remove(@PathVariable Long id) {
        boolean removed = false;
        SpotDto spot = spotService.findById(id);

        if (spot != null && Objects.equals(spot.getUser(), userService.userAuth().getId())) {
            spotService.removeData(spot);
            removed = true;
        }

        return ResponseEntity.ok(removed);
    }

    @PostMapping("/display/{id}")
    public SpotDto display(@PathVariable Long id) {
        return spotService.findById(id);
    }

    @PostMapping("/bookmark")
    public List<SpotDto> bookmark() {
        List<BookmarkDto> bookmarks = bookmarkService.findByUserId(userService.userAuth().getId());
        return spotService.findByBookmark(bookmarks);
    }
}