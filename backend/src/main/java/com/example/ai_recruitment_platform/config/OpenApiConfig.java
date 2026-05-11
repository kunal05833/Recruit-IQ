package com.example.ai_recruitment_platform.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI configuration.
 * Access the UI at: http://localhost:8080/swagger-ui.html
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "AI Recruitment Platform API",
        version = "1.0.0",
        description = """
            Production-grade REST API for an AI-powered recruitment system.
            
            **Roles:**
            - `CANDIDATE` — upload resume, apply for jobs, run AI interview
            - `RECRUITER` — post jobs, manage applications, view AI rankings
            
            **Authentication:** All protected endpoints require a Bearer JWT token.
            Obtain a token via `POST /api/auth/login`.
            """,
        contact = @Contact(name = "HireAI Support", email = "support@hireai.com")
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Local Development"),
        @Server(url = "https://api.hireai.com", description = "Production")
    },
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "Enter your JWT token (obtained from /api/auth/login)"
)
public class OpenApiConfig {
    // Configuration is annotation-driven — no extra beans needed.
}
