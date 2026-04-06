package com.lending.platform.admin.dto;

import com.lending.platform.loan.enums.LoanStatus;
import com.lending.platform.risk.enums.RiskLevel;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class AdminLoanReviewResponse {
    private Long applicationId;
    private Long customerProfileId;
    private BigDecimal loanAmount;
    private Integer tenureMonths;
    private String loanPurpose;
    private LoanStatus status;
    private RiskLevel riskLevel;
    private LocalDate applicationDate;
    private String remarks;
}
