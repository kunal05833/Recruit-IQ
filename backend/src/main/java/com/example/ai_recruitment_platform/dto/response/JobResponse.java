package com.example.ai_recruitment_platform.dto.response;

import com.example.ai_recruitment_platform.entity.Job;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "Job posting details")
public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String requiredSkills;
    private String jobType;
    private String location;
    private String experienceRequired;
    private Long salaryLpa;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static JobResponse from(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requiredSkills(job.getRequiredSkills())
                .jobType(job.getJobType())
                .location(job.getLocation())
                .experienceRequired(job.getExperienceRequired())
                .salaryLpa(job.getSalaryLpa())
                .active(job.isActive())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
