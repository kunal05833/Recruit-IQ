package com.example.ai_recruitment_platform.service;

import com.example.ai_recruitment_platform.ai.dto.JobMatchResult;
import com.example.ai_recruitment_platform.ai.entity.MatchScore;
import com.example.ai_recruitment_platform.ai.repository.MatchScoreRepository;
import com.example.ai_recruitment_platform.ai.service.JobMatchingService;
import com.example.ai_recruitment_platform.ai.service.SkillNormalizationService;
import com.example.ai_recruitment_platform.entity.CandidateProfile;
import com.example.ai_recruitment_platform.entity.CandidateSkill;
import com.example.ai_recruitment_platform.entity.Job;
import com.example.ai_recruitment_platform.exception.Exceptions.ResourceNotFoundException;
import com.example.ai_recruitment_platform.repository.JobRepository;
import com.example.ai_recruitment_platform.repository.ProfileRepository;
import com.example.ai_recruitment_platform.repository.SkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JobMatchingService Unit Tests")
class JobMatchingServiceTest {

    @Mock private MatchScoreRepository matchScoreRepository;
    @Mock private ProfileRepository profileRepository;
    @Mock private SkillRepository skillRepository;
    @Mock private JobRepository jobRepository;
    @Mock private SkillNormalizationService skillNormalizationService;

    @InjectMocks
    private JobMatchingService jobMatchingService;

    private CandidateProfile profile;
    private Job job;

    @BeforeEach
    void setUp() {
        profile = CandidateProfile.builder()
                .id(5L)
                .name("Jane Dev")
                .email("jane@dev.com")
                .build();

        job = Job.builder()
                .id(2L)
                .title("Backend Engineer")
                .requiredSkills("java, spring boot, mysql, docker")
                .build();
    }

    // ── matchCandidateWithJob() ────────────────────────────────────────

    @Test
    @DisplayName("matchCandidateWithJob() — 100% match when candidate has all skills")
    void match_fullMatch() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(jobRepository.findById(2L)).thenReturn(Optional.of(job));
        when(skillRepository.findByProfileId(5L)).thenReturn(List.of(
                skill("java"), skill("spring boot"), skill("mysql"), skill("docker")
        ));
        // Normalize returns skill as-is for simplicity
        when(skillNormalizationService.normalize(anyString())).thenAnswer(i -> i.getArgument(0));
        when(matchScoreRepository.findByCandidateIdAndJobId(5L, 2L)).thenReturn(Optional.empty());

        JobMatchResult result = jobMatchingService.matchCandidateWithJob(1L, 2L);

        assertThat(result.getMatchPercentage()).isEqualTo(100.0);
        assertThat(result.getMatchedSkills()).hasSize(4);
        assertThat(result.getMissingSkills()).isEmpty();
        assertThat(result.getRecommendation()).contains("STRONG");
        verify(matchScoreRepository).save(any(MatchScore.class));
    }

    @Test
    @DisplayName("matchCandidateWithJob() — partial match when candidate has some skills")
    void match_partialMatch() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(jobRepository.findById(2L)).thenReturn(Optional.of(job));
        when(skillRepository.findByProfileId(5L)).thenReturn(List.of(
                skill("java"), skill("spring boot")   // missing: mysql, docker
        ));
        when(skillNormalizationService.normalize(anyString())).thenAnswer(i -> i.getArgument(0));
        when(matchScoreRepository.findByCandidateIdAndJobId(anyLong(), anyLong()))
                .thenReturn(Optional.empty());

        JobMatchResult result = jobMatchingService.matchCandidateWithJob(1L, 2L);

        assertThat(result.getMatchPercentage()).isEqualTo(50.0);
        assertThat(result.getMatchedSkills()).containsExactlyInAnyOrder("java", "spring boot");
        assertThat(result.getMissingSkills()).containsExactlyInAnyOrder("mysql", "docker");
        assertThat(result.getRecommendation()).contains("PARTIAL");
    }

    @Test
    @DisplayName("matchCandidateWithJob() — 0% match when candidate has no matching skills")
    void match_noMatch() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(jobRepository.findById(2L)).thenReturn(Optional.of(job));
        when(skillRepository.findByProfileId(5L)).thenReturn(List.of(
                skill("photoshop"), skill("figma")
        ));
        when(skillNormalizationService.normalize(anyString())).thenAnswer(i -> i.getArgument(0));
        when(matchScoreRepository.findByCandidateIdAndJobId(anyLong(), anyLong()))
                .thenReturn(Optional.empty());

        JobMatchResult result = jobMatchingService.matchCandidateWithJob(1L, 2L);

        assertThat(result.getMatchPercentage()).isEqualTo(0.0);
        assertThat(result.getRecommendation()).contains("WEAK");
    }

    @Test
    @DisplayName("matchCandidateWithJob() — throws ResourceNotFoundException when profile not found")
    void match_profileNotFound_throws() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobMatchingService.matchCandidateWithJob(1L, 2L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("profile");
    }

    @Test
    @DisplayName("matchCandidateWithJob() — throws ResourceNotFoundException when job not found")
    void match_jobNotFound_throws() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(jobRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobMatchingService.matchCandidateWithJob(1L, 999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    @DisplayName("matchCandidateWithJob() — updates existing match score instead of creating new one")
    void match_updatesExistingScore() {
        MatchScore existing = MatchScore.builder()
                .id(50L).candidateId(5L).jobId(2L).matchPercentage(40.0).build();

        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(jobRepository.findById(2L)).thenReturn(Optional.of(job));
        when(skillRepository.findByProfileId(5L)).thenReturn(List.of(
                skill("java"), skill("spring boot"), skill("mysql"), skill("docker")
        ));
        when(skillNormalizationService.normalize(anyString())).thenAnswer(i -> i.getArgument(0));
        when(matchScoreRepository.findByCandidateIdAndJobId(5L, 2L))
                .thenReturn(Optional.of(existing));

        jobMatchingService.matchCandidateWithJob(1L, 2L);

        verify(matchScoreRepository).save(argThat(ms -> ms.getId().equals(50L)));
    }

    // ── Helper ────────────────────────────────────────────────────────

    private CandidateSkill skill(String name) {
        return CandidateSkill.builder().skillName(name).profile(profile).build();
    }
}
