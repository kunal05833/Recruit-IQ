package com.example.ai_recruitment_platform.notification.service;

import com.example.ai_recruitment_platform.notification.service.NotificationEventPublisher.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventListener.class);
    private final NotificationService notificationService;

    public NotificationEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Async @EventListener
    public void on(ResumeUploadedEvent e) {
        log.info("Event: ResumeUploaded → user {}", e.getUserId());
        notificationService.onResumeUploaded(e.getUserId());
    }

    @Async @EventListener
    public void on(ResumeProcessedEvent e) {
        log.info("Event: ResumeProcessed → user {} skills={}", e.getUserId(), e.getSkillCount());
        notificationService.onResumeProcessed(e.getUserId(), e.getSkillCount());
    }

    @Async @EventListener
    public void on(ProfileGeneratedEvent e) {
        notificationService.onProfileGenerated(e.getUserId(), e.getName());
    }

    @Async @EventListener
    public void on(JobMatchFoundEvent e) {
        notificationService.onJobMatchFound(e.getUserId(), e.getJobTitle(), e.getMatchPct());
    }

    @Async @EventListener
    public void on(ApplicationSubmittedEvent e) {
        notificationService.onApplicationSubmitted(e.getUserId(), e.getJobTitle());
    }

    @Async @EventListener
    public void on(ShortlistedEvent e) {
        notificationService.onApplicationShortlisted(e.getUserId(), e.getJobTitle());
    }

    @Async @EventListener
    public void on(InterviewScheduledEvent e) {
        notificationService.onInterviewScheduled(e.getUserId(), e.getJobTitle());
    }

    @Async @EventListener
    public void on(InterviewResultEvent e) {
        notificationService.onInterviewResultGenerated(e.getUserId(), e.getJobTitle(), e.getScore());
    }

    @Async @EventListener
    public void on(NewApplicationEvent e) {
        notificationService.onNewCandidateApplied(e.getHrUserId(), e.getCandidateName(), e.getJobTitle(), e.getMatchPct());
    }

    @Async @EventListener
    public void on(StrongMatchEvent e) {
        notificationService.onStrongMatchCandidate(e.getHrUserId(), e.getCandidateName(), e.getJobTitle(), e.getMatchPct());
    }

    @Async @EventListener
    public void on(InterviewCompletedEvent e) {
        notificationService.onCandidateInterviewCompleted(e.getHrUserId(), e.getCandidateName(), e.getJobTitle());
    }
}
