package com.example.ai_recruitment_platform.notification.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class NotificationEventPublisher {

    private final ApplicationEventPublisher publisher;

    public NotificationEventPublisher(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    // ── Publish Methods ───────────────────────────────────────────────────────
    public void publishResumeUploaded(Long userId) {
        publisher.publishEvent(new ResumeUploadedEvent(userId));
    }
    public void publishResumeProcessed(Long userId, int skillCount) {
        publisher.publishEvent(new ResumeProcessedEvent(userId, skillCount));
    }
    public void publishProfileGenerated(Long userId, String name) {
        publisher.publishEvent(new ProfileGeneratedEvent(userId, name));
    }
    public void publishJobMatchFound(Long userId, String jobTitle, double matchPct) {
        publisher.publishEvent(new JobMatchFoundEvent(userId, jobTitle, matchPct));
    }
    public void publishApplicationSubmitted(Long userId, String jobTitle) {
        publisher.publishEvent(new ApplicationSubmittedEvent(userId, jobTitle));
    }
    public void publishShortlisted(Long userId, String jobTitle) {
        publisher.publishEvent(new ShortlistedEvent(userId, jobTitle));
    }
    public void publishInterviewScheduled(Long userId, String jobTitle) {
        publisher.publishEvent(new InterviewScheduledEvent(userId, jobTitle));
    }
    public void publishInterviewResult(Long userId, String jobTitle, double score) {
        publisher.publishEvent(new InterviewResultEvent(userId, jobTitle, score));
    }
    public void publishNewApplication(Long hrId, String candidateName, String jobTitle, double matchPct) {
        publisher.publishEvent(new NewApplicationEvent(hrId, candidateName, jobTitle, matchPct));
    }
    public void publishStrongMatch(Long hrId, String candidateName, String jobTitle, double matchPct) {
        publisher.publishEvent(new StrongMatchEvent(hrId, candidateName, jobTitle, matchPct));
    }
    public void publishInterviewCompleted(Long hrId, String candidateName, String jobTitle) {
        publisher.publishEvent(new InterviewCompletedEvent(hrId, candidateName, jobTitle));
    }

    // ── Event Classes ─────────────────────────────────────────────────────────

    public static class ResumeUploadedEvent {
        private final Long userId;
        public ResumeUploadedEvent(Long userId) { this.userId = userId; }
        public Long getUserId() { return userId; }
    }

    public static class ResumeProcessedEvent {
        private final Long userId;
        private final int skillCount;
        public ResumeProcessedEvent(Long userId, int skillCount) { this.userId = userId; this.skillCount = skillCount; }
        public Long getUserId()  { return userId; }
        public int getSkillCount(){ return skillCount; }
    }

    public static class ProfileGeneratedEvent {
        private final Long userId;
        private final String name;
        public ProfileGeneratedEvent(Long userId, String name) { this.userId = userId; this.name = name; }
        public Long getUserId() { return userId; }
        public String getName() { return name; }
    }

    public static class JobMatchFoundEvent {
        private final Long userId;
        private final String jobTitle;
        private final double matchPct;
        public JobMatchFoundEvent(Long u, String j, double m) { userId=u; jobTitle=j; matchPct=m; }
        public Long getUserId()    { return userId; }
        public String getJobTitle(){ return jobTitle; }
        public double getMatchPct(){ return matchPct; }
    }

    public static class ApplicationSubmittedEvent {
        private final Long userId;
        private final String jobTitle;
        public ApplicationSubmittedEvent(Long u, String j) { userId=u; jobTitle=j; }
        public Long getUserId()    { return userId; }
        public String getJobTitle(){ return jobTitle; }
    }

    public static class ShortlistedEvent {
        private final Long userId;
        private final String jobTitle;
        public ShortlistedEvent(Long u, String j) { userId=u; jobTitle=j; }
        public Long getUserId()    { return userId; }
        public String getJobTitle(){ return jobTitle; }
    }

    public static class InterviewScheduledEvent {
        private final Long userId;
        private final String jobTitle;
        public InterviewScheduledEvent(Long u, String j) { userId=u; jobTitle=j; }
        public Long getUserId()    { return userId; }
        public String getJobTitle(){ return jobTitle; }
    }

    public static class InterviewResultEvent {
        private final Long userId;
        private final String jobTitle;
        private final double score;
        public InterviewResultEvent(Long u, String j, double s) { userId=u; jobTitle=j; score=s; }
        public Long getUserId()    { return userId; }
        public String getJobTitle(){ return jobTitle; }
        public double getScore()   { return score; }
    }

    public static class NewApplicationEvent {
        private final Long hrUserId;
        private final String candidateName;
        private final String jobTitle;
        private final double matchPct;
        public NewApplicationEvent(Long h, String c, String j, double m) { hrUserId=h; candidateName=c; jobTitle=j; matchPct=m; }
        public Long getHrUserId()       { return hrUserId; }
        public String getCandidateName(){ return candidateName; }
        public String getJobTitle()     { return jobTitle; }
        public double getMatchPct()     { return matchPct; }
    }

    public static class StrongMatchEvent {
        private final Long hrUserId;
        private final String candidateName;
        private final String jobTitle;
        private final double matchPct;
        public StrongMatchEvent(Long h, String c, String j, double m) { hrUserId=h; candidateName=c; jobTitle=j; matchPct=m; }
        public Long getHrUserId()       { return hrUserId; }
        public String getCandidateName(){ return candidateName; }
        public String getJobTitle()     { return jobTitle; }
        public double getMatchPct()     { return matchPct; }
    }

    public static class InterviewCompletedEvent {
        private final Long hrUserId;
        private final String candidateName;
        private final String jobTitle;
        public InterviewCompletedEvent(Long h, String c, String j) { hrUserId=h; candidateName=c; jobTitle=j; }
        public Long getHrUserId()       { return hrUserId; }
        public String getCandidateName(){ return candidateName; }
        public String getJobTitle()     { return jobTitle; }
    }
}
