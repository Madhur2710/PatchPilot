package com.patchpilot.backend.github.dto.commit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GitHubCommitResponse {

    private String sha;

    private GitHubCommitDetailsResponse commit;

}