package com.example.ai_recruitment_platform.service;

import com.example.ai_recruitment_platform.ai.repository.MatchScoreRepository;
import com.example.ai_recruitment_platform.dto.request.ApplyJobRequest;
import com.example.ai_recruitment_platform.dto.request.UpdateApplicationStatusRequest;
import com.example.ai_recruitment_platform.dto.response.ApplicationResponse;
import com.example.ai_recruitment_platform.dto.response.PagedResponse;
import com.example.ai_recruitment_platform.entity.Job;
import com.example.ai_recruitment_platform.entity.JobApplication;
import com.example.ai_recruitment_platform.entity.JobApplication.ApplicationStatus;
import com.example.ai_recruitment_platform.entity.User;
import com.example.ai_recruitment_platform.exception.Exceptions.*;
import com.example.ai_recruitment_platform.notification.service.NotificationEventPublisher;
import com.example.ai_recruitment_platform.repository.JobApplicationRepository;
import com.example.ai_recruitment_platform.repository.JobRepository;
import com.example.ai_recruitment_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository            jobRepository;
    private final UserRepository           userRepository;
    private final MatchScoreRepository     matchScoreRepository;
    private final NotificationEventPublisher eventPublisher;

    // ── CANDIDATE: Apply ──────────────────────────────────────────────

    @Transactional
    public ApplicationResponse applyForJob(Long candidateUserId, ApplyJobRequest request) {
        Long jobId = request.getJobId();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", jobId));

        if (!job.isActive()) {
            throw new BadRequestException("This job posting is no longer active.");
        }

        if (applicationRepository.existsByCandidateIdAndJobId(candidateUserId, jobId)) {
            throw new DuplicateResourceException("You have already applied for this job.");
        }

        JobApplication application = new JobApplication();
        application.setCandidateId(candidateUserId);
        application.setJobId(jobId);
        application.setCoverLetter(request.getCoverLetter());
        application.setStatus(ApplicationStatus.APPLIED);
        application = applicationRepository.save(application);

        log.info("Candidate {} applied for job '{}'(id={})", candidateUserId, job.getTitle(), jobId);

        eventPublisher.publishApplicationSubmitted(candidateUserId, job.getTitle());

        double matchPct = matchScoreRepository
                .findByCandidateIdAndJobId(candidateUserId, jobId)
                .map(m -> m.getMatchPercentage()).orElse(0.0);

        String candidateName = userRepository.findById(candidateUserId)
                .map(User::getName).orElse("A candidate");

        userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.RECRUITER)
                .forEach(recruiter -> {
                    eventPublisher.publishNewApplication(
                            recruiter.getId(), candidateName, job.getTitle(), matchPct);
                    if (matchPct >= 70) {
                        eventPublisher.publishStrongMatch(
                                recruiter.getId(), candidateName, job.getTitle(), matchPct);
                    }
                });

        return toResponse(application);
    }

    // ── CANDIDATE: My Applications (paginated) ────────────────────────

    public PagedResponse<ApplicationResponse> getMyApplications(
            Long candidateUserId, int page, int size) {
        Page<JobApplication> applications = applicationRepository
                .findByCandidateIdOrderByAppliedAtDesc(
                        candidateUserId,
                        PageRequest.of(page, size, Sort.by("appliedAt").descending()));
        return PagedResponse.from(applications.map(this::toResponse));
    }

    // ── CANDIDATE: Withdraw ───────────────────────────────────────────

    @Transactional
    public void withdrawApplication(Long candidateUserId, Long applicationId) {
        JobApplication app = findApplicationOrThrow(applicationId);

        if (!app.getCandidateId().equals(candidateUserId)) {
            throw new ForbiddenException("You are not authorized to withdraw this application.");
        }
        if (app.getStatus() == ApplicationStatus.HIRED) {
            throw new BadRequestException("Cannot withdraw after being hired.");
        }

        applicationRepository.delete(app);
        log.info("Candidate {} withdrew application {}", candidateUserId, applicationId);
    }

    // ── RECRUITER: ALL applications across recruiter's jobs ───────────
    // ✅ FIX: Naya method — GET /applications recruiter endpoint ke liye
    // Frontend "All Applications" page pe yahi call hoga
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationResponse> getAllApplicationsForRecruiter(
            Long recruiterUserId, int page, int size, String search, String status) {

        // Step 1: Recruiter ke saare jobs ke IDs nikalo
        // ✅ FIX: Job entity mein field "postedBy" hai — "postedById" nahi
        List<Long> jobIds = jobRepository
                .findByPostedBy(
                        recruiterUserId,
                        PageRequest.of(0, Integer.MAX_VALUE))
                .getContent()
                .stream()
                .map(Job::getId)
                .collect(Collectors.toList());

        if (jobIds.isEmpty()) {
            // Koi job nahi — empty response
            return PagedResponse.from(Page.empty(PageRequest.of(page, size)));
        }

        // Step 2: Un jobs ki saari applications nikalo
        PageRequest pageRequest = PageRequest.of(page, size,
                Sort.by("appliedAt").descending());

        Page<JobApplication> applications;

        // Status filter
        if (status != null && !status.isBlank()) {
            try {
                ApplicationStatus appStatus = ApplicationStatus.valueOf(status.toUpperCase());
                applications = applicationRepository
                        .findByJobIdInAndStatus(jobIds, appStatus, pageRequest);
            } catch (IllegalArgumentException e) {
                // Invalid status — ignore filter
                applications = applicationRepository
                        .findByJobIdIn(jobIds, pageRequest);
            }
        } else {
            applications = applicationRepository
                    .findByJobIdIn(jobIds, pageRequest);
        }

        // Step 3: Search filter (client-side on loaded page)
        Page<ApplicationResponse> responsePage = applications.map(this::toResponse);

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            List<ApplicationResponse> filtered = responsePage.getContent().stream()
                    .filter(a ->
                        (a.getJobTitle()       != null && a.getJobTitle().toLowerCase().contains(q)) ||
                        (a.getCandidateName()  != null && a.getCandidateName().toLowerCase().contains(q)) ||
                        (a.getCandidateEmail() != null && a.getCandidateEmail().toLowerCase().contains(q))
                    )
                    .collect(Collectors.toList());

            Page<ApplicationResponse> filteredPage = new PageImpl<>(
                    filtered, pageRequest, filtered.size());
            return PagedResponse.from(filteredPage);
        }

        return PagedResponse.from(responsePage);
    }

    // ── RECRUITER: All Applications for a Job (paginated) ─────────────

    public PagedResponse<ApplicationResponse> getApplicationsForJob(
            Long jobId, int page, int size) {
        Page<JobApplication> applications = applicationRepository
                .findByJobIdOrderByAppliedAtDesc(
                        jobId,
                        PageRequest.of(page, size, Sort.by("appliedAt").descending()));
        return PagedResponse.from(applications.map(this::toResponse));
    }

    // ── RECRUITER: Shortlisted (paginated) ────────────────────────────

    public PagedResponse<ApplicationResponse> getShortlistedCandidates(
            Long jobId, int page, int size) {
        Page<JobApplication> applications = applicationRepository
                .findByJobIdAndStatus(
                        jobId, ApplicationStatus.SHORTLISTED,
                        PageRequest.of(page, size, Sort.by("updatedAt").descending()));
        return PagedResponse.from(applications.map(this::toResponse));
    }

    // ── RECRUITER: Update Status ──────────────────────────────────────

    @Transactional
    public ApplicationResponse updateApplicationStatus(
            Long applicationId, UpdateApplicationStatusRequest request) {
        JobApplication app = findApplicationOrThrow(applicationId);
        app.setStatus(request.getStatus());
        if (request.getRecruiterNote() != null) {
            app.setRecruiterNote(request.getRecruiterNote());
        }
        app = applicationRepository.save(app);

        String jobTitle = jobRepository.findById(app.getJobId())
                .map(Job::getTitle).orElse("the role");

        switch (request.getStatus()) {
            case SHORTLISTED         -> eventPublisher.publishShortlisted(app.getCandidateId(), jobTitle);
            case INTERVIEW_SCHEDULED -> eventPublisher.publishInterviewScheduled(app.getCandidateId(), jobTitle);
            default                  -> { /* no notification */ }
        }

        log.info("Application {} status updated to {}", applicationId, request.getStatus());
        return toResponse(app);
    }

    // ── RECRUITER: Quick Shortlist ────────────────────────────────────

    @Transactional
    public ApplicationResponse shortlistCandidate(Long applicationId, String note) {
        UpdateApplicationStatusRequest req = new UpdateApplicationStatusRequest();
        req.setStatus(ApplicationStatus.SHORTLISTED);
        req.setRecruiterNote(note);
        return updateApplicationStatus(applicationId, req);
    }

    // ── RECRUITER: Stats ──────────────────────────────────────────────

    public Map<String, Long> getApplicationStats(Long jobId) {
        List<JobApplication> all = applicationRepository
                .findByJobIdOrderByAppliedAtDesc(
                        jobId, PageRequest.of(0, Integer.MAX_VALUE))
                .getContent();

        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("total",               (long) all.size());
        stats.put("applied",             countByStatus(all, ApplicationStatus.APPLIED));
        stats.put("under_review",        countByStatus(all, ApplicationStatus.UNDER_REVIEW));
        stats.put("shortlisted",         countByStatus(all, ApplicationStatus.SHORTLISTED));
        stats.put("interview_scheduled", countByStatus(all, ApplicationStatus.INTERVIEW_SCHEDULED));
        stats.put("rejected",            countByStatus(all, ApplicationStatus.REJECTED));
        stats.put("hired",               countByStatus(all, ApplicationStatus.HIRED));
        return stats;
    }

    // ── Private Helpers ───────────────────────────────────────────────

    private JobApplication findApplicationOrThrow(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));
    }

    private long countByStatus(List<JobApplication> apps, ApplicationStatus status) {
        return apps.stream().filter(a -> a.getStatus() == status).count();
    }

    private ApplicationResponse toResponse(JobApplication app) {
        ApplicationResponse.ApplicationResponseBuilder builder = ApplicationResponse.builder()
                .id(app.getId())
                .candidateId(app.getCandidateId())
                .jobId(app.getJobId())
                .status(app.getStatus())
                .coverLetter(app.getCoverLetter())
                .recruiterNote(app.getRecruiterNote())
                .appliedAt(app.getAppliedAt())
                .updatedAt(app.getUpdatedAt());

        userRepository.findById(app.getCandidateId()).ifPresent(u -> {
            builder.candidateName(u.getName());
            builder.candidateEmail(u.getEmail());
        });

        jobRepository.findById(app.getJobId())
                .ifPresent(j -> builder.jobTitle(j.getTitle()));

        matchScoreRepository
                .findByCandidateIdAndJobId(app.getCandidateId(), app.getJobId())
                .ifPresent(m -> builder.matchPercentage(m.getMatchPercentage()));

        return builder.build();
    }
}