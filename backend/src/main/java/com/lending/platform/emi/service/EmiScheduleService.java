package com.lending.platform.emi.service;

import com.lending.platform.common.exception.BadRequestException;
import com.lending.platform.common.exception.ResourceNotFoundException;
import com.lending.platform.emi.dto.EmiScheduleResponse;
import com.lending.platform.emi.entity.EmiSchedule;
import com.lending.platform.emi.enums.EmiStatus;
import com.lending.platform.emi.repository.EmiScheduleRepository;
import com.lending.platform.loan.entity.LoanApplication;
import com.lending.platform.loan.enums.LoanStatus;
import com.lending.platform.loan.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmiScheduleService {

    private final EmiScheduleRepository emiScheduleRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final EmiCalculationService emiCalculationService;

    public List<EmiScheduleResponse> generateSchedule(Long loanId) {
        LoanApplication loanApplication = loanApplicationRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + loanId));

        if (loanApplication.getStatus() != LoanStatus.APPROVED) {
            throw new BadRequestException("EMI schedule can be generated only for approved loans");
        }

        List<EmiSchedule> existingSchedules =
                emiScheduleRepository.findByLoanApplicationIdOrderByInstallmentNumberAsc(loanId);

        if (!existingSchedules.isEmpty()) {
            return existingSchedules.stream().map(this::mapToResponse).toList();
        }

        BigDecimal principal = loanApplication.getLoanAmount();
        Integer tenureMonths = loanApplication.getTenureMonths();
        BigDecimal monthlyEmi = emiCalculationService.calculateMonthlyEmi(principal, tenureMonths);
        BigDecimal monthlyRate = emiCalculationService.getMonthlyInterestRate();

        List<EmiSchedule> schedules = new ArrayList<>();
        BigDecimal remainingBalance = principal;
        LocalDate baseDate = loanApplication.getApplicationDate() != null
                ? loanApplication.getApplicationDate()
                : LocalDate.now();

        for (int i = 1; i <= tenureMonths; i++) {
            BigDecimal interestAmount = remainingBalance.multiply(monthlyRate)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal principalAmount = monthlyEmi.subtract(interestAmount)
                    .setScale(2, RoundingMode.HALF_UP);

            if (i == tenureMonths) {
                principalAmount = remainingBalance.setScale(2, RoundingMode.HALF_UP);
                monthlyEmi = principalAmount.add(interestAmount).setScale(2, RoundingMode.HALF_UP);
            }

            remainingBalance = remainingBalance.subtract(principalAmount)
                    .max(BigDecimal.ZERO)
                    .setScale(2, RoundingMode.HALF_UP);

            EmiSchedule emiSchedule = EmiSchedule.builder()
                    .installmentNumber(i)
                    .dueDate(baseDate.plusMonths(i))
                    .totalAmount(monthlyEmi)
                    .principalAmount(principalAmount)
                    .interestAmount(interestAmount)
                    .remainingBalance(remainingBalance)
                    .status(EmiStatus.PENDING)
                    .loanApplication(loanApplication)
                    .build();

            schedules.add(emiSchedule);
        }

        List<EmiSchedule> savedSchedules = emiScheduleRepository.saveAll(schedules);
        return savedSchedules.stream().map(this::mapToResponse).toList();
    }

    public List<EmiScheduleResponse> getScheduleByLoanId(Long loanId) {
        loanApplicationRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + loanId));

        return emiScheduleRepository.findByLoanApplicationIdOrderByInstallmentNumberAsc(loanId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private EmiScheduleResponse mapToResponse(EmiSchedule emiSchedule) {
        return EmiScheduleResponse.builder()
                .id(emiSchedule.getId())
                .loanApplicationId(emiSchedule.getLoanApplication().getId())
                .installmentNumber(emiSchedule.getInstallmentNumber())
                .dueDate(emiSchedule.getDueDate())
                .totalAmount(emiSchedule.getTotalAmount())
                .principalAmount(emiSchedule.getPrincipalAmount())
                .interestAmount(emiSchedule.getInterestAmount())
                .remainingBalance(emiSchedule.getRemainingBalance())
                .status(emiSchedule.getStatus())
                .build();
    }
}
