package com.example.ai_recruitment_platform.repository;

import com.example.ai_recruitment_platform.entity.CandidateSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillRepository extends JpaRepository<CandidateSkill, Long> {
    List<CandidateSkill> findByProfileId(Long profileId);
}
