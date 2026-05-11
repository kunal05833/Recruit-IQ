package com.example.ai_recruitment_platform.notification.dto;

import com.example.ai_recruitment_platform.notification.entity.NotificationEntity;
import com.example.ai_recruitment_platform.notification.entity.NotificationEventType;
import com.example.ai_recruitment_platform.notification.entity.NotificationType;
import java.time.LocalDateTime;

public class NotificationDTO {

    private Long id;
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private NotificationEventType eventType;
    private boolean isRead;
    private LocalDateTime createdAt;
    private Long referenceId;
    private String referenceType;

    // ── Constructor ───────────────────────────────────────────────────────────
    public NotificationDTO() {}

    // ── Static factory from entity ────────────────────────────────────────────
    public static NotificationDTO from(NotificationEntity entity) {
        NotificationDTO dto = new NotificationDTO();
        dto.id            = entity.getId();
        dto.userId        = entity.getUserId();
        dto.title         = entity.getTitle();
        dto.message       = entity.getMessage();
        dto.type          = entity.getType();
        dto.eventType     = entity.getEventType();
        dto.isRead        = entity.isRead();
        dto.createdAt     = entity.getCreatedAt();
        dto.referenceId   = entity.getReferenceId();
        dto.referenceType = entity.getReferenceType();
        return dto;
    }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String title;
        private String message;
        private NotificationType type;
        private NotificationEventType eventType;
        private boolean isRead;
        private LocalDateTime createdAt;
        private Long referenceId;
        private String referenceType;

        public Builder id(Long v)                         { this.id = v; return this; }
        public Builder userId(Long v)                     { this.userId = v; return this; }
        public Builder title(String v)                    { this.title = v; return this; }
        public Builder message(String v)                  { this.message = v; return this; }
        public Builder type(NotificationType v)           { this.type = v; return this; }
        public Builder eventType(NotificationEventType v) { this.eventType = v; return this; }
        public Builder isRead(boolean v)                  { this.isRead = v; return this; }
        public Builder createdAt(LocalDateTime v)         { this.createdAt = v; return this; }
        public Builder referenceId(Long v)                { this.referenceId = v; return this; }
        public Builder referenceType(String v)            { this.referenceType = v; return this; }

        public NotificationDTO build() {
            NotificationDTO d = new NotificationDTO();
            d.id = id; d.userId = userId; d.title = title; d.message = message;
            d.type = type; d.eventType = eventType; d.isRead = isRead;
            d.createdAt = createdAt; d.referenceId = referenceId; d.referenceType = referenceType;
            return d;
        }
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId()                           { return id; }
    public void setId(Long id)                    { this.id = id; }

    public Long getUserId()                       { return userId; }
    public void setUserId(Long userId)            { this.userId = userId; }

    public String getTitle()                      { return title; }
    public void setTitle(String title)            { this.title = title; }

    public String getMessage()                    { return message; }
    public void setMessage(String message)        { this.message = message; }

    public NotificationType getType()             { return type; }
    public void setType(NotificationType type)    { this.type = type; }

    public NotificationEventType getEventType()              { return eventType; }
    public void setEventType(NotificationEventType eventType){ this.eventType = eventType; }

    public boolean isRead()                       { return isRead; }
    public void setRead(boolean isRead)           { this.isRead = isRead; }

    public LocalDateTime getCreatedAt()           { return createdAt; }
    public void setCreatedAt(LocalDateTime v)     { this.createdAt = v; }

    public Long getReferenceId()                  { return referenceId; }
    public void setReferenceId(Long referenceId)  { this.referenceId = referenceId; }

    public String getReferenceType()              { return referenceType; }
    public void setReferenceType(String refType)  { this.referenceType = refType; }
}
