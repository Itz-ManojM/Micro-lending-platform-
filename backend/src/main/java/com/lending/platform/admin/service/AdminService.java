package com.lending.platform.admin.service;

import com.lending.platform.admin.dto.AdminLoanDecisionRequest;
import com.lending.platform.admin.dto.AdminLoanReviewResponse;
import com.lending.platform.common.exception.BadRequestException;
import com.lending.platform.common.exception.ResourceNotFoundException;
import com.lending.platform.loan.entity.LoanApplication;
import com.lending.platform.loan.enums.LoanStatus;
import com.lending.platform.loan.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final LoanApplicationRepository loanApplicationRepository;

    public List<AdminLoanReviewResponse> getManualReviewLoans() {
        return loanApplicationRepository.findAll()
                .stream()
                .filter(loan -> loan.getStatus() == LoanStatus.MANUAL_REVIEW)
                .map(this::mapToResponse)
                .toList();
    }

    public AdminLoanReviewResponse approveLoan(Long loanId, AdminLoanDecisionRequest request) {
        LoanApplication loanApplication = loanApplicationRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + loanId));

        if (loanApplication.getStatus() != LoanStatus.MANUAL_REVIEW) {
            throw new BadRequestException("Only manual review loans can be approved");
        }

        loanApplication.setStatus(LoanStatus.APPROVED);
        loanApplication.setRemarks(request.getRemarks());

        LoanApplication saved = loanApplicationRepository.save(loanApplication);
        return mapToResponse(saved);
    }

    public AdminLoanReviewResponse rejectLoan(Long loanId, AdminLoanDecisionRequest request) {
        LoanApplication loanApplication = loanApplicationRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + loanId));

        if (loanApplication.getStatus() != LoanStatus.MANUAL_REVIEW) {
            throw new BadRequestException("Only manual review loans can be rejected");
        }

        loanApplication.setStatus(LoanStatus.REJECTED);
        loanApplication.setRemarks(request.getRemarks());

        LoanApplication saved = loanApplicationRepository.save(loanApplication);
        return mapToResponse(saved);
    }

    private AdminLoanReviewResponse mapToResponse(LoanApplication loanApplication) {
        return AdminLoanReviewResponse.builder()
                .applicationId(loanApplication.getId())
                .customerProfileId(loanApplication.getCustomerProfile().getId())
                .loanAmount(loanApplication.getLoanAmount())
                .tenureMonths(loanApplication.getTenureMonths())
                .loanPurpose(loanApplication.getLoanPurpose())
                .status(loanApplication.getStatus())
                .riskLevel(loanApplication.getRiskLevel())
                .applicationDate(loanApplication.getApplicationDate())
                .remarks(loanApplication.getRemarks())
                .build();
    }
}
