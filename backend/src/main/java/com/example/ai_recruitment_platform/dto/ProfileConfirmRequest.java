// src/main/java/com/example/ai_recruitment_platform/dto/ProfileConfirmRequest.java
package com.example.ai_recruitment_platform.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class ProfileConfirmRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    private String email;

    private String experience;
    private String education;
    private List<String> skills;

    // ✅ FIX: ye fields add karo — ProfileService mein getHeadline()/getLocation() call hota hai
    private String headline;
    private String location;
}