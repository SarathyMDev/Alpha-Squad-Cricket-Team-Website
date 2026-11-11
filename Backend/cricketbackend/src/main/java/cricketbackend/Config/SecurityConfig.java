package cricketbackend.Config;

import java.util.List;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;

import org.springframework.http.HttpMethod;

import cricketbackend.repository.AdminRepository;

@Configuration
public class SecurityConfig {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfig(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOrigins(
    List.of(
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://alpha-squad-cricket-team-website.netlify.app"
    )
);

    configuration.setAllowedMethods(
        List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
    );

    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
        new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", configuration);

    return source;
}

    @Bean
    public UserDetailsService userDetailsService() {

        return username -> adminRepository.findByUsername(username)
                .map(admin -> org.springframework.security.core.userdetails.User
                        .withUsername(admin.getUsername())
                        .password(admin.getPassword())
                        .roles(admin.getRole())
                        .build())
                .orElseThrow(() ->
                        new org.springframework.security.core.userdetails.UsernameNotFoundException(
                                "Admin not found"));
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

    DaoAuthenticationProvider provider =
            new DaoAuthenticationProvider(userDetailsService());

    provider.setPasswordEncoder(passwordEncoder);

    return provider;
    }

    @Bean
public AuthenticationManager authenticationManager(
        AuthenticationConfiguration configuration)
        throws Exception {

    return configuration.getAuthenticationManager();
}

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
    session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
)
            .authenticationProvider(authenticationProvider())
            .authorizeHttpRequests(auth -> auth
               .requestMatchers(
    "/api/players/**",
    "/api/matches/**",
    "/api/statistics/**"
).permitAll()
.requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
.requestMatchers("/api/auth/login").permitAll()
.requestMatchers("/api/contact", "/api/contact/**").hasRole("ADMIN")
.requestMatchers("/api/admin/**").hasRole("ADMIN")
.anyRequest().permitAll()
            );
            

        return http.build();
    }
}