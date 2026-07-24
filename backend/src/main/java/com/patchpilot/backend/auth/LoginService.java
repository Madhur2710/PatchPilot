package com.patchpilot.backend.auth;

import org.springframework.security.oauth2.core.user.OAuth2User;

public interface LoginService {

    String loginWithGithub(OAuth2User oauth2User, String githubAccessToken);

}