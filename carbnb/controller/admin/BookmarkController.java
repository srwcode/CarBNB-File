package com.project.carbnb.controller.admin;

import com.project.carbnb.dto.UserDto;
import com.project.carbnb.dto.BookmarkDto;
import com.project.carbnb.dto.SpotDto;
import com.project.carbnb.entity.Bookmark;
import com.project.carbnb.entity.User;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.BookmarkService;
import com.project.carbnb.service.SpotService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;

@Controller
@RequestMapping("admin/bookmarks")
public class BookmarkController {

    private BookmarkService bookmarkService;
    private UserService userService;
    private SpotService spotService;

    public BookmarkController(BookmarkService bookmarkService, UserService userService, SpotService spotService) {
        this.bookmarkService = bookmarkService;
        this.userService = userService;
        this.spotService = spotService;
    }

    @GetMapping
    public String index(Model model) {
        List<BookmarkDto> bookmarks = bookmarkService.findStatus();
        int count = bookmarks.size();

        model.addAttribute("bookmarks", bookmarks);
        model.addAttribute("count", count);
        model.addAttribute("title", "Bookmarks");
        model.addAttribute("route", "bookmarksIndex");
        return "admin/bookmarks/index";
    }

    @GetMapping("create")
    public String create(Model model) {
        if (!model.containsAttribute("bookmark")) {
            BookmarkDto bookmark = new BookmarkDto();
            model.addAttribute("bookmark", bookmark);
        }

        List<UserDto> users = userService.findAll();
        List<SpotDto> spots = spotService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("spots", spots);
        model.addAttribute("title", "Add Bookmark");
        return "admin/bookmarks/create";
    }

    @PostMapping("store")
    public String store(
            @Valid @ModelAttribute("bookmark") BookmarkDto bookmarkDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {
        BookmarkDto bookmarkExisting = bookmarkService.findByUserIdAndSpotId(bookmarkDto.getUser().getId(), bookmarkDto.getSpot());
        if (bookmarkExisting != null) {
            result.rejectValue("user", null, "Bookmark already exists");
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.bookmark", result);
            redirectAttributes.addFlashAttribute("bookmark", bookmarkDto);
            return "redirect:/admin/bookmarks/create";
        }

        bookmarkService.storeData(bookmarkDto);
        redirectAttributes.addFlashAttribute("success", "Bookmark added successfully");
        return "redirect:/admin/bookmarks";
    }

    @GetMapping("{userId}/{spotId}")
    public String show(@PathVariable Long userId, @PathVariable Long spotId, Model model) {
        BookmarkDto bookmark = bookmarkService.findByUserIdAndSpotId(userId, spotId);
        model.addAttribute("bookmark", bookmark);
        model.addAttribute("title", "Bookmark Details");
        return "admin/bookmarks/show";
    }

    @GetMapping("{userId}/{spotId}/edit")
    public String edit(@PathVariable Long userId, @PathVariable Long spotId, Model model) {
        if (!model.containsAttribute("bookmark")) {
            BookmarkDto bookmark = bookmarkService.findByUserIdAndSpotId(userId, spotId);
            model.addAttribute("bookmark", bookmark);
        }

        List<UserDto> users = userService.findAll();
        List<SpotDto> spots = spotService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("spots", spots);
        model.addAttribute("title", "Edit Bookmark");
        return "admin/bookmarks/edit";
    }

    @PutMapping("{userId}/{spotId}/update")
    public String update(
            @PathVariable Long userId,
            @PathVariable Long spotId,
            @Valid @ModelAttribute("bookmark") BookmarkDto bookmarkDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        BookmarkDto bookmark = bookmarkService.findByUserIdAndSpotId(userId, spotId);

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.bookmark", result);
            redirectAttributes.addFlashAttribute("bookmark", bookmark);
            return "redirect:/admin/bookmarks/" + bookmark.getUser().getId() + "/" + bookmark.getSpot() + "/edit";
        }

        bookmarkService.updateData(bookmark, bookmarkDto);
        redirectAttributes.addFlashAttribute("success", "Bookmark updated successfully");
        return "redirect:/admin/bookmarks/" + bookmark.getUser().getId() + "/" + bookmark.getSpot() + "/edit";
    }

    @DeleteMapping("{userId}/{spotId}/remove")
    public String remove(@PathVariable Long userId, @PathVariable Long spotId, @ModelAttribute("bookmarkRemove") BookmarkDto bookmarkDto, RedirectAttributes redirectAttributes) {
        BookmarkDto bookmark = bookmarkService.findByUserIdAndSpotId(userId, spotId);
        bookmarkService.removeData(bookmark);
        redirectAttributes.addFlashAttribute("success", "Bookmark removed successfully");
        return "redirect:/admin/bookmarks";
    }
}