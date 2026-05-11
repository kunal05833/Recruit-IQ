package com.example.ai_recruitment_platform.repository;

import com.example.ai_recruitment_platform.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByActiveTrue(Pageable pageable);

    List<Job> findByPostedByAndActiveTrue(Long postedBy);

    // ✅ FIX: Recruiter ke saare jobs (active + inactive) pageable form mein
    // Job entity mein field "postedBy" hai — "postedById" nahi
    // getAllApplicationsForRecruiter() → recruiter ke jobIds nikalne ke liye
    Page<Job> findByPostedBy(Long postedBy, Pageable pageable);

    @Query("""
        SELECT j FROM Job j
        WHERE j.active = true
        AND (
            LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
    """)
    Page<Job> searchActiveJobs(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
        SELECT j FROM Job j
        WHERE j.active = true
        AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
        AND (:jobType  IS NULL OR j.jobType = :jobType)
    """)
    Page<Job> filterActiveJobs(
            @Param("location") String location,
            @Param("jobType")  String jobType,
            Pageable pageable);

    long countByActiveTrue();
}