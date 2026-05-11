package com.example.ai_recruitment_platform.ai.controller;

import com.example.ai_recruitment_platform.ai.dto.AnalyticsDashboardDTO;
import com.example.ai_recruitment_platform.ai.dto.CandidatePerformanceDTO;
import com.example.ai_recruitment_platform.ai.service.AIAnalyticsService;
import com.example.ai_recruitment_platform.dto.response.ApiResponse;
import com.example.ai_recruitment_platform.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai/analytics")
@RequiredArgsConstructor
@Tag(name = "AI Analytics", description = "Performance dashboards and candidate ranking analytics")
public class AIAnalyticsController {

    private final AIAnalyticsService analyticsService;
    private final SecurityUtil securityUtil;

    @Operation(summary = "Get full analytics dashboard for current candidate [CANDIDATE only]",
               description = "Returns match scores, interview scores, skill gaps, and performance summary.")
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<AnalyticsDashboardDTO>> getMyDashboard() {
        Long userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getCandidateDashboard(userId)));
    }

    @Operation(summary = "Get ranked candidate performance for a job [RECRUITER only]",
               description = "Returns all candidates ranked by a combined match + interview score.")
    @GetMapping("/job/{jobId}/ranking")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<List<CandidatePerformanceDTO>>> getJobRanking(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getJobPerformanceRanking(jobId)));
    }
}
