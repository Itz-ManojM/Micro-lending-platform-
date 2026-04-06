package com.lending.platform.emi.service;

import com.lending.platform.common.exception.BadRequestException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class EmiCalculationService {

    public static final BigDecimal DEFAULT_ANNUAL_INTEREST_RATE = new BigDecimal("12");

    public BigDecimal calculateMonthlyEmi(BigDecimal principal, Integer tenureMonths) {
        if (principal == null || tenureMonths == null || tenureMonths <= 0) {
            throw new BadRequestException("Invalid loan amount or tenure");
        }

        double p = principal.doubleValue();
        double monthlyRate = DEFAULT_ANNUAL_INTEREST_RATE.doubleValue() / 12 / 100;
        double factor = Math.pow(1 + monthlyRate, tenureMonths);
        double emi = (p * monthlyRate * factor) / (factor - 1);

        return BigDecimal.valueOf(emi).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal getMonthlyInterestRate() {
        return DEFAULT_ANNUAL_INTEREST_RATE
                .divide(new BigDecimal("1200"), 10, RoundingMode.HALF_UP);
    }
}
