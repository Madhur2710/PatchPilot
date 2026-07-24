package com.patchpilot.backend.ai.dto.prompt;

import lombok.Data;

@Data
public class GitDiffCommit {

    private String sha;

    private String message;

}