package com.example.ai_recruitment_platform.service;

import com.example.ai_recruitment_platform.dto.request.JobRequest;
import com.example.ai_recruitment_platform.dto.response.JobResponse;
import com.example.ai_recruitment_platform.dto.response.PagedResponse;
import com.example.ai_recruitment_platform.entity.Job;
import com.example.ai_recruitment_platform.entity.User;
import com.example.ai_recruitment_platform.exception.Exceptions.*;
import com.example.ai_recruitment_platform.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;

    // ── Create ────────────────────────────────────────────────────────

    @Transactional
    public JobResponse createJob(JobRequest request, User recruiter) {
        Job job = Job.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .requiredSkills(request.getRequiredSkills().toLowerCase().trim())
                .jobType(request.getJobType())
                .location(request.getLocation())
                .experienceRequired(request.getExperienceRequired())
                .salaryLpa(request.getSalaryLpa())
                .postedBy(recruiter.getId())
                .active(true)
                .build();

        Job saved = jobRepository.save(job);
        log.info("Job created: '{}' (id={}) by recruiter={}", saved.getTitle(), saved.getId(), recruiter.getEmail());
        return JobResponse.from(saved);
    }

    // ── Read (paginated) ──────────────────────────────────────────────

    public PagedResponse<JobResponse> getAllActiveJobs(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        return PagedResponse.from(jobRepository.findByActiveTrue(pageable).map(JobResponse::from));
    }

    public PagedResponse<JobResponse> searchJobs(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return PagedResponse.from(jobRepository.searchActiveJobs(keyword, pageable).map(JobResponse::from));
    }

    public PagedResponse<JobResponse> filterJobs(String location, String jobType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return PagedResponse.from(jobRepository.filterActiveJobs(location, jobType, pageable).map(JobResponse::from));
    }

    public JobResponse getJobById(Long id) {
        return JobResponse.from(findJobOrThrow(id));
    }

    public List<JobResponse> getMyPostedJobs(Long recruiterId) {
        return jobRepository.findByPostedByAndActiveTrue(recruiterId)
                .stream()
                .map(JobResponse::from)
                .toList();
    }

    // ── Update ────────────────────────────────────────────────────────

    @Transactional
    public JobResponse updateJob(Long jobId, JobRequest request, User recruiter) {
        Job job = findJobOrThrow(jobId);

        if (!job.getPostedBy().equals(recruiter.getId())) {
            throw new ForbiddenException("You can only update jobs you posted.");
        }

        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription());
        job.setRequiredSkills(request.getRequiredSkills().toLowerCase().trim());
        if (request.getJobType() != null)           job.setJobType(request.getJobType());
        if (request.getLocation() != null)          job.setLocation(request.getLocation());
        if (request.getExperienceRequired() != null) job.setExperienceRequired(request.getExperienceRequired());
        if (request.getSalaryLpa() != null)         job.setSalaryLpa(request.getSalaryLpa());

        log.info("Job updated: id={} by recruiter={}", jobId, recruiter.getEmail());
        return JobResponse.from(jobRepository.save(job));
    }

    // ── Soft Delete ───────────────────────────────────────────────────

    @Transactional
    public void deactivateJob(Long jobId, User recruiter) {
        Job job = findJobOrThrow(jobId);

        if (!job.getPostedBy().equals(recruiter.getId())) {
            throw new ForbiddenException("You can only remove jobs you posted.");
        }

        job.setActive(false);
        jobRepository.save(job);
        log.info("Job deactivated: id={} by recruiter={}", jobId, recruiter.getEmail());
    }

    // ── Internal helper used by other services ────────────────────────

    public Job findJobOrThrow(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", jobId));
    }
}
