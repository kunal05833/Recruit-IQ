package com.example.ai_recruitment_platform.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAnswerRequest {

    @NotNull(message = "questionId is required")
    private Long questionId;

    @NotBlank(message = "answer cannot be blank")
    private String answer;
}
