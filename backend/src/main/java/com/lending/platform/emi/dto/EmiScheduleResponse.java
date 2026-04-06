package com.lending.platform.emi.dto;

import com.lending.platform.emi.enums.EmiStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class EmiScheduleResponse {
    private Long id;
    private Long loanApplicationId;
    private Integer installmentNumber;
    private LocalDate dueDate;
    private BigDecimal totalAmount;
    private BigDecimal principalAmount;
    private BigDecimal interestAmount;
    private BigDecimal remainingBalance;
    private EmiStatus status;
}
