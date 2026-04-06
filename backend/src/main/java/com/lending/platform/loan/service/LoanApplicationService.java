package com.lending.platform.loan.service;

import com.lending.platform.common.exception.ResourceNotFoundException;
import com.lending.platform.customer.entity.CustomerProfile;
import com.lending.platform.customer.service.CustomerProfileService;
import com.lending.platform.loan.dto.LoanApplicationRequest;
import com.lending.platform.loan.dto.LoanApplicationResponse;
import com.lending.platform.loan.entity.LoanApplication;
import com.lending.platform.loan.enums.LoanStatus;
import com.lending.platform.loan.repository.LoanApplicationRepository;
import com.lending.platform.risk.enums.RiskLevel;
import com.lending.platform.risk.service.RiskScoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final CustomerProfileService customerProfileService;
    private final RiskScoringService riskScoringService;

    public LoanApplicationResponse applyForLoan(LoanApplicationRequest request) {
        CustomerProfile customerProfile = customerProfileService.getById(request.getCustomerProfileId());

        RiskLevel riskLevel = riskScoringService.calculateRisk(
                customerProfile,
                request.getLoanAmount(),
                request.getTenureMonths()
        );

        LoanStatus loanStatus = mapStatus(riskLevel);

        LoanApplication loanApplication = LoanApplication.builder()
                .customerProfile(customerProfile)
                .loanAmount(request.getLoanAmount())
                .tenureMonths(request.getTenureMonths())
                .loanPurpose(request.getLoanPurpose())
                .riskLevel(riskLevel)
                .status(loanStatus)
                .applicationDate(LocalDate.now())
                .build();

        LoanApplication saved = loanApplicationRepository.save(loanApplication);

        return mapToResponse(saved);
    }

    public LoanApplicationResponse getLoanApplicationById(Long id) {
        LoanApplication loanApplication = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + id));

        return mapToResponse(loanApplication);
    }

    public List<LoanApplicationResponse> getAllLoanApplications() {
        return loanApplicationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private LoanApplicationResponse mapToResponse(LoanApplication loanApplication) {
        return LoanApplicationResponse.builder()
                .applicationId(loanApplication.getId())
                .customerProfileId(loanApplication.getCustomerProfile().getId())
                .customerName(loanApplication.getCustomerProfile().getFullName())
                .loanAmount(loanApplication.getLoanAmount())
                .tenureMonths(loanApplication.getTenureMonths())
                .loanPurpose(loanApplication.getLoanPurpose())
                .status(loanApplication.getStatus())
                .riskLevel(loanApplication.getRiskLevel())
                .applicationDate(loanApplication.getApplicationDate())
                .build();
    }

    private LoanStatus mapStatus(RiskLevel riskLevel) {
        return switch (riskLevel) {
            case LOW -> LoanStatus.APPROVED;
            case MEDIUM -> LoanStatus.MANUAL_REVIEW;
            case HIGH -> LoanStatus.REJECTED;
        };
    }
}
