package com.lending.platform.penalty.dto;

import com.lending.platform.penalty.enums.PenaltyStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class PenaltyResponse {
    private Long penaltyId;
    private Long emiScheduleId;
    private BigDecimal penaltyAmount;
    private LocalDate appliedDate;
    private PenaltyStatus status;
    private String reason;
}
