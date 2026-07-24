package com.patchpilot.backend.github.credential;

public interface GitHubAccessTokenService {

    void saveOrUpdate(Long githubId, String accessToken);

    String getAccessToken(Long githubId);

}