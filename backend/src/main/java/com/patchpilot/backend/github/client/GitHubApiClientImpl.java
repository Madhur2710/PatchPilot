package com.patchpilot.backend.github.client;

import com.patchpilot.backend.github.dto.branch.GitHubBranchResponse;
import com.patchpilot.backend.github.dto.commit.GitHubCommitResponse;
import com.patchpilot.backend.github.dto.compare.GitHubCompareResponse;
import com.patchpilot.backend.github.dto.repository.GitHubRepositoryResponse;
import com.patchpilot.backend.repo.Repo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Slf4j
@Component
public class GitHubApiClientImpl implements GitHubApiClient {

    @Autowired
    private RestClient restClient;

    @Override
    public List<GitHubRepositoryResponse> getRepositories(String accessToken) {

        log.info("Fetching repositories from GitHub");

        return restClient.get()
                .uri("/user/repos")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    @Override
    public GitHubRepositoryResponse getRepository(String accessToken, Long githubRepositoryId) {

        log.info("Fetching GitHub repository with ID: {}", githubRepositoryId);

        return restClient.get()
                .uri("/repositories/{repositoryId}", githubRepositoryId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(GitHubRepositoryResponse.class);
    }

    @Override
    public List<GitHubBranchResponse> getBranches(String accessToken, Repo repo ){

        log.info(
                "Fetching branches for repository {}",
                repo.getFullName()
        );

        return restClient.get()
                .uri(
                        "/repos/{owner}/{repo}/branches",
                        repo.getOwner(),
                        repo.getName()
                )
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    @Override
    public List<GitHubCommitResponse> getCommits(
            String accessToken,
            Repo repo,
            String branch
    ) {

        log.info(
                "Fetching commits for repository {} on branch {}",
                repo.getFullName(),
                branch
        );

        return restClient.get()
                .uri(
                        "/repos/{owner}/{repo}/commits?sha={branch}",
                        repo.getOwner(),
                        repo.getName(),
                        branch
                )
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    @Override
    public GitHubCompareResponse compare(
            String accessToken,
            Repo repo,
            String base,
            String head
    ) {

        log.info(
                "Comparing commits {} -> {} for repository {}",
                base,
                head,
                repo.getFullName()
        );

        return restClient.get()
                .uri(
                        "/repos/{owner}/{repo}/compare/{base}...{head}",
                        repo.getOwner(),
                        repo.getName(),
                        base,
                        head
                )
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(GitHubCompareResponse.class);
    }


}