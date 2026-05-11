package com.example.ai_recruitment_platform.controller;

import com.example.ai_recruitment_platform.dto.response.ApiResponse;
import com.example.ai_recruitment_platform.dto.ResumePreviewResponse;
import com.example.ai_recruitment_platform.exception.Exceptions.FileProcessingException;
import com.example.ai_recruitment_platform.service.ResumeService;
import com.example.ai_recruitment_platform.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@Tag(name = "Resume", description = "Resume upload, parsing preview, download")
public class ResumeController {

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024L; // 10 MB
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of("application/pdf");

    private final ResumeService resumeService;
    private final SecurityUtil securityUtil;

    // ── Upload & Parse ────────────────────────────────────────────────

    @Operation(summary = "Upload resume PDF [CANDIDATE only]",
               description = "Parses the PDF and returns extracted name, email, skills, experience, education for review before confirming profile.")
    @PostMapping("/upload")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<ResumePreviewResponse>> uploadResume(
            @RequestParam("file") MultipartFile file) {

        validateResumeFile(file);

        ResumePreviewResponse preview = resumeService.uploadAndPreview(file);
        return ResponseEntity.ok(ApiResponse.success("Resume parsed successfully — please review and confirm your profile.", preview));
    }

    // ── Download (Recruiter) ──────────────────────────────────────────

    @Operation(summary = "Download candidate resume as PDF [RECRUITER only]")
    @GetMapping("/download/{candidateId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long candidateId) {
        return resumeService.downloadResume(candidateId);
    }

    @Operation(summary = "View resume inline in browser [RECRUITER only]")
    @GetMapping("/view/{candidateId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Resource> viewResume(@PathVariable Long candidateId) {
        return resumeService.viewResume(candidateId);
    }

    @Operation(summary = "Check if a resume exists for a candidate [RECRUITER only]")
    @GetMapping("/exists/{candidateId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkResumeExists(@PathVariable Long candidateId) {
        return ResponseEntity.ok(ApiResponse.success(resumeService.checkResumeExists(candidateId)));
    }

    // ── Private Validation ────────────────────────────────────────────

    private void validateResumeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileProcessingException("Please select a PDF file to upload.");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new FileProcessingException("File size exceeds the 10MB limit. Please upload a smaller file.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new FileProcessingException("Only PDF files are accepted. Received: " + contentType);
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
            throw new FileProcessingException("File must have a .pdf extension.");
        }
    }
}
