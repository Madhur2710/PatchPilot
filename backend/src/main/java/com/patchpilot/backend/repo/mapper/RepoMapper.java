package com.patchpilot.backend.repo.mapper;

import com.patchpilot.backend.github.dto.repository.GitHubRepositoryResponse;
import com.patchpilot.backend.repo.Repo;
import com.patchpilot.backend.repo.dto.RepoResponse;
import com.patchpilot.backend.user.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RepoMapper {

    public Repo toEntity(
            User user,
            GitHubRepositoryResponse githubRepository
    ) {

        return Repo.builder()
                .userId(user.getId())
                .githubRepositoryId(githubRepository.getId())
                .name(githubRepository.getName())
                .fullName(githubRepository.getFullName())
                .owner(githubRepository.getOwner().getLogin())
                .ownerAvatarUrl(githubRepository.getOwner().getAvatarUrl())
                .isPrivate(githubRepository.isPrivate())
                .build();
    }

    public RepoResponse toResponse(Repo repo) {

        return RepoResponse.builder()
                .id(repo.getId())
                .githubRepositoryId(repo.getGithubRepositoryId())
                .name(repo.getName())
                .fullName(repo.getFullName())
                .owner(repo.getOwner())
                .ownerAvatarUrl(repo.getOwnerAvatarUrl())
                .isPrivate(repo.isPrivate())
                .build();
    }

    public List<RepoResponse> toResponseList(List<Repo> repos) {

        return repos.stream()
                .map(this::toResponse)
                .toList();
    }
}