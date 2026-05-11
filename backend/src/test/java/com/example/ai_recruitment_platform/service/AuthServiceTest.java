package com.example.ai_recruitment_platform.service;

import com.example.ai_recruitment_platform.config.JwtUtil;
import com.example.ai_recruitment_platform.dto.request.AuthDTOs.LoginRequest;
import com.example.ai_recruitment_platform.dto.request.AuthDTOs.RegisterRequest;
import com.example.ai_recruitment_platform.dto.response.AuthResponseDTOs.AuthResponse;
import com.example.ai_recruitment_platform.entity.RefreshToken;
import com.example.ai_recruitment_platform.entity.User;
import com.example.ai_recruitment_platform.exception.Exceptions.DuplicateResourceException;
import com.example.ai_recruitment_platform.exception.Exceptions.UnauthorizedException;
import com.example.ai_recruitment_platform.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private RefreshToken sampleRefreshToken;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Rahul Sharma")
                .email("rahul@example.com")
                .password("encoded_password")
                .role(User.Role.CANDIDATE)
                .build();

        sampleRefreshToken = RefreshToken.builder()
                .id(1L)
                .user(sampleUser)
                .token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plusSeconds(604800))
                .build();
    }

    // ── register() ────────────────────────────────────────────────────

    @Test
    @DisplayName("register() — success with valid CANDIDATE credentials")
    void register_success() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Rahul Sharma");
        req.setEmail("rahul@example.com");
        req.setPassword("SecurePass1");
        req.setRole("CANDIDATE");

        when(userRepository.existsByEmail("rahul@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtUtil.generateAccessToken(anyString(), anyString())).thenReturn("mock_access_token");
        when(refreshTokenService.createRefreshToken(any(User.class))).thenReturn(sampleRefreshToken);

        AuthResponse response = authService.register(req);

        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("rahul@example.com");
        assertThat(response.getRole()).isEqualTo("CANDIDATE");
        assertThat(response.getAccessToken()).isEqualTo("mock_access_token");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register() — throws DuplicateResourceException when email already exists")
    void register_duplicateEmail_throws() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("rahul@example.com");
        req.setRole("CANDIDATE");
        req.setPassword("SecurePass1");

        when(userRepository.existsByEmail("rahul@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("already registered");
    }

    @Test
    @DisplayName("register() — throws BadRequestException for invalid role")
    void register_invalidRole_throws() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("new@example.com");
        req.setPassword("SecurePass1");
        req.setRole("ADMIN");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(com.example.ai_recruitment_platform.exception.Exceptions.BadRequestException.class)
                .hasMessageContaining("Invalid role");
    }

    // ── login() ───────────────────────────────────────────────────────

    @Test
    @DisplayName("login() — success with correct credentials")
    void login_success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("rahul@example.com");
        req.setPassword("SecurePass1");

        when(userRepository.findByEmail("rahul@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("SecurePass1", "encoded_password")).thenReturn(true);
        when(jwtUtil.generateAccessToken(anyString(), anyString())).thenReturn("access_token");
        when(refreshTokenService.createRefreshToken(any())).thenReturn(sampleRefreshToken);

        AuthResponse response = authService.login(req);

        assertThat(response.getEmail()).isEqualTo("rahul@example.com");
        assertThat(response.getAccessToken()).isEqualTo("access_token");
    }

    @Test
    @DisplayName("login() — throws UnauthorizedException with wrong password")
    void login_wrongPassword_throws() {
        LoginRequest req = new LoginRequest();
        req.setEmail("rahul@example.com");
        req.setPassword("WrongPass1");

        when(userRepository.findByEmail("rahul@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPass1", "encoded_password")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    @DisplayName("login() — throws UnauthorizedException when user not found")
    void login_userNotFound_throws() {
        LoginRequest req = new LoginRequest();
        req.setEmail("nobody@example.com");
        req.setPassword("AnyPass1");

        when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(UnauthorizedException.class);
    }

    // ── logout() ──────────────────────────────────────────────────────

    @Test
    @DisplayName("logout() — revokes refresh tokens for user")
    void logout_revokesTokens() {
        authService.logout(1L);
        verify(refreshTokenService).revokeByUserId(1L);
    }
}
