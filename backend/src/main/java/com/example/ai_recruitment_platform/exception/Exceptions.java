package com.example.ai_recruitment_platform.exception;

// ════════════════════════════════════════════════════════════════════════════
//  Custom Exception Hierarchy
//  - ResourceNotFoundException   → 404
//  - DuplicateResourceException  → 409
//  - BadRequestException         → 400
//  - UnauthorizedException       → 401
//  - ForbiddenException          → 403
//  - FileProcessingException     → 422
//  - AiServiceException          → 503
// ════════════════════════════════════════════════════════════════════════════

public final class Exceptions {

    private Exceptions() {}

    // ─── 404 Not Found ────────────────────────────────────────────────────
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String resourceName, Long id) {
            super(resourceName + " not found with id: " + id);
        }
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    // ─── 409 Conflict ─────────────────────────────────────────────────────
    public static class DuplicateResourceException extends RuntimeException {
        public DuplicateResourceException(String message) {
            super(message);
        }
    }

    // ─── 400 Bad Request ──────────────────────────────────────────────────
    public static class BadRequestException extends RuntimeException {
        public BadRequestException(String message) {
            super(message);
        }
    }

    // ─── 401 Unauthorized ─────────────────────────────────────────────────
    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message);
        }
    }

    // ─── 403 Forbidden ────────────────────────────────────────────────────
    public static class ForbiddenException extends RuntimeException {
        public ForbiddenException(String message) {
            super(message);
        }
    }

    // ─── 422 Unprocessable Entity ─────────────────────────────────────────
    public static class FileProcessingException extends RuntimeException {
        public FileProcessingException(String message) {
            super(message);
        }
        public FileProcessingException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    // ─── 503 Service Unavailable ──────────────────────────────────────────
    public static class AiServiceException extends RuntimeException {
        public AiServiceException(String message) {
            super(message);
        }
        public AiServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
