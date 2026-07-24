package com.patchpilot.backend.github.dto.commit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GitHubCommitAuthorResponse {

    private String name;

    private Instant date;

}