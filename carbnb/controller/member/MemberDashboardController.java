package com.project.carbnb.controller.member;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MemberDashboardController {

    @GetMapping("member")
    public String index(Model model) {
        model.addAttribute("title", "Dashboard");
        model.addAttribute("route", "dashboard");
        return "member/dashboard";
    }

}
