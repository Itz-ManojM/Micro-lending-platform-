package com.lending.platform.repayment.dto;

import com.lending.platform.repayment.enums.RepaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class RepaymentResponse {
    private Long repaymentId;
    private Long emiScheduleId;
    private BigDecimal amountPaid;
    private LocalDate paymentDate;
    private RepaymentStatus status;
    private String paymentMethod;
}
