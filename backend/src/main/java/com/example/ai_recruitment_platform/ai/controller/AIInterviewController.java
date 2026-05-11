package com.example.ai_recruitment_platform.ai.controller;

import com.example.ai_recruitment_platform.ai.dto.AnswerEvaluationResult;
import com.example.ai_recruitment_platform.ai.dto.InterviewQuestionDTO;
import com.example.ai_recruitment_platform.ai.dto.SubmitAnswerRequest;
import com.example.ai_recruitment_platform.ai.service.AIInterviewService;
import com.example.ai_recruitment_platform.dto.response.ApiResponse;
import com.example.ai_recruitment_platform.exception.Exceptions.ResourceNotFoundException;
import com.example.ai_recruitment_platform.repository.ProfileRepository;
import com.example.ai_recruitment_platform.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai/interview")
@RequiredArgsConstructor
@Tag(name = "AI Interview", description = "AI-powered interview question generation and answer evaluation")
public class AIInterviewController {

    private final AIInterviewService interviewService;
    private final SecurityUtil securityUtil;
    private final ProfileRepository profileRepository;

    @Operation(summary = "Generate AI interview questions for a job [CANDIDATE only]",
               description = "Generates 5 personalized questions based on the candidate's skills and job requirements.")
    @PostMapping("/generate/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<List<InterviewQuestionDTO>>> generateQuestions(
            @PathVariable Long jobId) {
        Long profileId = getProfileId();
        return ResponseEntity.ok(ApiResponse.success(
                "Interview questions generated successfully",
                interviewService.generateQuestions(profileId, jobId)));
    }

    @Operation(summary = "Get existing interview questions for a job [CANDIDATE only]")
    @GetMapping("/questions/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<List<InterviewQuestionDTO>>> getQuestions(
            @PathVariable Long jobId) {
        Long profileId = getProfileId();
        return ResponseEntity.ok(ApiResponse.success(
                interviewService.getQuestionsForInterview(profileId, jobId)));
    }

    @Operation(summary = "Submit an answer for AI evaluation [CANDIDATE only]",
               description = "Returns answer score, confidence score, communication score, overall score, and AI feedback.")
    @PostMapping("/answer")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<AnswerEvaluationResult>> submitAnswer(
            @Valid @RequestBody SubmitAnswerRequest request) {
        Long candidateId = securityUtil.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                "Answer evaluated successfully",
                interviewService.evaluateAnswer(
                        request.getQuestionId(), candidateId, request.getAnswer())));
    }

    // ── Helper ────────────────────────────────────────────────────────

    private Long getProfileId() {
        Long userId = securityUtil.getCurrentUserId();
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Candidate profile not found. Please upload your resume and confirm your profile first."))
                .getId();
    }
}
