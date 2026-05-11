package com.example.ai_recruitment_platform.service;

import com.example.ai_recruitment_platform.dto.request.JobRequest;
import com.example.ai_recruitment_platform.dto.response.JobResponse;
import com.example.ai_recruitment_platform.dto.response.PagedResponse;
import com.example.ai_recruitment_platform.entity.Job;
import com.example.ai_recruitment_platform.entity.User;
import com.example.ai_recruitment_platform.exception.Exceptions.ForbiddenException;
import com.example.ai_recruitment_platform.exception.Exceptions.ResourceNotFoundException;
import com.example.ai_recruitment_platform.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JobService Unit Tests")
class JobServiceTest {

    @Mock private JobRepository jobRepository;

    @InjectMocks
    private JobService jobService;

    private User recruiter;
    private Job sampleJob;
    private JobRequest sampleRequest;

    @BeforeEach
    void setUp() {
        recruiter = User.builder()
                .id(10L)
                .name("HR Manager")
                .email("hr@company.com")
                .role(User.Role.RECRUITER)
                .build();

        sampleJob = Job.builder()
                .id(1L)
                .title("Senior Java Developer")
                .description("We need a Java expert")
                .requiredSkills("java, spring boot, hibernate")
                .jobType("FULL_TIME")
                .location("Bangalore")
                .postedBy(10L)
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sampleRequest = new JobRequest();
        sampleRequest.setTitle("Senior Java Developer");
        sampleRequest.setDescription("We need a Java expert");
        sampleRequest.setRequiredSkills("Java, Spring Boot, Hibernate");
        sampleRequest.setJobType("FULL_TIME");
        sampleRequest.setLocation("Bangalore");
    }

    // ── createJob() ───────────────────────────────────────────────────

    @Test
    @DisplayName("createJob() — saves and returns job response")
    void createJob_success() {
        when(jobRepository.save(any(Job.class))).thenReturn(sampleJob);

        JobResponse response = jobService.createJob(sampleRequest, recruiter);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Senior Java Developer");
        assertThat(response.getLocation()).isEqualTo("Bangalore");
        verify(jobRepository).save(any(Job.class));
    }

    @Test
    @DisplayName("createJob() — skills are stored lowercase")
    void createJob_skillsLowercased() {
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> {
            Job saved = invocation.getArgument(0);
            return saved;
        });

        JobResponse response = jobService.createJob(sampleRequest, recruiter);
        // Skills should be lowercase in the saved entity
        verify(jobRepository).save(argThat(job ->
                job.getRequiredSkills().equals("java, spring boot, hibernate")));
    }

    // ── getJobById() ──────────────────────────────────────────────────

    @Test
    @DisplayName("getJobById() — returns job when found")
    void getJobById_found() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(sampleJob));

        JobResponse response = jobService.getJobById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Senior Java Developer");
    }

    @Test
    @DisplayName("getJobById() — throws ResourceNotFoundException when not found")
    void getJobById_notFound_throws() {
        when(jobRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.getJobById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("999");
    }

    // ── getAllActiveJobs() ─────────────────────────────────────────────

    @Test
    @DisplayName("getAllActiveJobs() — returns paged response")
    void getAllActiveJobs_returnsPaged() {
        Page<Job> page = new PageImpl<>(List.of(sampleJob), PageRequest.of(0, 10), 1);
        when(jobRepository.findByActiveTrue(any(Pageable.class))).thenReturn(page);

        PagedResponse<JobResponse> result = jobService.getAllActiveJobs(0, 10, "createdAt");

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.isFirst()).isTrue();
    }

    // ── updateJob() ───────────────────────────────────────────────────

    @Test
    @DisplayName("updateJob() — success when recruiter owns the job")
    void updateJob_success() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(sampleJob));
        when(jobRepository.save(any(Job.class))).thenReturn(sampleJob);

        sampleRequest.setTitle("Lead Java Developer");
        JobResponse response = jobService.updateJob(1L, sampleRequest, recruiter);

        assertThat(response).isNotNull();
        verify(jobRepository).save(any(Job.class));
    }

    @Test
    @DisplayName("updateJob() — throws ForbiddenException when recruiter does not own the job")
    void updateJob_notOwner_throws() {
        User otherRecruiter = User.builder().id(99L).role(User.Role.RECRUITER).build();
        when(jobRepository.findById(1L)).thenReturn(Optional.of(sampleJob));

        assertThatThrownBy(() -> jobService.updateJob(1L, sampleRequest, otherRecruiter))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("only update jobs you posted");
    }

    // ── deactivateJob() ───────────────────────────────────────────────

    @Test
    @DisplayName("deactivateJob() — soft deletes the job")
    void deactivateJob_success() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(sampleJob));
        when(jobRepository.save(any(Job.class))).thenReturn(sampleJob);

        jobService.deactivateJob(1L, recruiter);

        verify(jobRepository).save(argThat(job -> !job.isActive()));
    }

    @Test
    @DisplayName("deactivateJob() — throws ForbiddenException when recruiter does not own the job")
    void deactivateJob_notOwner_throws() {
        User other = User.builder().id(88L).role(User.Role.RECRUITER).build();
        when(jobRepository.findById(1L)).thenReturn(Optional.of(sampleJob));

        assertThatThrownBy(() -> jobService.deactivateJob(1L, other))
                .isInstanceOf(ForbiddenException.class);
    }
}
