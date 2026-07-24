package com.patchpilot.backend.github.service;

import com.patchpilot.backend.github.dto.branch.GitHubBranchResponse;
import com.patchpilot.backend.github.dto.commit.GitHubCommitResponse;
import com.patchpilot.backend.github.dto.compare.GitHubCompareResponse;
import com.patchpilot.backend.github.dto.repository.GitHubRepositoryResponse;
import com.patchpilot.backend.repo.Repo;
import com.patchpilot.backend.user.User;

import java.util.List;

public interface GitHubService {

    List<GitHubRepositoryResponse> getRepositories(User user);

    GitHubRepositoryResponse getRepository(User user, Long githubRepositoryId);

    List<GitHubBranchResponse> getBranches(User user, Repo repo);

    List<GitHubCommitResponse> getCommits(User user, Repo repo, String branch);

    GitHubCompareResponse compare(User user, Repo repo, String base, String head);

}