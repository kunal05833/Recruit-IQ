package com.example.ai_recruitment_platform.ai.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionDTO {
    private Long id;
    private String question;
    private String skillTag;
    private String difficultyLevel;
    private Integer questionOrder;
}
