package com.patchpilot.backend.github.dto.compare;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class GitHubCompareResponse {

    private String status;

    @JsonProperty("ahead_by")
    private Integer aheadBy;

    @JsonProperty("behind_by")
    private Integer behindBy;

    @JsonProperty("total_commits")
    private Integer totalCommits;

    private List<GitHubCompareCommitResponse> commits;

    private List<GitHubCompareFileResponse> files;
}