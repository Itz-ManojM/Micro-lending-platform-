package com.lending.platform.customer.entity;

import com.lending.platform.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "customer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String phoneNumber;

    private String address;

    private String employmentType;

    private BigDecimal monthlyIncome;

    private BigDecimal existingEmiAmount;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
