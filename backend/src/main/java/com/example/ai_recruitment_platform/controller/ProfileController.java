// src/main/java/com/example/ai_recruitment_platform/controller/ProfileController.java
package com.example.ai_recruitment_platform.controller;

import com.example.ai_recruitment_platform.dto.ProfileConfirmRequest;
import com.example.ai_recruitment_platform.dto.response.ApiResponse;
import com.example.ai_recruitment_platform.dto.response.CandidateProfileDTO;
import com.example.ai_recruitment_platform.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "Candidate profile management")
public class ProfileController {

    private final ProfileService profileService;

    @Operation(summary = "Confirm and save candidate profile after resume review [CANDIDATE only]")
    @PostMapping("/confirm")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateProfileDTO>> confirmProfile(
            @Valid @RequestBody ProfileConfirmRequest request) {

        // ✅ FIX: CandidateProfile entity nahi — DTO return karo
        CandidateProfileDTO dto = profileService.confirmProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Profile saved successfully", dto));
    }

    @Operation(summary = "Get current candidate's profile [CANDIDATE only]")
    @GetMapping("/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateProfileDTO>> getMyProfile() {
        // ✅ FIX: DTO return — Hibernate lazy proxy issue khatam, {} nahi aayega
        return ResponseEntity.ok(ApiResponse.success(profileService.getMyProfile()));
    }
}