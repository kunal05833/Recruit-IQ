package com.example.ai_recruitment_platform.notification.websocket;

import com.example.ai_recruitment_platform.notification.dto.NotificationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationWebSocketService {

    private static final Logger log = LoggerFactory.getLogger(NotificationWebSocketService.class);

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationWebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void pushToUser(Long userId, NotificationDTO notification) {
        String destination = "/topic/notifications/" + userId;
        try {
            messagingTemplate.convertAndSend(destination, notification);
            log.info("WebSocket push → user {} : {}", userId, notification.getTitle());
        } catch (Exception e) {
            log.warn("WebSocket push failed for user {}: {}", userId, e.getMessage());
        }
    }

    public void pushUnreadCount(Long userId, long count) {
        String destination = "/topic/notifications/" + userId + "/count";
        try {
            messagingTemplate.convertAndSend(destination, count);
        } catch (Exception e) {
            log.warn("WebSocket count push failed for user {}: {}", userId, e.getMessage());
        }
    }
}
