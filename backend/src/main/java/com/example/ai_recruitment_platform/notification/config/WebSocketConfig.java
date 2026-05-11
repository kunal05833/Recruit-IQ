package com.example.ai_recruitment_platform.notification.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
            .addEndpoint("/ws/notifications")          // WebSocket endpoint
            .setAllowedOriginPatterns("*")             // Allow React dev server
            .withSockJS();                             // SockJS fallback
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Frontend subscribes to /topic/notifications/{userId}
        registry.enableSimpleBroker("/topic", "/queue");

        // Frontend sends to /app/...
        registry.setApplicationDestinationPrefixes("/app");

        // User-specific queue prefix
        registry.setUserDestinationPrefix("/user");
    }
}
