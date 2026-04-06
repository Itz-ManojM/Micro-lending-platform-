package com.lending.platform.customer.controller;

import com.lending.platform.customer.dto.CreateCustomerProfileRequest;
import com.lending.platform.customer.dto.CustomerProfileResponse;
import com.lending.platform.customer.service.CustomerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerProfileService customerProfileService;

    @PostMapping
    public ResponseEntity<CustomerProfileResponse> createProfile(
            @Valid @RequestBody CreateCustomerProfileRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(customerProfileService.createProfile(request));
    }

    @GetMapping
    public ResponseEntity<List<CustomerProfileResponse>> getAllProfiles() {
        return ResponseEntity.ok(customerProfileService.getAllProfiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerProfileResponse> getProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(customerProfileService.getProfileById(id));
    }
}
