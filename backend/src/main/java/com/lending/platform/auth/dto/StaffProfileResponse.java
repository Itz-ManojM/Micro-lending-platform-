package com.lending.platform.auth.dto;

import com.lending.platform.user.entity.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StaffProfileResponse {
    private Long userId;
    private String fullName;
    private String email;
    private Role role;
}
