package com.example.ai_recruitment_platform.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_answer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private InterviewQuestion question;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Column(name = "answer_score")
    private Double answerScore; // 0-10

    @Column(name = "confidence_score")
    private Double confidenceScore; // 0-10

    @Column(name = "communication_score")
    private Double communicationScore; // 0-10

    @Column(name = "overall_score")
    private Double overallScore; // 0-10

    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @PrePersist
    public void prePersist() {
        this.submittedAt = LocalDateTime.now();
    }
}
