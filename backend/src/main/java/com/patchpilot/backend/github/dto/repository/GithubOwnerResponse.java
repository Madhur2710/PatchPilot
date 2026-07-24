package com.patchpilot.backend.github.dto.repository;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubOwnerResponse {

    private String login;

    @JsonProperty("avatar_url")
    private String avatarUrl;
}