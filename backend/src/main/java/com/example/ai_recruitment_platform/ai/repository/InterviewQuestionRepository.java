package com.example.ai_recruitment_platform.ai.repository;

import com.example.ai_recruitment_platform.ai.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findByCandidateIdAndJobIdOrderByQuestionOrder(Long candidateId, Long jobId);
    void deleteByCandidateIdAndJobId(Long candidateId, Long jobId);
}
