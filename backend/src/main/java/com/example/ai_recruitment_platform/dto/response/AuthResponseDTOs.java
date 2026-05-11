package com.example.ai_recruitment_platform.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

public final class AuthResponseDTOs {

    private AuthResponseDTOs() {}

    // ── Auth Response ─────────────────────────────────────────────────
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Authentication response with tokens")
    public static class AuthResponse {

        @Schema(description = "JWT access token")
        private String accessToken;

        @Schema(description = "Refresh token for obtaining new access tokens")
        private String refreshToken;

        @Schema(example = "rahul@example.com")
        private String email;

        @Schema(example = "CANDIDATE")
        private String role;

        @Schema(description = "User's display name")
        private String name;

        @Schema(description = "Token expiry in milliseconds from now")
        private long expiresIn;
    }
}
