package com.patchpilot.backend.github.client;

import com.patchpilot.backend.github.dto.branch.GitHubBranchResponse;
import com.patchpilot.backend.github.dto.commit.GitHubCommitResponse;
import com.patchpilot.backend.github.dto.compare.GitHubCompareResponse;
import com.patchpilot.backend.github.dto.repository.GitHubRepositoryResponse;
import com.patchpilot.backend.repo.Repo;

import java.util.List;

public interface GitHubApiClient {

    List<GitHubRepositoryResponse> getRepositories(String accessToken);

    GitHubRepositoryResponse getRepository(
            String accessToken,
            Long githubRepositoryId
    );

    List<GitHubBranchResponse> getBranches(
            String accessToken,
            Repo repo
    );

    List<GitHubCommitResponse> getCommits(
            String accessToken,
            Repo repo,
            String branch
    );

    GitHubCompareResponse compare(
            String accessToken,
            Repo repo,
            String base,
            String head
    );

}