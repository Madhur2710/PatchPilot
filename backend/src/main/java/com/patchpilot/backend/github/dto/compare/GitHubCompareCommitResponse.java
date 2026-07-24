package com.patchpilot.backend.github.dto.compare;

import com.patchpilot.backend.github.dto.commit.GitHubCommitDetailsResponse;
import lombok.Data;

@Data
public class GitHubCompareCommitResponse {

    private String sha;

    private GitHubCommitDetailsResponse commit;
}