package com.lending.platform.emi.controller;

import com.lending.platform.emi.dto.EmiScheduleResponse;
import com.lending.platform.emi.service.EmiScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class EmiController {

    private final EmiScheduleService emiScheduleService;

    @PostMapping("/{loanId}/emi-schedule/generate")
    public ResponseEntity<List<EmiScheduleResponse>> generateSchedule(@PathVariable Long loanId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(emiScheduleService.generateSchedule(loanId));
    }

    @GetMapping("/{loanId}/emi-schedule")
    public ResponseEntity<List<EmiScheduleResponse>> getSchedule(@PathVariable Long loanId) {
        return ResponseEntity.ok(emiScheduleService.getScheduleByLoanId(loanId));
    }
}
