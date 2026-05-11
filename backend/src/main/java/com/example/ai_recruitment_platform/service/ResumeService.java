package com.example.ai_recruitment_platform.service;

import com.example.ai_recruitment_platform.dto.ResumePreviewResponse;
import com.example.ai_recruitment_platform.entity.ResumeRaw;
import com.example.ai_recruitment_platform.entity.User;
import com.example.ai_recruitment_platform.exception.Exceptions.*;
import com.example.ai_recruitment_platform.repository.ResumeRawRepository;
import com.example.ai_recruitment_platform.repository.UserRepository;
import com.example.ai_recruitment_platform.util.PdfUtil;
import com.example.ai_recruitment_platform.util.SecurityUtil;
import com.example.ai_recruitment_platform.util.SkillExtractor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final PdfUtil pdfUtil;
    private final SkillExtractor skillExtractor;
    private final ResumeRawRepository resumeRawRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    @Value("${resume.upload.dir:uploads/resumes}")
    private String uploadDir;

    // ── Upload & Parse Preview ────────────────────────────────────────

    @Transactional
    public ResumePreviewResponse uploadAndPreview(MultipartFile file) {
        User user = securityUtil.getCurrentUser();

        String rawText;
        try {
            rawText = pdfUtil.extractText(file);
        } catch (IOException e) {
            throw new FileProcessingException("Failed to read the PDF file. Ensure it is not corrupted.", e);
        }

        if (rawText == null || rawText.isBlank()) {
            throw new FileProcessingException(
                "Could not extract text from the uploaded PDF. " +
                "Please ensure it is a text-based PDF, not a scanned image.");
        }

        // Save raw resume (overwrite previous)
        ResumeRaw existing = resumeRawRepository.findByUserId(user.getId())
                .stream().findFirst().orElse(null);

        if (existing != null) {
            existing.setRawText(rawText);
            existing.setOriginalFileName(file.getOriginalFilename());
            resumeRawRepository.save(existing);
        } else {
            resumeRawRepository.save(ResumeRaw.builder()
                    .user(user)
                    .originalFileName(file.getOriginalFilename())
                    .rawText(rawText)
                    .build());
        }

        // Save file to disk for later download
        saveFileToDisk(file, user.getId(), user.getEmail());

        // Extract structured info
        List<String> skills  = skillExtractor.extractSkills(rawText);
        log.info("Resume parsed for userId={} — {} skills extracted, filename={}",
                user.getId(), skills.size(), file.getOriginalFilename());

        return ResumePreviewResponse.builder()
                .extractedName(skillExtractor.extractName(rawText))
                .extractedEmail(skillExtractor.extractEmail(rawText))
                .experience(skillExtractor.extractExperience(rawText))
                .education(skillExtractor.extractEducation(rawText))
                .skills(skills)
                .rawText(rawText)
                .message("Resume parsed successfully. Please review and confirm your profile.")
                .build();
    }

    // ── File Download (Recruiter) ─────────────────────────────────────

    public ResponseEntity<Resource> downloadResume(Long candidateId) {
        Path file = findResumeFile(candidateId);
        Resource resource = toResource(file);
        String filename = userRepository.findById(candidateId)
                .map(u -> u.getName().replaceAll("\\s+", "_") + "_resume.pdf")
                .orElse("resume.pdf");
        log.info("Resume downloaded for candidateId={}", candidateId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    public ResponseEntity<Resource> viewResume(Long candidateId) {
        Path file = findResumeFile(candidateId);
        Resource resource = toResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(resource);
    }

    public Map<String, Boolean> checkResumeExists(Long candidateId) {
        boolean exists;
        try {
            findResumeFile(candidateId);
            exists = true;
        } catch (ResourceNotFoundException e) {
            exists = false;
        }
        return Map.of("exists", exists);
    }

    // ── Private Helpers ───────────────────────────────────────────────

    private void saveFileToDisk(MultipartFile file, Long userId, String email) {
        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);
            // Naming convention: {userId}_{safeEmail}.pdf
            String safeEmail = email.replace("@", "_").replace(".", "_");
            String filename   = userId + "_" + safeEmail + ".pdf";
            Path dest = dir.resolve(filename);
            file.transferTo(dest);
            log.debug("Resume saved to disk: {}", dest);
        } catch (IOException e) {
            log.error("Failed to save resume file for userId={}: {}", userId, e.getMessage());
            // Not thrown — parsing succeeded, file persistence is secondary
        }
    }

    private Path findResumeFile(Long candidateId) {
        Path dir = Paths.get(uploadDir);
        if (!Files.exists(dir)) {
            throw new ResourceNotFoundException("No resumes found for candidate: " + candidateId);
        }
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir, candidateId + "_*")) {
            for (Path entry : stream) {
                if (entry.toString().endsWith(".pdf")) return entry;
            }
        } catch (IOException e) {
            log.error("Error scanning resume directory: {}", e.getMessage());
        }
        throw new ResourceNotFoundException("Resume not found for candidate: " + candidateId);
    }

    private Resource toResource(Path path) {
        try {
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Resume file is not accessible.");
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new FileProcessingException("Failed to load resume file.", e);
        }
    }
}
