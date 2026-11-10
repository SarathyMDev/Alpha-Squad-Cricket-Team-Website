package cricketbackend.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import cricketbackend.entity.Admin;
import cricketbackend.repository.AdminRepository;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String username = System.getenv("ADMIN_USERNAME");
            String password = System.getenv("ADMIN_PASSWORD");

            if (username == null || username.isBlank()
                    || password == null || password.length() < 12) {

                System.out.println(
                    "Admin not created. Set ADMIN_USERNAME and ADMIN_PASSWORD."
                );
                return;
            }

            if (adminRepository.findByUsername(username).isEmpty()) {

                Admin admin = new Admin();

                admin.setUsername(username);
                admin.setPassword(passwordEncoder.encode(password));
                admin.setRole("ADMIN");

                adminRepository.save(admin);

                System.out.println("Administrator account created successfully!");

            } else {
                System.out.println("Administrator account already exists.");
            }
        };
    }
}