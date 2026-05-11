package com.example.ai_recruitment_platform.dto.response;

import com.example.ai_recruitment_platform.entity.CandidateProfile;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Data
@Builder
public class CandidateProfileDTO {

    private Long          id;
    private Long          userId;
    private String        name;
    private String        email;
    private String        headline;
    private String        location;
    private String        experience;
    private String        education;
    private List<String>  skills;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CandidateProfileDTO from(CandidateProfile profile) {
        List<String> skillNames = Collections.emptyList();

        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            skillNames = profile.getSkills().stream()
                    .filter(s -> s != null && s.getSkillName() != null)
                    .map(s -> s.getSkillName())
                    .toList();
        }

        return CandidateProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .name(profile.getName())
                .email(profile.getEmail())
                .headline(profile.getHeadline())
                .location(profile.getLocation())
                .experience(profile.getExperience())
                .education(profile.getEducation())
                .skills(skillNames)
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}