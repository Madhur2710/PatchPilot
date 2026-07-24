package com.patchpilot.backend.github.dto.branch;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class GitHubBranchResponse {

    private String name;

    @JsonProperty("protected")
    private boolean isProtected;

    private GitHubCommitReferenceResponse commit;

}