package com.lending.platform.customer.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class CustomerProfileResponse {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String employmentType;
    private BigDecimal monthlyIncome;
    private BigDecimal existingEmiAmount;
}
