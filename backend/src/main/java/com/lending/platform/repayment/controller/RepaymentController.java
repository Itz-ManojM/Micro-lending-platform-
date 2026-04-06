package com.lending.platform.repayment.controller;

import com.lending.platform.repayment.dto.RepaymentRequest;
import com.lending.platform.repayment.dto.RepaymentResponse;
import com.lending.platform.repayment.service.RepaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repayments")
@RequiredArgsConstructor
public class RepaymentController {

    private final RepaymentService repaymentService;

    @PostMapping
    public ResponseEntity<RepaymentResponse> makeRepayment(@Valid @RequestBody RepaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repaymentService.makeRepayment(request));
    }

    @GetMapping("/emi/{emiScheduleId}")
    public ResponseEntity<List<RepaymentResponse>> getRepaymentsByEmiId(@PathVariable Long emiScheduleId) {
        return ResponseEntity.ok(repaymentService.getRepaymentsByEmiId(emiScheduleId));
    }
}
