package com.patchpilot.backend.github.dto.repository;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class GitHubRepositoryResponse {

    private Long id;

    private String name;

    @JsonProperty("full_name")
    private String fullName;

    private boolean isPrivate;

    private GithubOwnerResponse owner;
}