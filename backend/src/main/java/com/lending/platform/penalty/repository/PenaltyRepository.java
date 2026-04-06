package com.lending.platform.penalty.repository;

import com.lending.platform.penalty.entity.Penalty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PenaltyRepository extends JpaRepository<Penalty, Long> {
    Optional<Penalty> findByEmiScheduleId(Long emiScheduleId);
    List<Penalty> findByEmiScheduleIdOrderByAppliedDateDesc(Long emiScheduleId);
}
