package com.example.ai_recruitment_platform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs", indexes = {
    @Index(name = "idx_job_title", columnList = "title"),
    @Index(name = "idx_job_posted_by", columnList = "posted_by")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "required_skills", columnDefinition = "TEXT", nullable = false)
    private String requiredSkills;   // comma-separated, stored lowercase

    @Column(name = "job_type", length = 20)
    private String jobType;          // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP

    @Column(length = 100)
    private String location;

    @Column(name = "experience_required", length = 50)
    private String experienceRequired;

    @Column(name = "salary_lpa")
    private Long salaryLpa;          // annual salary in INR, 0 = not disclosed

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "posted_by")
    private Long postedBy;           // references User.id (recruiter)

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
