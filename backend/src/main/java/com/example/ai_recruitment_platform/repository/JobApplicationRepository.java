package com.example.ai_recruitment_platform.repository;

import com.example.ai_recruitment_platform.entity.JobApplication;
import com.example.ai_recruitment_platform.entity.JobApplication.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    Page<JobApplication> findByCandidateIdOrderByAppliedAtDesc(Long candidateId, Pageable pageable);

    Page<JobApplication> findByJobIdOrderByAppliedAtDesc(Long jobId, Pageable pageable);

    Page<JobApplication> findByJobIdAndStatus(Long jobId, ApplicationStatus status, Pageable pageable);

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    Optional<JobApplication> findByCandidateIdAndJobId(Long candidateId, Long jobId);

    @Query("SELECT ja FROM JobApplication ja WHERE ja.jobId = :jobId AND ja.status = 'SHORTLISTED' ORDER BY ja.updatedAt DESC")
    List<JobApplication> findShortlistedByJobId(@Param("jobId") Long jobId);

    long countByJobId(Long jobId);

    long countByCandidateId(Long candidateId);

    // ✅ FIX: Recruiter ke multiple jobs ki applications ek saath fetch karo
    // getAllApplicationsForRecruiter() mein use hota hai
    Page<JobApplication> findByJobIdIn(List<Long> jobIds, Pageable pageable);

    // ✅ FIX: Status filter ke saath multiple jobs ki applications
    Page<JobApplication> findByJobIdInAndStatus(
            List<Long> jobIds,
            ApplicationStatus status,
            Pageable pageable
    );
}