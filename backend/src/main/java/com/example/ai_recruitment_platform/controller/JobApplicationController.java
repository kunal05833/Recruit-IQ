package com.example.ai_recruitment_platform.controller;

import com.example.ai_recruitment_platform.dto.request.ApplyJobRequest;
import com.example.ai_recruitment_platform.dto.request.UpdateApplicationStatusRequest;
import com.example.ai_recruitment_platform.dto.response.ApiResponse;
import com.example.ai_recruitment_platform.dto.response.ApplicationResponse;
import com.example.ai_recruitment_platform.dto.response.PagedResponse;
import com.example.ai_recruitment_platform.service.JobApplicationService;
import com.example.ai_recruitment_platform.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Job application management for candidates and recruiters")
public class JobApplicationController {

    private final JobApplicationService applicationService;
    private final SecurityUtil securityUtil;

    // ─────────────────────────────────────────────────────────────────────────
    // CANDIDATE APIs
    // ─────────────────────────────────────────────────────────────────────────

    @Operation(summary = "Apply for a job [CANDIDATE only]")
    @PostMapping("/apply")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyForJob(
            @Valid @RequestBody ApplyJobRequest request) {
        ApplicationResponse response = applicationService.applyForJob(
                securityUtil.getCurrentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", response));
    }

    @Operation(summary = "Get my applications (paginated) [CANDIDATE only]")
    @GetMapping("/my")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getMyApplications(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.getMyApplications(
                        securityUtil.getCurrentUserId(), page, size)));
    }

    @Operation(summary = "Withdraw an application [CANDIDATE only]")
    @DeleteMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Void>> withdrawApplication(@PathVariable Long id) {
        applicationService.withdrawApplication(securityUtil.getCurrentUserId(), id);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn successfully"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RECRUITER APIs
    // ─────────────────────────────────────────────────────────────────────────

    // ✅ FIX: NEW ENDPOINT — Recruiter ke saare jobs ki applications ek saath
    // Frontend "All Applications" page pe yahi call hoga jab koi jobId filter nahi ho
    @Operation(summary = "Get all applications across recruiter's jobs (paginated) [RECRUITER only]")
    @GetMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getAllApplicationsForRecruiter(
            @RequestParam(defaultValue = "0")   int    page,
            @RequestParam(defaultValue = "10")  int    size,
            @RequestParam(required = false)     String search,
            @RequestParam(required = false)     String status) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.getAllApplicationsForRecruiter(
                        securityUtil.getCurrentUserId(), page, size, search, status)));
    }

    @Operation(summary = "Get all applications for a job (paginated) [RECRUITER only]")
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getApplicationsForJob(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.getApplicationsForJob(jobId, page, size)));
    }

    @Operation(summary = "Get shortlisted candidates for a job [RECRUITER only]")
    @GetMapping("/job/{jobId}/shortlisted")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getShortlisted(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.getShortlistedCandidates(jobId, page, size)));
    }

    @Operation(summary = "Get application stats for a job [RECRUITER only]")
    @GetMapping("/job/{jobId}/stats")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStats(@PathVariable Long jobId) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.getApplicationStats(jobId)));
    }

    @Operation(summary = "Update application status [RECRUITER only]",
               description = "Status: APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW_SCHEDULED, REJECTED, HIRED")
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Application status updated",
                applicationService.updateApplicationStatus(id, request)));
    }

    @Operation(summary = "Quick-shortlist a candidate [RECRUITER only]")
    @PutMapping("/{id}/shortlist")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> shortlist(
            @PathVariable Long id,
            @RequestParam(required = false) String note) {
        return ResponseEntity.ok(ApiResponse.success("Candidate shortlisted",
                applicationService.shortlistCandidate(id, note)));
    }
}