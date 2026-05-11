package com.example.ai_recruitment_platform.notification.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notif_user_id", columnList = "user_id"),
    @Index(name = "idx_notif_is_read", columnList = "is_read")
})
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private NotificationEventType eventType;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "reference_type")
    private String referenceType;

    // ── Constructors ──────────────────────────────────────────────────────────
    public NotificationEntity() {}

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long userId;
        private String title;
        private String message;
        private NotificationType type;
        private NotificationEventType eventType;
        private boolean isRead = false;
        private LocalDateTime createdAt = LocalDateTime.now();
        private Long referenceId;
        private String referenceType;

        public Builder userId(Long v)                     { this.userId = v; return this; }
        public Builder title(String v)                    { this.title = v; return this; }
        public Builder message(String v)                  { this.message = v; return this; }
        public Builder type(NotificationType v)           { this.type = v; return this; }
        public Builder eventType(NotificationEventType v) { this.eventType = v; return this; }
        public Builder isRead(boolean v)                  { this.isRead = v; return this; }
        public Builder createdAt(LocalDateTime v)         { this.createdAt = v; return this; }
        public Builder referenceId(Long v)                { this.referenceId = v; return this; }
        public Builder referenceType(String v)            { this.referenceType = v; return this; }

        public NotificationEntity build() {
            NotificationEntity e = new NotificationEntity();
            e.userId       = this.userId;
            e.title        = this.title;
            e.message      = this.message;
            e.type         = this.type;
            e.eventType    = this.eventType;
            e.isRead       = this.isRead;
            e.createdAt    = this.createdAt;
            e.referenceId  = this.referenceId;
            e.referenceType= this.referenceType;
            return e;
        }
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId()                           { return id; }

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
