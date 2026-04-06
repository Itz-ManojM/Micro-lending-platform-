package com.lending.platform.security.bootstrap;

import com.lending.platform.user.entity.Role;
import com.lending.platform.user.entity.User;
import com.lending.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class StaffAccountSeeder {

    @Value("${app.staff.seed.full-name}")
    private String fullName;

    @Value("${app.staff.seed.email}")
    private String email;

    @Value("${app.staff.seed.password}")
    private String password;

    @Bean
    public CommandLineRunner seedStaffAccount(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            User staffAccount = userRepository.findByEmailIgnoreCase(email)
                    .orElse(User.builder().email(email).build());

            staffAccount.setFullName(fullName);
            staffAccount.setEmail(email.toLowerCase());
            staffAccount.setPassword(passwordEncoder.encode(password));
            staffAccount.setRole(Role.ADMIN);

            userRepository.save(staffAccount);
        };
    }
}
