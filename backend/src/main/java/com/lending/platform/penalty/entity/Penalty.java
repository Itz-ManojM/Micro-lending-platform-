package com.lending.platform.penalty.entity;

import com.lending.platform.emi.entity.EmiSchedule;
import com.lending.platform.penalty.enums.PenaltyStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "penalties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Penalty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal penaltyAmount;

    @Column(nullable = false)
    private LocalDate appliedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PenaltyStatus status;

    private String reason;

    @ManyToOne
    @JoinColumn(name = "emi_schedule_id", nullable = false)
    private EmiSchedule emiSchedule;
}
