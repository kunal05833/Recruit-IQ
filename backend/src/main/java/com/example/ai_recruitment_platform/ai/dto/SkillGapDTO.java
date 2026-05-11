package com.example.ai_recruitment_platform.ai.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapDTO {
    private String skillName;
    private Long frequency;
    private String recommendation;
}
