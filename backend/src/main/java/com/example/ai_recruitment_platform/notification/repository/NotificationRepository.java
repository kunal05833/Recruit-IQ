package com.example.ai_recruitment_platform.notification.repository;

import com.example.ai_recruitment_platform.notification.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

    // Get all notifications for a user (latest first)
    List<NotificationEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Get unread notifications only
    List<NotificationEntity> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    // Count unread
    long countByUserIdAndIsReadFalse(Long userId);

    // Mark single notification as read
    @Modifying
    @Query("UPDATE NotificationEntity n SET n.isRead = true WHERE n.id = :id AND n.userId = :userId")
    int markAsRead(@Param("id") Long id, @Param("userId") Long userId);

    // Mark ALL as read for a user
    @Modifying
    @Query("UPDATE NotificationEntity n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
    int markAllAsRead(@Param("userId") Long userId);

    // Recent 20 notifications
    @Query("SELECT n FROM NotificationEntity n WHERE n.userId = :userId ORDER BY n.createdAt DESC LIMIT 20")
    List<NotificationEntity> findTop20ByUserId(@Param("userId") Long userId);
}
