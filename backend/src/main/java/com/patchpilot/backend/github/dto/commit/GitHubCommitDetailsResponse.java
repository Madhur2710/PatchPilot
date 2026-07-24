package com.patchpilot.backend.github.dto.commit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GitHubCommitDetailsResponse {

    private String message;

    private GitHubCommitAuthorResponse author;

}