package com.example.ai_recruitment_platform.dto.request;

import com.example.ai_recruitment_platform.entity.JobApplication.ApplicationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public final class ApplicationDTOs {

    private ApplicationDTOs() {}

    @Data
    @Schema(description = "Payload for applying to a job")
    public static class ApplyJobRequestDto {

        @NotNull(message = "Job ID is required")
        @Schema(example = "42")
        private Long jobId;

        @Schema(example = "I am a strong candidate for this role because...")
        private String coverLetter;
    }

    @Data
    @Schema(description = "Update application status payload")
    public static class UpdateStatusRequestDto {

        @NotNull(message = "Status is required")
        @Schema(allowableValues = {"APPLIED","UNDER_REVIEW","SHORTLISTED","INTERVIEW_SCHEDULED","REJECTED","HIRED"})
        private ApplicationStatus status;

        @Schema(example = "Strong technical background, recommended for next round")
        private String recruiterNote;
    }
}
