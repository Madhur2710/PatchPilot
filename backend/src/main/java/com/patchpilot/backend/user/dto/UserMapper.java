package com.patchpilot.backend.user.dto;

import com.patchpilot.backend.user.User;

public final class UserMapper {

    public static UserResponse toResponse(User user) {

        return UserResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}