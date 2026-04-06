package com.lending.platform.emi.repository;

import com.lending.platform.emi.entity.EmiSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmiScheduleRepository extends JpaRepository<EmiSchedule, Long> {
    List<EmiSchedule> findByLoanApplicationIdOrderByInstallmentNumberAsc(Long loanApplicationId);
}
