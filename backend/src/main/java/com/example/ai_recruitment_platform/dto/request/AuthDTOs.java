package com.example.ai_recruitment_platform.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

public final class AuthDTOs {

    private AuthDTOs() {}

    // ── Register Request ──────────────────────────────────────────────
    @Data
    @Schema(description = "User registration payload")
    public static class RegisterRequest {

        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be 2–100 characters")
        @Schema(example = "Rahul Sharma")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Schema(example = "rahul@example.com")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
        )
        @Schema(example = "SecurePass1")
        private String password;

        @NotBlank(message = "Role is required")
        @Pattern(regexp = "^(CANDIDATE|RECRUITER)$", message = "Role must be CANDIDATE or RECRUITER")
        @Schema(example = "CANDIDATE", allowableValues = {"CANDIDATE", "RECRUITER"})
        private String role;
    }

    // ── Login Request ─────────────────────────────────────────────────
    @Data
    @Schema(description = "User login payload")
    public static class LoginRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Schema(example = "rahul@example.com")
        private String email;

        @NotBlank(message = "Password is required")
        @Schema(example = "SecurePass1")
        private String password;
    }

    // ── Refresh Token Request ─────────────────────────────────────────
    @Data
    @Schema(description = "Refresh token payload")
    public static class RefreshTokenRequest {

        @NotBlank(message = "Refresh token is required")
        private String refreshToken;
    }

    // ── Change Password Request ───────────────────────────────────────
    @Data
    @Schema(description = "Change password payload")
    public static class ChangePasswordRequest {

        @NotBlank(message = "Current password is required")
        private String currentPassword;

        @NotBlank(message = "New password is required")
        @Size(min = 8, message = "New password must be at least 8 characters")
        @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
            message = "Password must contain uppercase, lowercase, and a digit"
        )
        private String newPassword;

        @NotBlank(message = "Please confirm your new password")
        private String confirmPassword;
    }
}
