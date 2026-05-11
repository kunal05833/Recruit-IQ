package com.example.ai_recruitment_platform.dto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatchResponse {
    private double matchPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String candidateName;
    private String jobTitle;
}
