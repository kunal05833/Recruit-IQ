// src/main/java/com/example/ai_recruitment_platform/service/ProfileService.java
package com.example.ai_recruitment_platform.service;

import com.example.ai_recruitment_platform.dto.ProfileConfirmRequest;
import com.example.ai_recruitment_platform.dto.response.CandidateProfileDTO;
import com.example.ai_recruitment_platform.entity.CandidateProfile;
import com.example.ai_recruitment_platform.entity.CandidateSkill;
import com.example.ai_recruitment_platform.entity.User;
import com.example.ai_recruitment_platform.exception.Exceptions.ResourceNotFoundException;
import com.example.ai_recruitment_platform.notification.service.NotificationEventPublisher;
import com.example.ai_recruitment_platform.repository.ProfileRepository;
import com.example.ai_recruitment_platform.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final ProfileRepository          profileRepository;
    private final SecurityUtil               securityUtil;
    private final NotificationEventPublisher eventPublisher;

    @Transactional
    public CandidateProfileDTO confirmProfile(ProfileConfirmRequest request) {
        User user = securityUtil.getCurrentUser();

        CandidateProfile profile = profileRepository
                .findByUserId(user.getId())
                .orElse(CandidateProfile.builder().user(user).build());

        boolean isNew = profile.getId() == null;

        // Basic fields set karo
        profile.setName(request.getName() != null ? request.getName().trim() : "");
        profile.setEmail(request.getEmail() != null ? request.getEmail().trim() : "");
        profile.setHeadline(request.getHeadline());
        profile.setLocation(request.getLocation());
        profile.setExperience(request.getExperience());
        profile.setEducation(request.getEducation());

        // FIX: Skills pehle clear karo profile object se — orphanRemoval handle karega
        // flush/deleteAll alag se mat karo — EAGER + orphanRemoval conflict se bachao
        if (profile.getSkills() != null) {
            profile.getSkills().clear();
        }

        // Profile save karo (skills cleared state mein)
        CandidateProfile savedProfile = profileRepository.saveAndFlush(profile);
        log.info("Profile saved for userId={}, profileId={}", user.getId(), savedProfile.getId());

        // Naye skills build karo aur add karo
        List<String> skillNames = request.getSkills();
        if (skillNames != null && !skillNames.isEmpty()) {
            List<CandidateSkill> newSkills = skillNames.stream()
                    .filter(s -> s != null && !s.isBlank())
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .distinct()
                    .map(skillName -> CandidateSkill.builder()
                            .profile(savedProfile)
                            .skillName(skillName)
                            .build())
                    .toList();

            // Skills collection mein add karo — orphanRemoval + cascade handle karega
            savedProfile.getSkills().addAll(newSkills);
            profileRepository.saveAndFlush(savedProfile);
            log.info("Saved {} skills for userId={}", newSkills.size(), user.getId());
        }

        // Notification — sirf naya profile bana tab
        if (isNew) {
            eventPublisher.publishProfileGenerated(user.getId(), savedProfile.getName());
        }

        return CandidateProfileDTO.from(savedProfile);
    }

    @Transactional(readOnly = true)
    public CandidateProfileDTO getMyProfile() {
        User user = securityUtil.getCurrentUser();

        CandidateProfile profile = profileRepository
                .findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Profile not found. Please upload your resume first."));

        return CandidateProfileDTO.from(profile);
    }
}