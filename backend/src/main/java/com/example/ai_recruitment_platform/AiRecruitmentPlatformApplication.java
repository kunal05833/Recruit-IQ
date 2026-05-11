package com.example.ai_recruitment_platform;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
@Slf4j
public class AiRecruitmentPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiRecruitmentPlatformApplication.class, args);
        log.info("╔══════════════════════════════════════════════════╗");
        log.info("║    AI Recruitment Platform — Started 🚀          ║");
        log.info("║    Swagger UI: http://localhost:8080/swagger-ui.html  ║");
        log.info("║    API Docs:   http://localhost:8080/api-docs         ║");
        log.info("╚══════════════════════════════════════════════════╝");
    }
}
