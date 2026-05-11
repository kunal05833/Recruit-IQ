package com.example.ai_recruitment_platform.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Value("${app.cors.allowed-origins}")
    private String allowedOriginsRaw;

    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/auth/**",
            "/ws/notifications/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/api-docs/**",
            "/actuator/health"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()

                // Notifications — sabke liye (any authenticated user)
                .requestMatchers("/api/notifications/**").authenticated()

                // Admin only
.requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

// Recruiter or Admin
.requestMatchers("/api/candidates/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
.requestMatchers(HttpMethod.DELETE, "/api/jobs/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
.requestMatchers(HttpMethod.POST,   "/api/jobs/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
.requestMatchers("/api/applications/job/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
.requestMatchers("/api/ai/match/job/*/ranking").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")
.requestMatchers("/api/ai/analytics/**").hasAnyAuthority("ROLE_RECRUITER", "ROLE_ADMIN")

// Candidate only
.requestMatchers("/api/resume/**").hasAuthority("ROLE_CANDIDATE")
.requestMatchers("/api/profile/**").hasAuthority("ROLE_CANDIDATE")
.requestMatchers("/api/applications/my**").hasAuthority("ROLE_CANDIDATE")
.requestMatchers("/api/applications/apply**").hasAuthority("ROLE_CANDIDATE")
.requestMatchers("/api/applications/*/withdraw**").hasAuthority("ROLE_CANDIDATE")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOriginsRaw.split(","))
                .map(String::trim)
                .toList();
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}