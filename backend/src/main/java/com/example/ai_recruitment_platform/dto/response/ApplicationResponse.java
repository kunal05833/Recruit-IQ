package com.example.ai_recruitment_platform.dto.response;

import com.example.ai_recruitment_platform.entity.JobApplication.ApplicationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "Job application details")
public class ApplicationResponse {

    private Long id;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private Long jobId;
    private String jobTitle;
    private ApplicationStatus status;
    private String coverLetter;
    private String recruiterNote;
    private Double matchPercentage;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
