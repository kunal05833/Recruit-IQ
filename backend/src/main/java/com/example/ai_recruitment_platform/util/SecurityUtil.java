package com.example.ai_recruitment_platform.util;

import com.example.ai_recruitment_platform.entity.User;
import com.example.ai_recruitment_platform.exception.Exceptions.ResourceNotFoundException;
import com.example.ai_recruitment_platform.exception.Exceptions.UnauthorizedException;
import com.example.ai_recruitment_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Centralized security helper to resolve the currently authenticated user.
 * Eliminates copy-paste of SecurityContextHolder logic across every controller.
 */
@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final UserRepository userRepository;

    /**
     * Returns the authenticated user entity, or throws 401 if unauthenticated.
     */
    public User getCurrentUser() {
        String email = getCurrentEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));
    }

    /**
     * Returns the authenticated user's ID.
     */
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    /**
     * Returns the authenticated user's email.
     */
    public String getCurrentEmail() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UnauthorizedException("No authenticated user found in security context.");
        }
        return auth.getName();
    }
}
