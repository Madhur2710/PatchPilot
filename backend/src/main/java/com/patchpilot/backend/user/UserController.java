package com.patchpilot.backend.user;

import com.patchpilot.backend.user.dto.UserMapper;
import com.patchpilot.backend.user.dto.UserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return UserMapper.toResponse(user); // only return relevant details instead of entire user
    }
}