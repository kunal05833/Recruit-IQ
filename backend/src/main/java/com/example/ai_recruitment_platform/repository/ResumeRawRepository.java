package com.example.ai_recruitment_platform.repository;

import com.example.ai_recruitment_platform.entity.ResumeRaw;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResumeRawRepository extends JpaRepository<ResumeRaw, Long> {
    List<ResumeRaw> findByUserId(Long userId);
}
