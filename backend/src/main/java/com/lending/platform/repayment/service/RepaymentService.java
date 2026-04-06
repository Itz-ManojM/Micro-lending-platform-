package com.lending.platform.repayment.service;

import com.lending.platform.emi.entity.EmiSchedule;
import com.lending.platform.emi.enums.EmiStatus;
import com.lending.platform.emi.repository.EmiScheduleRepository;
import com.lending.platform.repayment.dto.RepaymentRequest;
import com.lending.platform.repayment.dto.RepaymentResponse;
import com.lending.platform.repayment.entity.Repayment;
import com.lending.platform.repayment.enums.RepaymentStatus;
import com.lending.platform.repayment.repository.RepaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepaymentService {

    private final RepaymentRepository repaymentRepository;
    private final EmiScheduleRepository emiScheduleRepository;

    public RepaymentResponse makeRepayment(RepaymentRequest request) {
        EmiSchedule emiSchedule = emiScheduleRepository.findById(request.getEmiScheduleId())
                .orElseThrow(() -> new RuntimeException("EMI schedule not found with id: " + request.getEmiScheduleId()));

        if (emiSchedule.getStatus() == EmiStatus.PAID) {
            throw new RuntimeException("This EMI is already paid");
        }

        if (request.getAmountPaid().compareTo(emiSchedule.getTotalAmount()) < 0) {
            throw new RuntimeException("Paid amount is less than EMI amount");
        }

        Repayment repayment = Repayment.builder()
                .emiSchedule(emiSchedule)
                .amountPaid(request.getAmountPaid())
                .paymentDate(LocalDate.now())
                .status(RepaymentStatus.SUCCESS)
                .paymentMethod(request.getPaymentMethod())
                .build();

        Repayment savedRepayment = repaymentRepository.save(repayment);

        emiSchedule.setStatus(EmiStatus.PAID);
        emiScheduleRepository.save(emiSchedule);

        return mapToResponse(savedRepayment);
    }

    public List<RepaymentResponse> getRepaymentsByEmiId(Long emiScheduleId) {
        return repaymentRepository.findByEmiScheduleIdOrderByPaymentDateDesc(emiScheduleId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private RepaymentResponse mapToResponse(Repayment repayment) {
        return RepaymentResponse.builder()
                .repaymentId(repayment.getId())
                .emiScheduleId(repayment.getEmiSchedule().getId())
                .amountPaid(repayment.getAmountPaid())
                .paymentDate(repayment.getPaymentDate())
                .status(repayment.getStatus())
                .paymentMethod(repayment.getPaymentMethod())
                .build();
    }
}
