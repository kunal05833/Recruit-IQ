package com.example.ai_recruitment_platform.ai.service;

import com.example.ai_recruitment_platform.ai.dto.AnalyticsDashboardDTO;
import com.example.ai_recruitment_platform.ai.dto.CandidatePerformanceDTO;
import com.example.ai_recruitment_platform.ai.dto.SkillGapDTO;
import com.example.ai_recruitment_platform.ai.entity.InterviewAnswer;
import com.example.ai_recruitment_platform.ai.entity.MatchScore;
import com.example.ai_recruitment_platform.ai.repository.InterviewAnswerRepository;
import com.example.ai_recruitment_platform.ai.repository.MatchScoreRepository;
import com.example.ai_recruitment_platform.entity.CandidateProfile;
import com.example.ai_recruitment_platform.entity.Job;
import com.example.ai_recruitment_platform.repository.JobRepository;
import com.example.ai_recruitment_platform.repository.ProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIAnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AIAnalyticsService.class);

    private final MatchScoreRepository matchScoreRepository;
    private final InterviewAnswerRepository answerRepository;
    private final ProfileRepository profileRepository;
    private final JobRepository jobRepository;

    public AIAnalyticsService(MatchScoreRepository matchScoreRepository,
                               InterviewAnswerRepository answerRepository,
                               ProfileRepository profileRepository,
                               JobRepository jobRepository) {
        this.matchScoreRepository = matchScoreRepository;
        this.answerRepository     = answerRepository;
        this.profileRepository    = profileRepository;
        this.jobRepository        = jobRepository;
    }

    // ── Candidate Dashboard ───────────────────────────────────────────────────
    public AnalyticsDashboardDTO getCandidateDashboard(Long candidateId) {
        log.info("Building analytics dashboard for candidate {}", candidateId);

        CandidateProfile profile = profileRepository.findByUserId(candidateId)
                .orElseThrow(() -> new RuntimeException("Profile not found for userId: " + candidateId));

        List<MatchScore> matchScores = matchScoreRepository.findByCandidateId(profile.getId());
        List<InterviewAnswer> answers = answerRepository.findByCandidateId(profile.getId());

        double avgMatch    = matchScores.stream().mapToDouble(MatchScore::getMatchPercentage).average().orElse(0.0);
        double avgOverall  = answers.stream().mapToDouble(a -> a.getOverallScore()       != null ? a.getOverallScore()       : 0).average().orElse(0.0);
        double avgAnswer   = answers.stream().mapToDouble(a -> a.getAnswerScore()        != null ? a.getAnswerScore()        : 0).average().orElse(0.0);
        double avgConf     = answers.stream().mapToDouble(a -> a.getConfidenceScore()    != null ? a.getConfidenceScore()    : 0).average().orElse(0.0);
        double avgComms    = answers.stream().mapToDouble(a -> a.getCommunicationScore() != null ? a.getCommunicationScore() : 0).average().orElse(0.0);

        // Skill gap analysis
        Map<String, Long> missingFreq = matchScores.stream()
                .filter(ms -> ms.getMissingSkills() != null && !ms.getMissingSkills().isBlank())
                .flatMap(ms -> Arrays.stream(ms.getMissingSkills().split(",")))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));

        List<SkillGapDTO> skillGaps = missingFreq.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> {
                    SkillGapDTO dto = new SkillGapDTO();
                    dto.setSkillName(e.getKey());
                    dto.setFrequency(e.getValue());
                    dto.setRecommendation("Learn " + e.getKey() + " to improve job match rate");
                    return dto;
                })
                .collect(Collectors.toList());

        Optional<MatchScore> bestMatch = matchScores.stream()
                .max(Comparator.comparingDouble(MatchScore::getMatchPercentage));

        String bestJobTitle = bestMatch
                .flatMap(ms -> jobRepository.findById(ms.getJobId()))
                .map(Job::getTitle).orElse("N/A");

        return AnalyticsDashboardDTO.builder()
                .candidateName(profile.getName())
                .totalJobsApplied(matchScores.size())
                .averageMatchScore(Math.round(avgMatch    * 100.0) / 100.0)
                .bestMatchedJob(bestJobTitle)
                .bestMatchScore(bestMatch.map(MatchScore::getMatchPercentage).orElse(0.0))
                .totalInterviewsGiven(answers.size())
                .averageOverallScore(Math.round(avgOverall * 100.0) / 100.0)
                .averageAnswerScore(Math.round(avgAnswer   * 100.0) / 100.0)
                .averageConfidenceScore(Math.round(avgConf * 100.0) / 100.0)
                .averageCommunicationScore(Math.round(avgComms * 100.0) / 100.0)
                .skillGaps(skillGaps)
                .performanceSummary(buildSummary(avgMatch, avgOverall, skillGaps))
                .build();
    }

    // ── Recruiter: Ranked candidates per job ──────────────────────────────────
    public List<CandidatePerformanceDTO> getJobPerformanceRanking(Long jobId) {
        log.info("Building performance ranking for job {}", jobId);

        List<MatchScore> scores = matchScoreRepository.findByJobIdOrderByMatchPercentageDesc(jobId);
        List<CandidatePerformanceDTO> result = new ArrayList<>();

        for (MatchScore ms : scores) {
            List<InterviewAnswer> answers = answerRepository.findByCandidateId(ms.getCandidateId());

            double avgScore = answers.stream()
                    .mapToDouble(a -> a.getOverallScore() != null ? a.getOverallScore() : 0)
                    .average().orElse(0.0);

            Optional<CandidateProfile> profileOpt = profileRepository.findByUserId(ms.getCandidateId());

            String candidateName  = profileOpt.map(CandidateProfile::getName).orElse("Unknown");
            String candidateEmail = profileOpt.map(CandidateProfile::getEmail).orElse("Unknown");

            List<String> matchedSkills = ms.getMatchedSkills() != null
                    ? Arrays.asList(ms.getMatchedSkills().split(","))
                    : Collections.emptyList();

            List<String> missingSkills = ms.getMissingSkills() != null
                    ? Arrays.asList(ms.getMissingSkills().split(","))
                    : Collections.emptyList();

            double combined = Math.round(((ms.getMatchPercentage() * 0.6) + (avgScore * 10 * 0.4)) * 100.0) / 100.0;
            String recommendation = ms.getMatchPercentage() >= 70 ? "RECOMMENDED ✅" : "NEEDS REVIEW ⚠️";

            CandidatePerformanceDTO dto = CandidatePerformanceDTO.builder()
                    .candidateId(ms.getCandidateId())
                    .candidateName(candidateName)
                    .candidateEmail(candidateEmail)
                    .matchPercentage(ms.getMatchPercentage())
                    .interviewScore(Math.round(avgScore * 100.0) / 100.0)
                    .combinedScore(combined)
                    .matchedSkills(matchedSkills)
                    .missingSkills(missingSkills)
                    .recommendation(recommendation)
                    .build();

            result.add(dto);
        }

        return result;
    }

    // ── Private helper ────────────────────────────────────────────────────────
    private String buildSummary(double avgMatch, double avgInterview, List<SkillGapDTO> gaps) {
        StringBuilder sb = new StringBuilder();
        if (avgMatch >= 70)      sb.append("Strong profile — matching well with job requirements. ");
        else if (avgMatch >= 40) sb.append("Moderate profile — some skill gaps exist. ");
        else                     sb.append("Profile needs improvement — significant skill gaps found. ");

        if (avgInterview >= 7)      sb.append("Excellent interview performance. ");
        else if (avgInterview >= 5) sb.append("Average interview performance — practice recommended. ");
        else if (avgInterview > 0)  sb.append("Interview performance needs improvement. ");

        if (!gaps.isEmpty()) {
            sb.append("Top skills to learn: ");
            sb.append(gaps.stream().limit(3).map(SkillGapDTO::getSkillName).collect(Collectors.joining(", ")));
            sb.append(".");
        }
        return sb.toString();
    }
}
