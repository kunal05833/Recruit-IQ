package com.example.ai_recruitment_platform.ai.dto;

import java.util.List;

public class CandidatePerformanceDTO {

    private Long   candidateId;
    private String candidateName;
    private String candidateEmail;       // ← ADDED - was missing in original
    private double matchPercentage;
    private double interviewScore;
    private double combinedScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String recommendation;

    // ── Constructors ──────────────────────────────────────────────────────────
    public CandidatePerformanceDTO() {}

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long   candidateId;
        private String candidateName;
        private String candidateEmail;
        private double matchPercentage;
        private double interviewScore;
        private double combinedScore;
        private List<String> matchedSkills;
        private List<String> missingSkills;
        private String recommendation;

        public Builder candidateId(Long v)            { this.candidateId = v; return this; }
        public Builder candidateName(String v)        { this.candidateName = v; return this; }
        public Builder candidateEmail(String v)       { this.candidateEmail = v; return this; }
        public Builder matchPercentage(double v)      { this.matchPercentage = v; return this; }
        public Builder interviewScore(double v)       { this.interviewScore = v; return this; }
        public Builder combinedScore(double v)        { this.combinedScore = v; return this; }
        public Builder matchedSkills(List<String> v)  { this.matchedSkills = v; return this; }
        public Builder missingSkills(List<String> v)  { this.missingSkills = v; return this; }
        public Builder recommendation(String v)       { this.recommendation = v; return this; }

        public CandidatePerformanceDTO build() {
            CandidatePerformanceDTO d = new CandidatePerformanceDTO();
            d.candidateId    = candidateId;
            d.candidateName  = candidateName;
            d.candidateEmail = candidateEmail;
            d.matchPercentage= matchPercentage;
            d.interviewScore = interviewScore;
            d.combinedScore  = combinedScore;
            d.matchedSkills  = matchedSkills;
            d.missingSkills  = missingSkills;
            d.recommendation = recommendation;
            return d;
        }
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getCandidateId()                     { return candidateId; }
    public void setCandidateId(Long v)               { this.candidateId = v; }

    public String getCandidateName()                 { return candidateName; }
    public void setCandidateName(String v)           { this.candidateName = v; }

    public String getCandidateEmail()                { return candidateEmail; }
    public void setCandidateEmail(String v)          { this.candidateEmail = v; }

    public double getMatchPercentage()               { return matchPercentage; }
    public void setMatchPercentage(double v)         { this.matchPercentage = v; }

    public double getInterviewScore()                { return interviewScore; }
    public void setInterviewScore(double v)          { this.interviewScore = v; }

    public double getCombinedScore()                 { return combinedScore; }
    public void setCombinedScore(double v)           { this.combinedScore = v; }

    public List<String> getMatchedSkills()           { return matchedSkills; }
    public void setMatchedSkills(List<String> v)     { this.matchedSkills = v; }

    public List<String> getMissingSkills()           { return missingSkills; }
    public void setMissingSkills(List<String> v)     { this.missingSkills = v; }

    public String getRecommendation()                { return recommendation; }
    public void setRecommendation(String v)          { this.recommendation = v; }
}
