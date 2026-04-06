package com.lending.platform.auth.service;

import com.lending.platform.auth.dto.AuthenticatedStaffResponse;
import com.lending.platform.auth.dto.StaffLoginRequest;
import com.lending.platform.auth.dto.StaffProfileResponse;
import com.lending.platform.common.exception.BadRequestException;
import com.lending.platform.common.exception.ResourceNotFoundException;
import com.lending.platform.security.jwt.JwtService;
import com.lending.platform.user.entity.Role;
import com.lending.platform.user.entity.User;
import com.lending.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffAuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthenticatedStaffResponse login(StaffLoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (AuthenticationException ex) {
            throw new BadRequestException("Invalid staff email or password");
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff account not found for email: " + email));

        if (user.getRole() == Role.CUSTOMER) {
            throw new BadRequestException("Customer accounts cannot access the staff portal");
        }

        return AuthenticatedStaffResponse.builder()
                .token(jwtService.generateToken(user))
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public StaffProfileResponse getCurrentStaff(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff account not found for email: " + email));

        return StaffProfileResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
