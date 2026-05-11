package com.example.ai_recruitment_platform.ai.controller;

import com.example.ai_recruitment_platform.ai.dto.JobMatchResult;
import com.example.ai_recruitment_platform.ai.dto.RankedCandidateDTO;
import com.example.ai_recruitment_platform.ai.service.JobMatchingService;
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
@RequestMapping("/api/ai/match")
@RequiredArgsConstructor
@Tag(name = "AI Matching", description = "Skill-based job-candidate matching and ranking")
public class JobMatchingController {

    private final JobMatchingService jobMatchingService;
    private final SecurityUtil securityUtil;

    @Operation(summary = "Match current candidate with a job [CANDIDATE only]",
               description = "Runs skill matching algorithm and returns match %, matched/missing skills, and recommendation.")
    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<JobMatchResult>> matchWithJob(@PathVariable Long jobId) {
        Long userId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                jobMatchingService.matchCandidateWithJob(userId, jobId)));
    }

    @Operation(summary = "Get ranked candidates for a job [RECRUITER only]",
               description = "Returns all candidates who have matched this job, ranked by match percentage.")
    @GetMapping("/job/{jobId}/ranking")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<List<RankedCandidateDTO>>> getRankedCandidates(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(ApiResponse.success(
                jobMatchingService.getRankedCandidatesForJob(jobId)));
    }
}
