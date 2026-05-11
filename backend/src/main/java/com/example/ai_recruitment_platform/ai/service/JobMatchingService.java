package com.example.ai_recruitment_platform.ai.service;

import com.example.ai_recruitment_platform.ai.dto.JobMatchResult;
import com.example.ai_recruitment_platform.ai.dto.RankedCandidateDTO;
import com.example.ai_recruitment_platform.ai.entity.MatchScore;
import com.example.ai_recruitment_platform.ai.repository.MatchScoreRepository;
import com.example.ai_recruitment_platform.entity.CandidateProfile;
import com.example.ai_recruitment_platform.entity.CandidateSkill;
import com.example.ai_recruitment_platform.entity.Job;
import com.example.ai_recruitment_platform.exception.Exceptions.ResourceNotFoundException;
import com.example.ai_recruitment_platform.repository.JobRepository;
import com.example.ai_recruitment_platform.repository.ProfileRepository;
import com.example.ai_recruitment_platform.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobMatchingService {

    private final MatchScoreRepository matchScoreRepository;
    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final JobRepository jobRepository;
    private final SkillNormalizationService skillNormalizationService;

    @Transactional
    public JobMatchResult matchCandidateWithJob(Long userId, Long jobId) {
        log.info("Matching userId={} with jobId={}", userId, jobId);

        // FIX 1: Profile nahi bani — 404 dega, frontend handle karega
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Profile not found. Please upload your resume first."));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));

        // Candidate skills (normalized)
        List<CandidateSkill> skillEntities = skillRepository.findByProfileId(profile.getId());
        Set<String> candidateSkills = skillEntities.stream()
                .map(s -> skillNormalizationService.normalize(s.getSkillName()))
                .filter(Objects::nonNull)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toSet());

        // FIX 2: getRequiredSkills() null check — NPE se bachao
        String requiredSkillsRaw = job.getRequiredSkills();
        if (requiredSkillsRaw == null || requiredSkillsRaw.isBlank()) {
            log.warn("Job {} has no required skills defined", jobId);
            return buildResult(profile, job, 0.0, List.of(), List.of());
        }

        List<String> requiredSkills = Arrays.stream(requiredSkillsRaw.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(skillNormalizationService::normalize)
                .filter(Objects::nonNull)
                .filter(s -> !s.isBlank())
                .distinct()
                .collect(Collectors.toList());

        if (requiredSkills.isEmpty()) {
            log.warn("Job {} required skills empty after parsing", jobId);
            return buildResult(profile, job, 0.0, List.of(), List.of());
        }

        List<String> matchedSkills = requiredSkills.stream()
                .filter(candidateSkills::contains)
                .collect(Collectors.toList());

        List<String> missingSkills = requiredSkills.stream()
                .filter(s -> !candidateSkills.contains(s))
                .collect(Collectors.toList());

        double matchPct = Math.round(
                ((double) matchedSkills.size() / requiredSkills.size()) * 10000.0) / 100.0;

        saveMatchScore(profile.getId(), jobId, matchPct, matchedSkills, missingSkills);

        return buildResult(profile, job, matchPct, matchedSkills, missingSkills);
    }

    public List<RankedCandidateDTO> getRankedCandidatesForJob(Long jobId) {
        log.info("Fetching ranked candidates for jobId={}", jobId);

        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job not found: " + jobId);
        }

        return matchScoreRepository.findByJobIdOrderByMatchPercentageDesc(jobId)
                .stream()
                .map(ms -> {
                    Optional<CandidateProfile> profileOpt =
                            profileRepository.findById(ms.getCandidateId());
                    return RankedCandidateDTO.builder()
                            .candidateId(ms.getCandidateId())
                            .candidateName(profileOpt.map(CandidateProfile::getName).orElse("Unknown"))
                            .candidateEmail(profileOpt.map(CandidateProfile::getEmail).orElse("Unknown"))
                            .matchPercentage(ms.getMatchPercentage())
                            .matchedSkills(ms.getMatchedSkills() != null
                                    ? Arrays.asList(ms.getMatchedSkills().split(","))
                                    : List.of())
                            .missingSkills(ms.getMissingSkills() != null
                                    ? Arrays.asList(ms.getMissingSkills().split(","))
                                    : List.of())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // ─── Private Helpers ──────────────────────────────────────────────

    private void saveMatchScore(Long profileId, Long jobId, double matchPct,
                                List<String> matched, List<String> missing) {
        MatchScore score = matchScoreRepository
                .findByCandidateIdAndJobId(profileId, jobId)
                .orElse(MatchScore.builder()
                        .candidateId(profileId)
                        .jobId(jobId)
                        .build());

        score.setMatchPercentage(matchPct);
        score.setMatchedSkills(String.join(",", matched));
        score.setMissingSkills(String.join(",", missing));
        matchScoreRepository.save(score);
    }

    private JobMatchResult buildResult(CandidateProfile profile, Job job,
                                       double matchPct,
                                       List<String> matched, List<String> missing) {
        return JobMatchResult.builder()
                .candidateName(profile.getName())
                .jobTitle(job.getTitle())
                .matchPercentage(matchPct)
                .matchedSkills(matched)
                .missingSkills(missing)
                .recommendation(matchPct >= 70 ? "STRONG MATCH ✅" :
                        matchPct >= 40 ? "PARTIAL MATCH ⚠️" : "WEAK MATCH ❌")
                .build();
    }
}