package com.example.ai_recruitment_platform.ai.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDashboardDTO {
    private String candidateName;
    private int totalJobsApplied;
    private double averageMatchScore;
    private String bestMatchedJob;
    private double bestMatchScore;
    private int totalInterviewsGiven;
    private double averageOverallScore;
    private double averageAnswerScore;
    private double averageConfidenceScore;
    private double averageCommunicationScore;
    private List<SkillGapDTO> skillGaps;
    private String performanceSummary;
}
