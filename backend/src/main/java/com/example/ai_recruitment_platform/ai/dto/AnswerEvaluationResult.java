package com.example.ai_recruitment_platform.ai.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerEvaluationResult {
    private double answerScore;
    private double confidenceScore;
    private double communicationScore;
    private double overallScore;
    private String feedback;
}
