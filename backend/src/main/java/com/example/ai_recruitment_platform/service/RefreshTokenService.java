package com.example.ai_recruitment_platform.service;

import com.example.ai_recruitment_platform.entity.RefreshToken;
import com.example.ai_recruitment_platform.entity.User;
import com.example.ai_recruitment_platform.exception.Exceptions.UnauthorizedException;
import com.example.ai_recruitment_platform.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Manages refresh token creation, validation, and rotation.
 * On each refresh, the old token is deleted and a new one is issued (token rotation).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpirationMs;

    /**
     * Creates (or replaces) a refresh token for the given user.
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Delete any existing token for this user (one token per user)
        refreshTokenRepository.deleteByUserId(user.getId());

        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plusMillis(refreshExpirationMs))
                .build();

        return refreshTokenRepository.save(token);
    }

    /**
     * Validates a refresh token string and returns the associated token entity.
     * Throws UnauthorizedException if invalid or expired.
     */
    public RefreshToken validateRefreshToken(String tokenValue) {
        RefreshToken token = refreshTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token. Please log in again."));

        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            log.warn("Expired refresh token used for user: {}", token.getUser().getEmail());
            throw new UnauthorizedException("Refresh token has expired. Please log in again.");
        }

        return token;
    }

    /**
     * Invalidates all tokens for a user (used on logout).
     */
    @Transactional
    public void revokeByUserId(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
        log.info("Revoked all refresh tokens for userId: {}", userId);
    }
}
