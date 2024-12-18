package com.project.carbnb.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class AuthHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String targetUrl = determineTargetUrl(authentication);

        if (response.isCommitted()) {
            return;
        }

        response.sendRedirect(targetUrl);
    }

    private String determineTargetUrl(Authentication authentication) {
        String url = "/";

        if (authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("admin"))) {
            url = "/admin";
        } else if (authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("member"))) {
            url = "http://localhost:9200";
        }

        return url;
    }
}