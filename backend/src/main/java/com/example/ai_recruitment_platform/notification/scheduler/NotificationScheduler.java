package com.example.ai_recruitment_platform.notification.scheduler;

import com.example.ai_recruitment_platform.ai.repository.MatchScoreRepository;
import com.example.ai_recruitment_platform.notification.service.NotificationService;
import com.example.ai_recruitment_platform.repository.JobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(NotificationScheduler.class);

    private final NotificationService notificationService;
    private final MatchScoreRepository matchScoreRepository;
    private final JobRepository jobRepository;

    // ✅ FIX: userRepository REMOVED — it was unused
    public NotificationScheduler(NotificationService notificationService,
                                  MatchScoreRepository matchScoreRepository,
                                  JobRepository jobRepository) {
        this.notificationService  = notificationService;
        this.matchScoreRepository = matchScoreRepository;
        this.jobRepository        = jobRepository;
    }

    /**
     * Every 6 hours — notify candidates about strong job matches
     */
    @Scheduled(fixedRateString = "${notification.job-match-check-ms:21600000}")
    public void checkAndNotifyJobMatches() {
        log.info("Scheduler: Checking job matches for notifications...");
        try {
            matchScoreRepository.findAll().forEach(match -> {
                if (match.getMatchPercentage() != null && match.getMatchPercentage() >= 60) {
                    try {
                        String jobTitle = jobRepository.findById(match.getJobId())
                                .map(j -> j.getTitle()).orElse("a new role");
                        notificationService.onJobMatchFound(
                                match.getCandidateId(), jobTitle, match.getMatchPercentage());
                    } catch (Exception e) {
                        log.warn("Failed to notify candidate {}: {}", match.getCandidateId(), e.getMessage());
                    }
                }
            });
        } catch (Exception e) {
            log.error("Job match notification scheduler failed: {}", e.getMessage());
        }
    }

    /**
     * Every day at 8 AM — interview reminders placeholder
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void sendDailyInterviewReminders() {
        log.info("Scheduler: Daily interview reminder check running...");
        // Wire to interview_schedule table when added
    }
}
