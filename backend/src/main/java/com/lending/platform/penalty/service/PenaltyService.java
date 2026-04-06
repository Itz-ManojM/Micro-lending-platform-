package com.lending.platform.penalty.service;

import com.lending.platform.emi.entity.EmiSchedule;
import com.lending.platform.emi.enums.EmiStatus;
import com.lending.platform.emi.repository.EmiScheduleRepository;
import com.lending.platform.penalty.dto.PenaltyResponse;
import com.lending.platform.penalty.entity.Penalty;
import com.lending.platform.penalty.enums.PenaltyStatus;
import com.lending.platform.penalty.repository.PenaltyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PenaltyService {

    private static final BigDecimal FIXED_PENALTY_AMOUNT = new BigDecimal("250.00");

    private final PenaltyRepository penaltyRepository;
    private final EmiScheduleRepository emiScheduleRepository;

    public List<PenaltyResponse> processOverdueEmis() {
        List<EmiSchedule> allSchedules = emiScheduleRepository.findAll();
        List<PenaltyResponse> appliedPenalties = new ArrayList<>();

        for (EmiSchedule emiSchedule : allSchedules) {
            boolean isPending = emiSchedule.getStatus() == EmiStatus.PENDING;
            boolean isOverdue = emiSchedule.getDueDate().isBefore(LocalDate.now());

            if (isPending && isOverdue) {
                emiSchedule.setStatus(EmiStatus.OVERDUE);
                emiScheduleRepository.save(emiSchedule);

                boolean penaltyAlreadyExists = penaltyRepository.findByEmiScheduleId(emiSchedule.getId()).isPresent();

                if (!penaltyAlreadyExists) {
                    Penalty penalty = Penalty.builder()
                            .emiSchedule(emiSchedule)
                            .penaltyAmount(FIXED_PENALTY_AMOUNT)
                            .appliedDate(LocalDate.now())
                            .status(PenaltyStatus.APPLIED)
                            .reason("EMI payment overdue")
                            .build();

                    Penalty savedPenalty = penaltyRepository.save(penalty);
                    appliedPenalties.add(mapToResponse(savedPenalty));
                }
            }
        }

        return appliedPenalties;
    }

    public List<PenaltyResponse> getPenaltiesByEmiId(Long emiScheduleId) {
        return penaltyRepository.findByEmiScheduleIdOrderByAppliedDateDesc(emiScheduleId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PenaltyResponse mapToResponse(Penalty penalty) {
        return PenaltyResponse.builder()
                .penaltyId(penalty.getId())
                .emiScheduleId(penalty.getEmiSchedule().getId())
                .penaltyAmount(penalty.getPenaltyAmount())
                .appliedDate(penalty.getAppliedDate())
                .status(penalty.getStatus())
                .reason(penalty.getReason())
                .build();
    }
}
