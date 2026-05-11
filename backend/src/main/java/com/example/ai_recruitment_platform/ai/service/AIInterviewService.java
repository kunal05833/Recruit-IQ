package com.example.ai_recruitment_platform.ai.service;

import com.example.ai_recruitment_platform.ai.config.OpenAIConfig;
import com.example.ai_recruitment_platform.ai.dto.AnswerEvaluationResult;
import com.example.ai_recruitment_platform.ai.dto.InterviewQuestionDTO;
import com.example.ai_recruitment_platform.ai.entity.InterviewAnswer;
import com.example.ai_recruitment_platform.ai.entity.InterviewQuestion;
import com.example.ai_recruitment_platform.ai.repository.InterviewAnswerRepository;
import com.example.ai_recruitment_platform.ai.repository.InterviewQuestionRepository;
import com.example.ai_recruitment_platform.entity.CandidateSkill;
import com.example.ai_recruitment_platform.entity.Job;
import com.example.ai_recruitment_platform.exception.Exceptions.AiServiceException;
import com.example.ai_recruitment_platform.exception.Exceptions.ResourceNotFoundException;
import com.example.ai_recruitment_platform.repository.JobRepository;
import com.example.ai_recruitment_platform.repository.SkillRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIInterviewService {

    private final OpenAIConfig openAIConfig;
    private final RestTemplate openAIRestTemplate;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final SkillRepository skillRepository;
    private final JobRepository jobRepository;
    private final ObjectMapper objectMapper;

    // ── Generate Questions ────────────────────────────────────────────

    @Transactional
    public List<InterviewQuestionDTO> generateQuestions(Long candidateProfileId, Long jobId) {
        log.info("Generating interview questions for profile={} job={}", candidateProfileId, jobId);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", jobId));

        List<String> skillNames = skillRepository.findByProfileId(candidateProfileId)
                .stream().map(CandidateSkill::getSkillName).collect(Collectors.toList());

        // Delete previous questions for this candidate+job
        questionRepository.deleteByCandidateIdAndJobId(candidateProfileId, jobId);

        String prompt = buildQuestionPrompt(skillNames, job);
        List<InterviewQuestion> questions;

        try {
            String aiResponse = callOpenAI(prompt);
            questions = parseQuestionsFromAI(aiResponse, candidateProfileId, jobId);
        } catch (AiServiceException e) {
            log.warn("AI unavailable for question generation, using fallback: {}", e.getMessage());
            questions = fallbackQuestions(candidateProfileId, jobId);
        }

        questionRepository.saveAll(questions);
        log.info("Saved {} interview questions for profile={}", questions.size(), candidateProfileId);

        return questions.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Evaluate Answer ───────────────────────────────────────────────

    @Transactional
    public AnswerEvaluationResult evaluateAnswer(Long questionId, Long candidateId, String answer) {
        log.info("Evaluating answer for question={} candidate={}", questionId, candidateId);

        InterviewQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview question", questionId));

        AnswerEvaluationResult result;
        try {
            String aiResponse = callOpenAI(buildEvaluationPrompt(question.getQuestion(), answer));
            result = parseEvaluationFromAI(aiResponse);
            log.info("AI evaluation complete — overall score: {}", result.getOverallScore());
        } catch (Exception e) {
            log.warn("AI evaluation failed, using fallback scoring: {}", e.getMessage());
            result = fallbackEvaluation(answer);
        }

        answerRepository.save(InterviewAnswer.builder()
                .question(question)
                .candidateId(candidateId)
                .answer(answer)
                .answerScore(result.getAnswerScore())
                .confidenceScore(result.getConfidenceScore())
                .communicationScore(result.getCommunicationScore())
                .overallScore(result.getOverallScore())
                .aiFeedback(result.getFeedback())
                .build());

        return result;
    }

    // ── Get Questions ─────────────────────────────────────────────────

    public List<InterviewQuestionDTO> getQuestionsForInterview(Long candidateId, Long jobId) {
        return questionRepository
                .findByCandidateIdAndJobIdOrderByQuestionOrder(candidateId, jobId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── OpenAI Caller ─────────────────────────────────────────────────

    private String callOpenAI(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAIConfig.getApiKey());

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama3-8b-8192");
        body.put("max_tokens", 900);
        body.put("temperature", 0.7);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

        try {
            ResponseEntity<String> response = openAIRestTemplate.postForEntity(
                    openAIConfig.getApiUrl() + "/chat/completions",
                    new HttpEntity<>(body, headers), String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            throw new AiServiceException("OpenAI API call failed: " + e.getMessage(), e);
        }
    }

    // ── Prompt Builders ───────────────────────────────────────────────

    private String buildQuestionPrompt(List<String> skills, Job job) {
        return String.format("""
            You are a senior technical interviewer. Generate exactly 5 interview questions.
            
            Candidate Skills: %s
            Job Title: %s
            Job Description: %s
            Required Skills: %s
            
            Return ONLY a JSON array:
            [
              {
                "question": "question text here",
                "skillTag": "skill name",
                "difficultyLevel": "EASY|MEDIUM|HARD",
                "questionOrder": 1
              }
            ]
            
            Rules:
            - Focus on skills that appear in BOTH candidate and job requirement lists
            - Mix: 2 EASY, 2 MEDIUM, 1 HARD
            - Questions must be specific and actionable
            - No explanations, return ONLY the JSON array
            """,
                String.join(", ", skills),
                job.getTitle(),
                job.getDescription() != null ? job.getDescription().substring(0, Math.min(300, job.getDescription().length())) : "N/A",
                job.getRequiredSkills());
    }

    private String buildEvaluationPrompt(String question, String answer) {
        return String.format("""
            You are a strict technical interview evaluator. Score this answer objectively.
            
            Question: %s
            Candidate's Answer: %s
            
            Return ONLY a JSON object:
            {
              "answerScore": 7.5,
              "confidenceScore": 8.0,
              "communicationScore": 7.0,
              "overallScore": 7.5,
              "strengths": "What the candidate did well",
              "improvements": "What could be improved",
              "feedback": "2-3 sentence combined feedback"
            }
            
            Scoring (0-10):
            - answerScore: Technical accuracy and completeness
            - confidenceScore: Decisiveness and certainty in the response
            - communicationScore: Clarity and structure of explanation
            - overallScore: Weighted average (answerScore*0.5 + confidenceScore*0.25 + communicationScore*0.25)
            
            Return ONLY JSON, no extra text.
            """,
                question, answer);
    }

    // ── Parsers ───────────────────────────────────────────────────────

    private List<InterviewQuestion> parseQuestionsFromAI(String response, Long candidateId, Long jobId) {
        try {
            String cleaned = response.replaceAll("```json", "").replaceAll("```", "").trim();
            JsonNode arr = objectMapper.readTree(cleaned);
            List<InterviewQuestion> list = new ArrayList<>();
            for (JsonNode node : arr) {
                list.add(InterviewQuestion.builder()
                        .candidateId(candidateId).jobId(jobId)
                        .question(node.path("question").asText())
                        .skillTag(node.path("skillTag").asText())
                        .difficultyLevel(node.path("difficultyLevel").asText("MEDIUM"))
                        .questionOrder(node.path("questionOrder").asInt(list.size() + 1))
                        .build());
            }
            return list;
        } catch (Exception e) {
            log.error("Failed to parse AI questions response: {}", e.getMessage());
            return fallbackQuestions(candidateId, jobId);
        }
    }

    private AnswerEvaluationResult parseEvaluationFromAI(String response) {
        try {
            String cleaned = response.replaceAll("```json", "").replaceAll("```", "").trim();
            JsonNode node = objectMapper.readTree(cleaned);
            String strengths    = node.path("strengths").asText("");
            String improvements = node.path("improvements").asText("");
            String feedback     = node.path("feedback").asText("No feedback available.");
            // Enrich feedback with strengths/improvements if present
            String fullFeedback = feedback;
            if (!strengths.isBlank())    fullFeedback = "✅ Strengths: " + strengths + " | " + fullFeedback;
            if (!improvements.isBlank()) fullFeedback += " | 📈 Improve: " + improvements;

            return AnswerEvaluationResult.builder()
                    .answerScore(node.path("answerScore").asDouble(5.0))
                    .confidenceScore(node.path("confidenceScore").asDouble(5.0))
                    .communicationScore(node.path("communicationScore").asDouble(5.0))
                    .overallScore(node.path("overallScore").asDouble(5.0))
                    .feedback(fullFeedback)
                    .build();
        } catch (Exception e) {
            log.error("Failed to parse AI evaluation response: {}", e.getMessage());
            return fallbackEvaluation(null);
        }
    }

    // ── Fallback ──────────────────────────────────────────────────────

    private AnswerEvaluationResult fallbackEvaluation(String answer) {
        double score = (answer != null && answer.length() > 100) ? 6.5 : 4.5;
        return AnswerEvaluationResult.builder()
                .answerScore(score).confidenceScore(score)
                .communicationScore(score).overallScore(score)
                .feedback("AI evaluation temporarily unavailable. Score estimated from response length.")
                .build();
    }

    private List<InterviewQuestion> fallbackQuestions(Long candidateId, Long jobId) {
        List<String> defaults = List.of(
                "Describe the most technically complex project you have built.",
                "How do you approach designing a REST API from scratch?",
                "Explain how you debug a production issue under pressure.",
                "What is your strategy for optimizing a slow database query?",
                "How do you ensure code quality in a collaborative team?"
        );
        List<InterviewQuestion> list = new ArrayList<>();
        for (int i = 0; i < defaults.size(); i++) {
            list.add(InterviewQuestion.builder()
                    .candidateId(candidateId).jobId(jobId)
                    .question(defaults.get(i))
                    .skillTag("general").difficultyLevel("MEDIUM")
                    .questionOrder(i + 1).build());
        }
        return list;
    }

    private InterviewQuestionDTO toDTO(InterviewQuestion q) {
        return InterviewQuestionDTO.builder()
                .id(q.getId()).question(q.getQuestion())
                .skillTag(q.getSkillTag()).difficultyLevel(q.getDifficultyLevel())
                .questionOrder(q.getQuestionOrder()).build();
    }
}
