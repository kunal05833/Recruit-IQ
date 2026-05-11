package com.example.ai_recruitment_platform.controller;

import com.example.ai_recruitment_platform.dto.response.ApiResponse;
import com.example.ai_recruitment_platform.dto.response.CandidateResponse;
import com.example.ai_recruitment_platform.dto.response.PagedResponse;
import com.example.ai_recruitment_platform.service.CandidateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
@Tag(name = "Candidates", description = "Browse candidate profiles — RECRUITER or ADMIN only")
public class CandidateController {

    private final CandidateService candidateService;

    @Operation(summary = "Get all candidates paginated")
    @GetMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<CandidateResponse>>> getAllCandidates(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(candidateService.getAllCandidates(page, size)));
    }

    @Operation(summary = "Get candidate by profile ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<CandidateResponse>> getCandidateById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(candidateService.getCandidateById(id)));
    }

    @Operation(summary = "Get candidate by user ID")
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<CandidateResponse>> getCandidateByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(candidateService.getCandidateByUserId(userId)));
    }
}
