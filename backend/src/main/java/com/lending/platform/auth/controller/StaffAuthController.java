package com.lending.platform.auth.controller;

import com.lending.platform.auth.dto.AuthenticatedStaffResponse;
import com.lending.platform.auth.dto.StaffLoginRequest;
import com.lending.platform.auth.dto.StaffProfileResponse;
import com.lending.platform.auth.service.StaffAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/staff")
@RequiredArgsConstructor
public class StaffAuthController {

    private final StaffAuthService staffAuthService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticatedStaffResponse> login(@Valid @RequestBody StaffLoginRequest request) {
        return ResponseEntity.ok(staffAuthService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<StaffProfileResponse> currentStaff(Authentication authentication) {
        return ResponseEntity.ok(staffAuthService.getCurrentStaff(authentication));
    }
}
