package com.patchpilot.backend.github.credential;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface GitHubAccessTokenRepository extends MongoRepository<GitHubAccessToken, String> {

    Optional<GitHubAccessToken> findByGithubId(Long githubId);

}