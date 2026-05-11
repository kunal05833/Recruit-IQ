package com.example.ai_recruitment_platform.ai.repository;

import com.example.ai_recruitment_platform.ai.entity.InterviewAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, Long> {
    List<InterviewAnswer> findByCandidateId(Long candidateId);
    List<InterviewAnswer> findByQuestionId(Long questionId);
}
