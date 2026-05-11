package com.example.ai_recruitment_platform.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications",
    uniqueConstraints = @UniqueConstraint(columnNames = {"candidate_id", "job_id"}))
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "recruiter_note", columnDefinition = "TEXT")
    private String recruiterNote;

    // ── Enum ─────────────────────────────────────────────────────────────────
    public enum ApplicationStatus {
        APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW_SCHEDULED, REJECTED, HIRED
    }

    // ── Constructors ──────────────────────────────────────────────────────────
    public JobApplication() {}

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId()                              { return id; }

    public Long getCandidateId()                     { return candidateId; }
    public void setCandidateId(Long candidateId)     { this.candidateId = candidateId; }

    public Long getJobId()                           { return jobId; }
    public void setJobId(Long jobId)                 { this.jobId = jobId; }

    public ApplicationStatus getStatus()             { return status; }
    public void setStatus(ApplicationStatus status)  {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public String getCoverLetter()                   { return coverLetter; }
    public void setCoverLetter(String coverLetter)   { this.coverLetter = coverLetter; }

    public LocalDateTime getAppliedAt()              { return appliedAt; }
    public void setAppliedAt(LocalDateTime v)        { this.appliedAt = v; }

    public LocalDateTime getUpdatedAt()              { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v)        { this.updatedAt = v; }

    public String getRecruiterNote()                 { return recruiterNote; }
    public void setRecruiterNote(String note)        { this.recruiterNote = note; }
}
