package com.example.ai_recruitment_platform.notification.entity;

public enum NotificationEventType {

    // ── Candidate Events ──────────────────────────────
    RESUME_UPLOADED,
    RESUME_PROCESSED,
    PROFILE_GENERATED,
    JOB_MATCH_FOUND,
    APPLICATION_SUBMITTED,
    APPLICATION_SHORTLISTED,
    INTERVIEW_SCHEDULED,
    INTERVIEW_REMINDER,
    INTERVIEW_RESULT_GENERATED,

    // ── HR/Recruiter Events ───────────────────────────
    NEW_CANDIDATE_APPLIED,
    CANDIDATE_PROFILE_PROCESSED,
    STRONG_MATCH_CANDIDATE,
    CANDIDATE_INTERVIEW_COMPLETED,
    INTERVIEW_RESULT_READY,

    // ── System ────────────────────────────────────────
    SYSTEM_ANNOUNCEMENT
}
