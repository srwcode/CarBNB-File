package com.project.carbnb.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.time.LocalDate;

@ControllerAdvice
public class GlobalController {

    @ModelAttribute("siteName")
    public String getSiteName() {
        return "CarBNB";
    }

    @ModelAttribute("currentYear")
    public int getCurrentYear() {
        return LocalDate.now().getYear();
    }
}
