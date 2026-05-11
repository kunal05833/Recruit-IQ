package com.example.ai_recruitment_platform.controller;

import com.example.ai_recruitment_platform.dto.request.JobRequest;
import com.example.ai_recruitment_platform.dto.response.ApiResponse;
import com.example.ai_recruitment_platform.dto.response.JobResponse;
import com.example.ai_recruitment_platform.dto.response.PagedResponse;
import com.example.ai_recruitment_platform.service.JobService;
import com.example.ai_recruitment_platform.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Browse, search, and manage job postings")
public class JobController {

    private final JobService jobService;
    private final SecurityUtil securityUtil;

    // ── PUBLIC (authenticated) — List / Search ─────────────────────

    @Operation(summary = "List all active jobs (paginated)")
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getAllJobs(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0")  int page,
            @Parameter(description = "Page size")             @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort by field")         @RequestParam(defaultValue = "createdAt") String sortBy) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getAllActiveJobs(page, size, sortBy)));
    }

    @Operation(summary = "Search jobs by keyword (title, description, skills)")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> searchJobs(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(jobService.searchJobs(keyword, page, size)));
    }

    @Operation(summary = "Filter jobs by location and/or job type")
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> filterJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(jobService.filterJobs(location, jobType, page, size)));
    }

    @Operation(summary = "Get job by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getJobById(id)));
    }

    // ── RECRUITER — CRUD ──────────────────────────────────────────────

    @Operation(summary = "Post a new job [RECRUITER only]")
    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(@Valid @RequestBody JobRequest request) {
        JobResponse response = jobService.createJob(request, securityUtil.getCurrentUser());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job posted successfully", response));
    }

    @Operation(summary = "Update a job posting [RECRUITER only]")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Job updated",
                jobService.updateJob(id, request, securityUtil.getCurrentUser())));
    }

    @Operation(summary = "Deactivate (soft-delete) a job [RECRUITER only]")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Void>> deactivateJob(@PathVariable Long id) {
        jobService.deactivateJob(id, securityUtil.getCurrentUser());
        return ResponseEntity.ok(ApiResponse.success("Job deactivated successfully"));
    }

    @Operation(summary = "Get jobs posted by the current recruiter [RECRUITER only]")
    @GetMapping("/my-postings")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getMyPostings() {
        return ResponseEntity.ok(ApiResponse.success(
                jobService.getMyPostedJobs(securityUtil.getCurrentUserId())));
    }
}
