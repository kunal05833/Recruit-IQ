package com.example.ai_recruitment_platform.dto.request;

import com.example.ai_recruitment_platform.entity.JobApplication.ApplicationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Update application status payload")
public class UpdateApplicationStatusRequest {

    @NotNull(message = "Status is required")
    @Schema(allowableValues = {"APPLIED","UNDER_REVIEW","SHORTLISTED","INTERVIEW_SCHEDULED","REJECTED","HIRED"})
    private ApplicationStatus status;

    @Schema(example = "Strong technical background, recommended for next round")
    private String recruiterNote;
}
