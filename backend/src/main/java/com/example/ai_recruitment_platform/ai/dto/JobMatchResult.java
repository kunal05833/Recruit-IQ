package com.example.ai_recruitment_platform.ai.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobMatchResult {
    private String candidateName;
    private String jobTitle;
    private double matchPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String recommendation;
}
