package com.example.ai_recruitment_platform.ai.repository;

import com.example.ai_recruitment_platform.ai.entity.MatchScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchScoreRepository extends JpaRepository<MatchScore, Long> {

    // ── Used by AIAnalyticsService.getCandidateDashboard() ───────────────────
    List<MatchScore> findByCandidateId(Long candidateId);

    // ── Used by AIAnalyticsService.getJobPerformanceRanking() ────────────────
    List<MatchScore> findByJobIdOrderByMatchPercentageDesc(Long jobId);

    // ── Used by JobMatchingService ────────────────────────────────────────────
    Optional<MatchScore> findByCandidateIdAndJobId(Long candidateId, Long jobId);

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    void deleteByCandidateIdAndJobId(Long candidateId, Long jobId);

    // ── Used by JobApplicationService ────────────────────────────────────────
    List<MatchScore> findByCandidateIdOrderByMatchPercentageDesc(Long candidateId);

    List<MatchScore> findByCandidateIdAndMatchPercentageGreaterThanEqualOrderByMatchPercentageDesc(
            Long candidateId, Double threshold);

    List<MatchScore> findByJobIdAndMatchPercentageGreaterThanEqualOrderByMatchPercentageDesc(
            Long jobId, Double threshold);

    // ── Count queries ─────────────────────────────────────────────────────────
    long countByCandidateId(Long candidateId);

    long countByJobId(Long jobId);

    // ── Analytics ─────────────────────────────────────────────────────────────
    @Query("SELECT MAX(m.matchPercentage) FROM MatchScore m WHERE m.candidateId = :candidateId")
    Double findBestMatchPercentageByCandidateId(@Param("candidateId") Long candidateId);

    @Query("SELECT m FROM MatchScore m WHERE m.jobId = :jobId ORDER BY m.matchPercentage DESC LIMIT :limit")
    List<MatchScore> findTopCandidatesForJob(@Param("jobId") Long jobId,
                                              @Param("limit") int limit);
}
