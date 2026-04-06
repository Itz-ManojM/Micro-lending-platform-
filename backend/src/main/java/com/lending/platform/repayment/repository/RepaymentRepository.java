package com.lending.platform.repayment.repository;

import com.lending.platform.repayment.entity.Repayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepaymentRepository extends JpaRepository<Repayment, Long> {
    List<Repayment> findByEmiScheduleIdOrderByPaymentDateDesc(Long emiScheduleId);
}
