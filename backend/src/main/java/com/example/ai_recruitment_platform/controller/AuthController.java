package com.example.ai_recruitment_platform.controller;

import com.example.ai_recruitment_platform.dto.request.AuthDTOs.*;
import com.example.ai_recruitment_platform.dto.response.ApiResponse;
import com.example.ai_recruitment_platform.dto.response.AuthResponseDTOs.AuthResponse;
import com.example.ai_recruitment_platform.service.AuthService;
import com.example.ai_recruitment_platform.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, token refresh, and password management")
public class AuthController {

    private final AuthService authService;
    private final SecurityUtil securityUtil;

    // ── Register ──────────────────────────────────────────────────────

    @Operation(summary = "Register a new user", description = "Creates a CANDIDATE or RECRUITER account.")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    // ── Login ─────────────────────────────────────────────────────────

    @Operation(summary = "Login", description = "Returns access token + refresh token.")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    // ── Refresh Token ─────────────────────────────────────────────────

    @Operation(summary = "Refresh access token",
               description = "Provide a valid refresh token to get a new access token. Old refresh token is invalidated (rotation).")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshAccessToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    // ── Logout ────────────────────────────────────────────────────────

    @Operation(summary = "Logout", description = "Revokes all refresh tokens for the current user.")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        Long userId = securityUtil.getCurrentUserId();
        authService.logout(userId);
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }

    // ── Change Password ───────────────────────────────────────────────

    @Operation(summary = "Change password", description = "Changes password for the currently authenticated user.")
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(securityUtil.getCurrentUser(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully. Please log in again."));
    }
}
