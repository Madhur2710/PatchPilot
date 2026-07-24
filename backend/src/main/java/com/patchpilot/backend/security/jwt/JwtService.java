package com.patchpilot.backend.security.jwt;

import com.patchpilot.backend.user.User;

public interface JwtService {

    String generateToken(User user);

    Long extractGithubId(String token);

    boolean isTokenValid(String token);

}