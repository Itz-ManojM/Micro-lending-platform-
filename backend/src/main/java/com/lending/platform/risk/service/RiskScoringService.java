package com.lending.platform.risk.service;

import com.lending.platform.customer.entity.CustomerProfile;
import com.lending.platform.risk.enums.RiskLevel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class RiskScoringService {

    public RiskLevel calculateRisk(CustomerProfile profile, BigDecimal loanAmount, Integer tenureMonths) {
        BigDecimal income = defaultValue(profile.getMonthlyIncome());
        BigDecimal existingEmi = defaultValue(profile.getExistingEmiAmount());

        if (income.compareTo(BigDecimal.ZERO) <= 0 || tenureMonths == null || tenureMonths <= 0) {
            return RiskLevel.HIGH;
        }

        BigDecimal estimatedEmi = loanAmount.divide(BigDecimal.valueOf(tenureMonths), 2, RoundingMode.HALF_UP);
        BigDecimal totalMonthlyObligation = existingEmi.add(estimatedEmi);
        BigDecimal ratio = totalMonthlyObligation.divide(income, 4, RoundingMode.HALF_UP);

        if (ratio.compareTo(new BigDecimal("0.35")) <= 0 && income.compareTo(new BigDecimal("50000")) >= 0) {
            return RiskLevel.LOW;
        }

        if (ratio.compareTo(new BigDecimal("0.50")) <= 0 && income.compareTo(new BigDecimal("25000")) >= 0) {
            return RiskLevel.MEDIUM;
        }

        return RiskLevel.HIGH;
    }

    private BigDecimal defaultValue(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
