package com.lending.platform.admin.controller;

import com.lending.platform.admin.dto.AdminLoanDecisionRequest;
import com.lending.platform.admin.dto.AdminLoanReviewResponse;
import com.lending.platform.admin.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/loans")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/manual-review")
    public ResponseEntity<List<AdminLoanReviewResponse>> getManualReviewLoans() {
        return ResponseEntity.ok(adminService.getManualReviewLoans());
    }

    @PutMapping("/{loanId}/approve")
    public ResponseEntity<AdminLoanReviewResponse> approveLoan(
            @PathVariable Long loanId,
            @Valid @RequestBody AdminLoanDecisionRequest request
    ) {
        return ResponseEntity.ok(adminService.approveLoan(loanId, request));
    }

    @PutMapping("/{loanId}/reject")
    public ResponseEntity<AdminLoanReviewResponse> rejectLoan(
            @PathVariable Long loanId,
            @Valid @RequestBody AdminLoanDecisionRequest request
    ) {
        return ResponseEntity.ok(adminService.rejectLoan(loanId, request));
    }
}
