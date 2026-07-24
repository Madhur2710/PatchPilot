package com.patchpilot.backend.github.service;

import com.patchpilot.backend.github.client.GitHubApiClient;
import com.patchpilot.backend.github.credential.GitHubAccessTokenService;
import com.patchpilot.backend.github.dto.branch.GitHubBranchResponse;
import com.patchpilot.backend.github.dto.commit.GitHubCommitResponse;
import com.patchpilot.backend.github.dto.compare.GitHubCompareResponse;
import com.patchpilot.backend.github.dto.repository.GitHubRepositoryResponse;
import com.patchpilot.backend.repo.Repo;
import com.patchpilot.backend.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class GitHubServiceImpl implements GitHubService {

    @Autowired
    private GitHubApiClient gitHubApiClient;

    @Autowired
    private GitHubAccessTokenService gitHubAccessTokenService;

    @Override
    public List<GitHubRepositoryResponse> getRepositories(User user){

        String accessToken = gitHubAccessTokenService.getAccessToken(user.getGithubId());

        return gitHubApiClient.getRepositories(accessToken);
    }

    @Override
    public GitHubRepositoryResponse getRepository(User user, Long githubRepositoryId){

        String accessToken = gitHubAccessTokenService.getAccessToken(user.getGithubId());

        return gitHubApiClient.getRepository(accessToken, githubRepositoryId);
    }

    @Override
    public List<GitHubBranchResponse> getBranches(User user, Repo repo) {

        String accessToken =
                gitHubAccessTokenService.getAccessToken(
                        user.getGithubId()
                );

        return gitHubApiClient.getBranches(
                accessToken,
                repo
        );
    }

    @Override
    public List<GitHubCommitResponse> getCommits(
            User user,
            Repo repo,
            String branch
    ) {

        String accessToken = gitHubAccessTokenService.getAccessToken(user.getGithubId());

        return gitHubApiClient.getCommits(
                accessToken,
                repo,
                branch
        );
    }

    @Override
    public GitHubCompareResponse compare(
            User user,
            Repo repo,
            String base,
            String head
    ) {

        String accessToken = gitHubAccessTokenService.getAccessToken(user.getGithubId());

        return gitHubApiClient.compare(
                accessToken,
                repo,
                base,
                head
        );
    }
}