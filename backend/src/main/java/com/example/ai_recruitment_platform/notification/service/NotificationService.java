package com.example.ai_recruitment_platform.notification.service;

import com.example.ai_recruitment_platform.notification.dto.CreateNotificationRequest;
import com.example.ai_recruitment_platform.notification.dto.NotificationDTO;
import com.example.ai_recruitment_platform.notification.dto.UnreadCountResponse;
import com.example.ai_recruitment_platform.notification.entity.NotificationEntity;
import com.example.ai_recruitment_platform.notification.entity.NotificationEventType;
import com.example.ai_recruitment_platform.notification.entity.NotificationType;
import com.example.ai_recruitment_platform.notification.repository.NotificationRepository;
import com.example.ai_recruitment_platform.notification.websocket.NotificationWebSocketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final NotificationWebSocketService webSocketService;

    public NotificationService(NotificationRepository notificationRepository,
                                NotificationWebSocketService webSocketService) {
        this.notificationRepository = notificationRepository;
        this.webSocketService       = webSocketService;
    }

    // ── Core Create ───────────────────────────────────────────────────────────
    @Transactional
    public NotificationDTO createNotification(CreateNotificationRequest request) {
        NotificationEntity entity = NotificationEntity.builder()
                .userId(request.getUserId())
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .eventType(request.getEventType())
                .referenceId(request.getReferenceId())
                .referenceType(request.getReferenceType())
                .build();

        entity = notificationRepository.save(entity);
        NotificationDTO dto = NotificationDTO.from(entity);

        // Push real-time via WebSocket
        webSocketService.pushToUser(request.getUserId(), dto);

        // Update unread count badge
        long unread = notificationRepository.countByUserIdAndIsReadFalse(request.getUserId());
        webSocketService.pushUnreadCount(request.getUserId(), unread);

        log.info("Notification created for user {} → {}", request.getUserId(), request.getTitle());
        return dto;
    }

    // ── Convenience Methods ───────────────────────────────────────────────────
    public NotificationDTO notify(Long userId, String title, String message,
                                   NotificationType type, NotificationEventType eventType) {
        return createNotification(CreateNotificationRequest.builder()
                .userId(userId).title(title).message(message)
                .type(type).eventType(eventType).build());
    }

    // ── Candidate Event Triggers ──────────────────────────────────────────────
    public void onResumeUploaded(Long candidateUserId) {
        notify(candidateUserId,
                "Resume Uploaded ✅",
                "Your resume has been received and is being processed by our AI engine.",
                NotificationType.RESUME, NotificationEventType.RESUME_UPLOADED);
    }

    public void onResumeProcessed(Long candidateUserId, int skillCount) {
        notify(candidateUserId,
                "Resume Processed 🧠",
                "AI has extracted " + skillCount + " skills from your resume. Your profile is ready!",
                NotificationType.RESUME, NotificationEventType.RESUME_PROCESSED);
    }

    public void onProfileGenerated(Long candidateUserId, String candidateName) {
        notify(candidateUserId,
                "Profile Created 🎉",
                "Welcome, " + candidateName + "! Your AI-powered profile is live.",
                NotificationType.PROFILE, NotificationEventType.PROFILE_GENERATED);
    }

    public void onJobMatchFound(Long candidateUserId, String jobTitle, double matchPct) {
        notify(candidateUserId,
                "New Job Match Found 🎯",
                "A job matching your skills: " + jobTitle + " (" + (int) matchPct + "% match).",
                NotificationType.JOB, NotificationEventType.JOB_MATCH_FOUND);
    }

    public void onApplicationSubmitted(Long candidateUserId, String jobTitle) {
        notify(candidateUserId,
                "Application Submitted ✉️",
                "Your application for " + jobTitle + " has been submitted successfully.",
                NotificationType.APPLICATION, NotificationEventType.APPLICATION_SUBMITTED);
    }

    public void onApplicationShortlisted(Long candidateUserId, String jobTitle) {
        notify(candidateUserId,
                "You've Been Shortlisted! 🌟",
                "Congratulations! Your profile has been shortlisted for the " + jobTitle + " role.",
                NotificationType.APPLICATION, NotificationEventType.APPLICATION_SHORTLISTED);
    }

    public void onInterviewScheduled(Long candidateUserId, String jobTitle) {
        notify(candidateUserId,
                "Interview Scheduled 📅",
                "Your AI interview for the " + jobTitle + " role has been scheduled. Good luck!",
                NotificationType.INTERVIEW, NotificationEventType.INTERVIEW_SCHEDULED);
    }

    public void onInterviewReminder(Long candidateUserId, String jobTitle) {
        notify(candidateUserId,
                "Interview Reminder ⏰",
                "Reminder: Your AI interview for " + jobTitle + " is about to start. Be prepared!",
                NotificationType.INTERVIEW, NotificationEventType.INTERVIEW_REMINDER);
    }

    public void onInterviewResultGenerated(Long candidateUserId, String jobTitle, double score) {
        notify(candidateUserId,
                "Interview Result Ready 📊",
                "Your AI interview result for " + jobTitle + " is ready. Overall score: " +
                        String.format("%.1f", score) + "/10",
                NotificationType.RESULT, NotificationEventType.INTERVIEW_RESULT_GENERATED);
    }

    // ── HR Event Triggers ─────────────────────────────────────────────────────
    public void onNewCandidateApplied(Long hrUserId, String candidateName, String jobTitle, double matchPct) {
        notify(hrUserId,
                "New Application Received 👤",
                candidateName + " applied for " + jobTitle + " with " + (int) matchPct + "% match.",
                NotificationType.APPLICATION, NotificationEventType.NEW_CANDIDATE_APPLIED);
    }

    public void onStrongMatchCandidate(Long hrUserId, String candidateName, String jobTitle, double matchPct) {
        notify(hrUserId,
                "High-Match Candidate Alert 🔥",
                "Candidate with " + (int) matchPct + "% match applied for " + jobTitle + ": " + candidateName,
                NotificationType.APPLICATION, NotificationEventType.STRONG_MATCH_CANDIDATE);
    }

    public void onCandidateInterviewCompleted(Long hrUserId, String candidateName, String jobTitle) {
        notify(hrUserId,
                "Interview Completed 🎙️",
                candidateName + " completed the AI interview for " + jobTitle + ". Review results now.",
                NotificationType.INTERVIEW, NotificationEventType.CANDIDATE_INTERVIEW_COMPLETED);
    }

    // ── Read/Fetch ────────────────────────────────────────────────────────────
    public List<NotificationDTO> getNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(NotificationDTO::from).collect(Collectors.toList());
    }

    public List<NotificationDTO> getRecentNotifications(Long userId) {
        return notificationRepository.findTop20ByUserId(userId)
                .stream().map(NotificationDTO::from).collect(Collectors.toList());
    }

    public UnreadCountResponse getUnreadCount(Long userId) {
        return new UnreadCountResponse(notificationRepository.countByUserIdAndIsReadFalse(userId));
    }

    @Transactional
    public boolean markAsRead(Long notificationId, Long userId) {
        int updated = notificationRepository.markAsRead(notificationId, userId);
        if (updated > 0) {
            long unread = notificationRepository.countByUserIdAndIsReadFalse(userId);
            webSocketService.pushUnreadCount(userId, unread);
        }
        return updated > 0;
    }

    @Transactional
    public int markAllAsRead(Long userId) {
        int updated = notificationRepository.markAllAsRead(userId);
        if (updated > 0) webSocketService.pushUnreadCount(userId, 0);
        return updated;
    }
}
