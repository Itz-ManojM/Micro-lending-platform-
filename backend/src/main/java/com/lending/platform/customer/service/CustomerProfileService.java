package com.lending.platform.customer.service;

import com.lending.platform.common.exception.ResourceNotFoundException;
import com.lending.platform.customer.dto.CreateCustomerProfileRequest;
import com.lending.platform.customer.dto.CustomerProfileResponse;
import com.lending.platform.customer.entity.CustomerProfile;
import com.lending.platform.customer.repository.CustomerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerProfileService {

    private final CustomerProfileRepository customerProfileRepository;

    public CustomerProfileResponse createProfile(CreateCustomerProfileRequest request) {
        CustomerProfile customerProfile = CustomerProfile.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .employmentType(request.getEmploymentType())
                .monthlyIncome(request.getMonthlyIncome())
                .existingEmiAmount(request.getExistingEmiAmount())
                .build();

        CustomerProfile saved = customerProfileRepository.save(customerProfile);

        return mapToResponse(saved);
    }

    public List<CustomerProfileResponse> getAllProfiles() {
        return customerProfileRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(CustomerProfile::getId))
                .map(this::mapToResponse)
                .toList();
    }

    public CustomerProfile getById(Long id) {
        return customerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found with id: " + id));
    }

    public CustomerProfileResponse getProfileById(Long id) {
        CustomerProfile customerProfile = customerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found with id: " + id));

        return mapToResponse(customerProfile);
    }

    private CustomerProfileResponse mapToResponse(CustomerProfile customerProfile) {
        return CustomerProfileResponse.builder()
                .id(customerProfile.getId())
                .fullName(customerProfile.getFullName())
                .phoneNumber(customerProfile.getPhoneNumber())
                .address(customerProfile.getAddress())
                .employmentType(customerProfile.getEmploymentType())
                .monthlyIncome(customerProfile.getMonthlyIncome())
                .existingEmiAmount(customerProfile.getExistingEmiAmount())
                .build();
    }
}
