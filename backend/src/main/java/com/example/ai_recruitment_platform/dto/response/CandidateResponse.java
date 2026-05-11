package com.example.ai_recruitment_platform.dto.response;

import com.example.ai_recruitment_platform.entity.CandidateProfile;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Schema(description = "Candidate profile details")
public class CandidateResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String experience;
    private String education;
    private List<String> skills;
    private LocalDateTime createdAt;

    public static CandidateResponse from(CandidateProfile profile) {
        List<String> skillNames = profile.getSkills() == null ? List.of()
                : profile.getSkills().stream().map(s -> s.getSkillName()).toList();
        return CandidateResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .name(profile.getName())
                .email(profile.getEmail())
                .experience(profile.getExperience())
                .education(profile.getEducation())
                .skills(skillNames)
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
