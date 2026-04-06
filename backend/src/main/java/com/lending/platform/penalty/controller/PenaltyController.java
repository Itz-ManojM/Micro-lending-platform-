package com.lending.platform.penalty.controller;

import com.lending.platform.penalty.dto.PenaltyResponse;
import com.lending.platform.penalty.service.PenaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/penalties")
@RequiredArgsConstructor
public class PenaltyController {

    private final PenaltyService penaltyService;

    @PostMapping("/process-overdue")
    public ResponseEntity<List<PenaltyResponse>> processOverdueEmis() {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(penaltyService.processOverdueEmis());
    }

    @GetMapping("/emi/{emiScheduleId}")
    public ResponseEntity<List<PenaltyResponse>> getPenaltiesByEmiId(@PathVariable Long emiScheduleId) {
        return ResponseEntity.ok(penaltyService.getPenaltiesByEmiId(emiScheduleId));
    }
}
