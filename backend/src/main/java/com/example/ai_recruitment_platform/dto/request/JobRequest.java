package com.example.ai_recruitment_platform.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Schema(description = "Payload for creating or updating a job posting")
public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(min = 3, max = 100, message = "Title must be 3–100 characters")
    @Schema(example = "Senior Java Developer")
    private String title;

    @Size(max = 3000, message = "Description cannot exceed 3000 characters")
    @Schema(example = "We are looking for a backend engineer experienced in Spring Boot...")
    private String description;

    @NotBlank(message = "Required skills cannot be empty")
    @Size(min = 2, max = 500, message = "Skills must be 2–500 characters")
    @Schema(example = "java, spring boot, hibernate, mysql, docker", description = "Comma-separated list of required skills")
    private String requiredSkills;

    @Schema(example = "FULL_TIME", allowableValues = {"FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"})
    private String jobType;

    @Schema(example = "Bangalore, India")
    private String location;

    @Schema(example = "3-5 years")
    private String experienceRequired;

    @Min(value = 0, message = "Salary must be non-negative")
    @Schema(example = "1500000", description = "Annual salary in INR (0 = not disclosed)")
    private Long salaryLpa;
}
