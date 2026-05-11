package com.example.ai_recruitment_platform.dto.request;

import com.example.ai_recruitment_platform.entity.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRoleRequest {
    @NotNull(message = "Role is required")
    private User.Role role;
}
