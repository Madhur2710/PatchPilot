package com.patchpilot.backend.github.dto.compare;

import lombok.Data;

@Data
public class GitHubCompareFileResponse {

    private String filename;

    private String status;

    private Integer additions;

    private Integer deletions;

    private Integer changes;

    private String patch;
}