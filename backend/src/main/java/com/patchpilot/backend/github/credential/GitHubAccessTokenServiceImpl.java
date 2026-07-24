package com.patchpilot.backend.github.credential;

import com.patchpilot.backend.common.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class GitHubAccessTokenServiceImpl implements GitHubAccessTokenService {

    @Autowired
    private GitHubAccessTokenRepository repository;

    @Override
    public void saveOrUpdate(Long githubId, String accessToken) {

        GitHubAccessToken token = repository
                .findByGithubId(githubId)
                .orElseGet(GitHubAccessToken::new);

        token.setGithubId(githubId);
        token.setAccessToken(accessToken);

        repository.save(token);

        log.info("GitHub access token saved for user {}", githubId);
    }

    @Override
    public String getAccessToken(Long githubId) {

        return repository.findByGithubId(githubId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "GitHub access token not found."
                        ))
                .getAccessToken();
    }
}