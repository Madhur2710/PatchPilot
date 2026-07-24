package com.patchpilot.backend.auth;

import com.patchpilot.backend.github.credential.GitHubAccessTokenService;
import com.patchpilot.backend.security.jwt.JwtService;
import com.patchpilot.backend.user.User;
import com.patchpilot.backend.user.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private GitHubAccessTokenService gitHubAccessTokenService;

    @Override
    public String loginWithGithub(OAuth2User oauth2User, String githubAccessToken) {

        Long githubId = ((Number) oauth2User.getAttribute("id")).longValue();
        String username = oauth2User.getAttribute("login");
        String email = oauth2User.getAttribute("email");
        String avatarUrl = oauth2User.getAttribute("avatar_url");

        // push to Mongo
        User user = userService.findOrCreateGithubUser(
                githubId,
                username,
                email,
                avatarUrl
        );

        gitHubAccessTokenService.saveOrUpdate(
                githubId,
                githubAccessToken
        );

        log.info("User {} authenticated successfully.", username);

        return jwtService.generateToken(user);
    }
}