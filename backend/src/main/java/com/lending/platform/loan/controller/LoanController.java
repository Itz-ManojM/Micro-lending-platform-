package com.lending.platform.loan.controller;

import com.lending.platform.loan.dto.LoanApplicationRequest;
import com.lending.platform.loan.dto.LoanApplicationResponse;
import com.lending.platform.loan.service.LoanApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanApplicationService loanApplicationService;

    @PostMapping("/apply")
    public ResponseEntity<LoanApplicationResponse> applyForLoan(@Valid @RequestBody LoanApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(loanApplicationService.applyForLoan(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanApplicationResponse> getLoanApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.getLoanApplicationById(id));
    }

    @GetMapping
    public ResponseEntity<List<LoanApplicationResponse>> getAllLoanApplications() {
        return ResponseEntity.ok(loanApplicationService.getAllLoanApplications());
    }
}
