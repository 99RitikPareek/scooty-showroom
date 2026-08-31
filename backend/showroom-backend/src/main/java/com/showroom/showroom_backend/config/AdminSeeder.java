package com.showroom.showroom_backend.config;

import com.showroom.showroom_backend.entity.Admin;
import com.showroom.showroom_backend.entity.Brand;
import com.showroom.showroom_backend.repository.AdminRepository;
import com.showroom.showroom_backend.repository.BrandRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final BrandRepository brandRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(
            AdminRepository adminRepository,
            BrandRepository brandRepository,
            PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.brandRepository = brandRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        adminRepository.findByEmail("admin@showroom.com").ifPresentOrElse(
                admin -> {
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole("ADMIN");
                    admin.setActive(true);
                    adminRepository.save(admin);
                    System.out.println("Admin user updated: admin@showroom.com / admin123");
                },
                () -> {
                    Admin admin = new Admin();
                    admin.setName("Showroom Admin");
                    admin.setEmail("admin@showroom.com");
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole("ADMIN");
                    admin.setActive(true);
                    adminRepository.save(admin);
                    System.out.println("Default admin user created: admin@showroom.com / admin123");
                }
        );

        if (brandRepository.count() == 0) {
            Brand suzuki = new Brand("Suzuki", "https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2015.png");
            suzuki.setActive(true);
            brandRepository.save(suzuki);
            System.out.println("Default brand created: Suzuki");
        }
    }
}
