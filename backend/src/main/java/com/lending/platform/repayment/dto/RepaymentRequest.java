package com.lending.platform.repayment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class RepaymentRequest {

    @NotNull
    private Long emiScheduleId;

    @NotNull
    @Positive
    private BigDecimal amountPaid;

    @NotBlank
    private String paymentMethod;
}
