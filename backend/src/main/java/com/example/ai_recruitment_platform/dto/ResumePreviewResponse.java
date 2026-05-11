package com.example.ai_recruitment_platform.dto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResumePreviewResponse {
    private String extractedName;
    private String extractedEmail;
    private String experience;
    private String education;
    private List<String> skills;
    private String rawText;
    private String message;
}
