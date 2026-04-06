package com.lending.platform.repayment.entity;

import com.lending.platform.emi.entity.EmiSchedule;
import com.lending.platform.repayment.enums.RepaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "repayments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Repayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amountPaid;

    @Column(nullable = false)
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RepaymentStatus status;

    private String paymentMethod;

    @ManyToOne
    @JoinColumn(name = "emi_schedule_id", nullable = false)
    private EmiSchedule emiSchedule;
}
