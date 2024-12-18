package com.project.carbnb.controller.admin;

import com.project.carbnb.dto.UserDto;
import com.project.carbnb.dto.WithdrawalDto;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.WithdrawalService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("admin/withdrawals")
public class WithdrawalController {

    private WithdrawalService withdrawalService;
    private UserService userService;

    public WithdrawalController(WithdrawalService withdrawalService, UserService userService) {
        this.withdrawalService = withdrawalService;
        this.userService = userService;
    }

    @GetMapping
    public String index(Model model) {
        List<WithdrawalDto> withdrawals = withdrawalService.findStatus();
        int count = withdrawals.size();

        model.addAttribute("withdrawals", withdrawals);
        model.addAttribute("count", count);
        model.addAttribute("title", "Withdrawals");
        model.addAttribute("route", "withdrawalsIndex");
        return "admin/withdrawals/index";
    }

    @GetMapping("create")
    public String create(Model model) {
        if (!model.containsAttribute("withdrawal")) {
            WithdrawalDto withdrawal = new WithdrawalDto();
            model.addAttribute("withdrawal", withdrawal);
        }

        List<UserDto> users = userService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("title", "Add Withdrawal");
        return "admin/withdrawals/create";
    }

    @PostMapping("store")
    public String store(
            @Valid @ModelAttribute("withdrawal") WithdrawalDto withdrawalDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {
        BigDecimal withdrawalAmount = withdrawalDto.getAmount();
        BigDecimal currentBalance = withdrawalDto.getUser().getBalance();

        if (currentBalance.compareTo(withdrawalAmount) < 0) {
            result.rejectValue("amount", null, "Insufficient balance");
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.withdrawal", result);
            redirectAttributes.addFlashAttribute("withdrawal", withdrawalDto);
            return "redirect:/admin/withdrawals/create";
        }

        withdrawalService.storeData(withdrawalDto);
        redirectAttributes.addFlashAttribute("success", "Withdrawal added successfully");
        return "redirect:/admin/withdrawals";
    }

    @GetMapping("{id}")
    public String show(@PathVariable Long id, Model model) {
        WithdrawalDto withdrawal = withdrawalService.findById(id);
        model.addAttribute("withdrawal", withdrawal);
        model.addAttribute("title", "Withdrawal Details");
        return "admin/withdrawals/show";
    }

    @GetMapping("{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("withdrawal")) {
            WithdrawalDto withdrawal = withdrawalService.findById(id);
            model.addAttribute("withdrawal", withdrawal);
        }

        List<UserDto> users = userService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("title", "Edit Withdrawal");
        return "admin/withdrawals/edit";
    }

    @PutMapping("{id}/update")
    public String update(
            @PathVariable Long id,
            @Valid @ModelAttribute("withdrawal") WithdrawalDto withdrawalDto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {
        WithdrawalDto withdrawal = withdrawalService.findById(id);

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.withdrawal", result);
            redirectAttributes.addFlashAttribute("withdrawal", withdrawal);
            return "redirect:/admin/withdrawals/" + withdrawal.getId() + "/edit";
        }

        withdrawalService.updateData(withdrawal, withdrawalDto);
        redirectAttributes.addFlashAttribute("success", "Withdrawal updated successfully");
        return "redirect:/admin/withdrawals/" + withdrawal.getId() + "/edit";
    }

    @PatchMapping("{id}/remove")
    public String remove(@PathVariable Long id, @ModelAttribute("withdrawalRemove") WithdrawalDto withdrawalDto, RedirectAttributes redirectAttributes) {
        WithdrawalDto withdrawal = withdrawalService.findById(id);
        withdrawalService.removeData(withdrawal);
        redirectAttributes.addFlashAttribute("success", "Withdrawal removed successfully");
        return "redirect:/admin/withdrawals";
    }
}
