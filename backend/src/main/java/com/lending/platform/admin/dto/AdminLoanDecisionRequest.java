package com.lending.platform.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminLoanDecisionRequest {

    @NotBlank
    private String remarks;
}
