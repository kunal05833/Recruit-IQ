package com.example.ai_recruitment_platform.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "match_score")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "match_percentage")
    private Double matchPercentage;

    @Column(name = "matched_skills", columnDefinition = "TEXT")
    private String matchedSkills; // comma-separated

    @Column(name = "missing_skills", columnDefinition = "TEXT")
    private String missingSkills; // comma-separated

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
