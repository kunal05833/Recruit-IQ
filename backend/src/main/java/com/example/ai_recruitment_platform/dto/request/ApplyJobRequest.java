package com.example.ai_recruitment_platform.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Payload for applying to a job")
public class ApplyJobRequest {

    @NotNull(message = "Job ID is required")
    @Schema(example = "42")
    private Long jobId;

    @Schema(example = "I am a strong candidate for this role because...")
    private String coverLetter;
}
