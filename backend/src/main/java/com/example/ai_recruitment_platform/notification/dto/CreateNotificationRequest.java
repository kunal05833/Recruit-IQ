package com.example.ai_recruitment_platform.notification.dto;

import com.example.ai_recruitment_platform.notification.entity.NotificationEventType;
import com.example.ai_recruitment_platform.notification.entity.NotificationType;

public class CreateNotificationRequest {

    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private NotificationEventType eventType;
    private Long referenceId;
    private String referenceType;

    // ── Constructors ──────────────────────────────────────────────────────────
    public CreateNotificationRequest() {}

    public CreateNotificationRequest(Long userId, String title, String message,
                                      NotificationType type, NotificationEventType eventType,
                                      Long referenceId, String referenceType) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.eventType = eventType;
        this.referenceId = referenceId;
        this.referenceType = referenceType;
    }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long userId;
        private String title;
        private String message;
        private NotificationType type;
        private NotificationEventType eventType;
        private Long referenceId;
        private String referenceType;

        public Builder userId(Long userId)                     { this.userId = userId; return this; }
        public Builder title(String title)                     { this.title = title; return this; }
        public Builder message(String message)                 { this.message = message; return this; }
        public Builder type(NotificationType type)             { this.type = type; return this; }
        public Builder eventType(NotificationEventType ev)     { this.eventType = ev; return this; }
        public Builder referenceId(Long referenceId)           { this.referenceId = referenceId; return this; }
        public Builder referenceType(String referenceType)     { this.referenceType = referenceType; return this; }

        public CreateNotificationRequest build() {
            return new CreateNotificationRequest(userId, title, message, type, eventType, referenceId, referenceType);
        }
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getUserId()                    { return userId; }
    public void setUserId(Long userId)         { this.userId = userId; }

    public String getTitle()                   { return title; }
    public void setTitle(String title)         { this.title = title; }

    public String getMessage()                 { return message; }
    public void setMessage(String message)     { this.message = message; }

    public NotificationType getType()          { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public NotificationEventType getEventType()              { return eventType; }
    public void setEventType(NotificationEventType eventType){ this.eventType = eventType; }

    public Long getReferenceId()               { return referenceId; }
    public void setReferenceId(Long refId)     { this.referenceId = refId; }

    public String getReferenceType()           { return referenceType; }
    public void setReferenceType(String refType){ this.referenceType = refType; }
}
