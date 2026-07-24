package com.patchpilot.backend.repo.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RepoResponse {

    private String id;

    private Long githubRepositoryId;

    private String name;

    private String fullName;

    private String owner;

    private String ownerAvatarUrl;

    private boolean isPrivate;
}