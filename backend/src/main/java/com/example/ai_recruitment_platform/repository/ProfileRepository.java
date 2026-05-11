package com.example.ai_recruitment_platform.repository;

import com.example.ai_recruitment_platform.entity.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByUserId(Long userId);
}
