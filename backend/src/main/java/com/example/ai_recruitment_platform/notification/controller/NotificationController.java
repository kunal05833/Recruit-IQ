package com.example.ai_recruitment_platform.notification.controller;

import com.example.ai_recruitment_platform.dto.response.ApiResponse;
import com.example.ai_recruitment_platform.notification.dto.NotificationDTO;
import com.example.ai_recruitment_platform.notification.dto.UnreadCountResponse;
import com.example.ai_recruitment_platform.notification.service.NotificationService;
import com.example.ai_recruitment_platform.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Notification management — read, mark-as-read, real-time WebSocket")
public class NotificationController {

    private final NotificationService notificationService;
    private final SecurityUtil securityUtil;

    @Operation(summary = "Get all notifications for current user (latest first)")
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getNotifications() {
        return ResponseEntity.ok(ApiResponse.success(
                notificationService.getNotifications(securityUtil.getCurrentUserId())));
    }

    @Operation(summary = "Get last 20 notifications (for bell dropdown)")
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getRecentNotifications() {
        return ResponseEntity.ok(ApiResponse.success(
                notificationService.getRecentNotifications(securityUtil.getCurrentUserId())));
    }

    @Operation(summary = "Get unread notification count (for badge)")
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<UnreadCountResponse>> getUnreadCount() {
        return ResponseEntity.ok(ApiResponse.success(
                notificationService.getUnreadCount(securityUtil.getCurrentUserId())));
    }

    @Operation(summary = "Mark a single notification as read")
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        boolean updated = notificationService.markAsRead(id, securityUtil.getCurrentUserId());
        return ResponseEntity.ok(updated
                ? ApiResponse.success("Notification marked as read")
                : ApiResponse.error("Notification not found"));
    }

    @Operation(summary = "Mark all notifications as read")
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        int count = notificationService.markAllAsRead(securityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.success(count + " notifications marked as read"));
    }
}
