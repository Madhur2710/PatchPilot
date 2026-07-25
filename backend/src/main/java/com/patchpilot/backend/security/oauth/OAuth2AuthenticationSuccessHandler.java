package com.patchpilot.backend.security.oauth;

import com.patchpilot.backend.auth.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private LoginService loginService;

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;


    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        OAuth2AuthorizedClient client =
                authorizedClientService.loadAuthorizedClient(
                        "github", // whatever u specified in yaml
                        authentication.getName()
                );

        String accessToken = client.getAccessToken().getTokenValue();

        String jwt = loginService.loginWithGithub(oauth2User, accessToken);

        log.info("Generated JWT: {}", jwt);

        response.sendRedirect(
                "http://localhost:5173/oauth/success?token=" + jwt
        );
    }
}