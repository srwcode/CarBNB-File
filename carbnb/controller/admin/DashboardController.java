package com.project.carbnb.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @GetMapping("admin")
    public String index(Model model) {
        model.addAttribute("title", "Dashboard");
        model.addAttribute("route", "dashboard");
        return "admin/dashboard";
    }

}
