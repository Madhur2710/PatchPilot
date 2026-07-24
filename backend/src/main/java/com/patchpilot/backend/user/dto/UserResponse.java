package com.patchpilot.backend.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private String username;

    private String email;

    private String avatarUrl;
}