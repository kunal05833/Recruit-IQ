package com.example.ai_recruitment_platform.ai.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RankedCandidateDTO {
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private double matchPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;
}
