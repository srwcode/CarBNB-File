package com.project.carbnb.controller.admin;

import com.project.carbnb.dto.FileDto;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.FileService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;

@Controller
@RequestMapping("admin/files")
public class FileController {

    private FileService fileService;
    private UserService userService;

    public FileController(FileService fileService, UserService userService) {
        this.fileService = fileService;
        this.userService = userService;
    }

    @GetMapping
    public String index(Model model) {
        List<FileDto> files = fileService.findStatus();
        int count = files.size();

        model.addAttribute("files", files);
        model.addAttribute("count", count);
        model.addAttribute("title", "Files");
        model.addAttribute("route", "filesIndex");
        return "admin/files/index";
    }

    @GetMapping("{id}")
    public String show(@PathVariable Long id, Model model) {
        FileDto file = fileService.findById(id);
        model.addAttribute("file", file);
        model.addAttribute("title", "File Details");
        return "admin/files/show";
    }

    @GetMapping("{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("file")) {
            FileDto file = fileService.findById(id);
            model.addAttribute("file", file);
        }

        model.addAttribute("title", "Edit File");
        return "admin/files/edit";
    }

    @PutMapping("{id}/update")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("file") FileDto fileDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {
        FileDto file = fileService.findById(id);

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.file", result);
            redirectAttributes.addFlashAttribute("file", file);
            return "redirect:/admin/files/" + file.getId() + "/edit";
        }

        fileService.updateData(file, fileDto);
        redirectAttributes.addFlashAttribute("success", "File updated successfully");
        return "redirect:/admin/files/" + file.getId() + "/edit";
    }

    @PatchMapping("{id}/remove")
    public String remove(@PathVariable Long id, @ModelAttribute("fileRemove") FileDto fileDto, RedirectAttributes redirectAttributes) {
        FileDto file = fileService.findById(id);
        fileService.removeData(file);
        redirectAttributes.addFlashAttribute("success", "File removed successfully");
        return "redirect:/admin/files";
    }
}
