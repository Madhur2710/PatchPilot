package com.patchpilot.backend.user;

public interface UserService {

    User findOrCreateGithubUser(
            Long githubId,
            String username,
            String email,
            String avatarUrl
    );

}