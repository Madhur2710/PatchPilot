package com.patchpilot.backend.github.controller;

import com.patchpilot.backend.github.dto.branch.GitHubBranchResponse;
import com.patchpilot.backend.github.dto.commit.GitHubCommitResponse;
import com.patchpilot.backend.github.dto.compare.GitHubCompareResponse;
import com.patchpilot.backend.github.dto.repository.GitHubRepositoryResponse;
import com.patchpilot.backend.github.service.GitHubService;
import com.patchpilot.backend.repo.Repo;
import com.patchpilot.backend.repo.service.RepoService;
import com.patchpilot.backend.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/github")
public class GitHubController {

    @Autowired
    private GitHubService gitHubService;

    @Autowired
    private RepoService repoService;

    @GetMapping("/repositories")
    public List<GitHubRepositoryResponse> getRepositories(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return gitHubService.getRepositories(user);
    }

    @GetMapping("/repositories/{repositoryId}/branches")
    public List<GitHubBranchResponse> getBranches(
            Authentication authentication,
            @PathVariable String repositoryId
    ) {

        User user = (User) authentication.getPrincipal();

        Repo repo = repoService.getRepo(
                user,
                repositoryId
        );

        return gitHubService.getBranches(
                user,
                repo
        );
    }

    @GetMapping("/repositories/{repositoryId}/branches/{branch}/commits")
    public List<GitHubCommitResponse> getCommits(
            Authentication authentication,
            @PathVariable String repositoryId,
            @PathVariable String branch
    ) {

        User user = (User) authentication.getPrincipal();

        Repo repo = repoService.getRepo(user, repositoryId);

        return gitHubService.getCommits(user, repo, branch);
    }

    @GetMapping("/repositories/{repositoryId}/compare")
    public GitHubCompareResponse compare(
            Authentication authentication,
            @PathVariable String repositoryId,
            @RequestParam String base,
            @RequestParam String head
    ) {

        User user = (User) authentication.getPrincipal();

        Repo repo = repoService.getRepo(
                user,
                repositoryId
        );

        return gitHubService.compare(
                user,
                repo,
                base,
                head
        );
    }
}