package com.example.ai_recruitment_platform.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@hireai.com}")
    private String fromEmail;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    /**
     * Send email asynchronously — never blocks the main thread.
     */
    @Async
    public void sendNotificationEmail(String toEmail, String subject, String title, String body) {
        if (!emailEnabled) {
            log.info("Email disabled. Would have sent to {}: {}", toEmail, subject);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(buildHtmlEmail(title, body), true);

            mailSender.send(message);
            log.info("Email sent to {} — Subject: {}", toEmail, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildHtmlEmail(String title, String body) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8"/>
              <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7ff; margin: 0; padding: 0; }
                .container { max-width: 560px; margin: 40px auto; background: #ffffff;
                             border-radius: 16px; overflow: hidden;
                             box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
                .header { background: linear-gradient(135deg, #6366F1, #8B5CF6);
                          padding: 28px 32px; text-align: center; }
                .header h1 { color: white; margin: 0; font-size: 22px; font-weight: 800; }
                .header p  { color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px; }
                .body { padding: 32px; }
                .title { font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 12px; }
                .message { font-size: 15px; color: #475569; line-height: 1.7; }
                .footer { background: #f8fafc; padding: 20px 32px; text-align: center;
                          font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
                .btn { display: inline-block; margin-top: 20px; padding: 12px 28px;
                       background: linear-gradient(135deg, #6366F1, #8B5CF6);
                       color: white; border-radius: 10px; text-decoration: none;
                       font-weight: 600; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>⚡ HireAI</h1>
                  <p>AI-Powered Recruitment Platform</p>
                </div>
                <div class="body">
                  <div class="title">%s</div>
                  <div class="message">%s</div>
                  <a href="http://localhost:3000" class="btn">Open HireAI →</a>
                </div>
                <div class="footer">
                  © 2025 HireAI · You're receiving this because you have an account on HireAI.
                </div>
              </div>
            </body>
            </html>
            """.formatted(title, body);
    }
}
