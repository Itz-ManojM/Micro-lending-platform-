package com.lending.platform.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StaffLoginRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;
}
