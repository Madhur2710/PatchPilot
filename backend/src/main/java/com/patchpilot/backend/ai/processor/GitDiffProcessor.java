package com.patchpilot.backend.ai.processor;

import com.patchpilot.backend.ai.dto.prompt.GitDiff;

public interface GitDiffProcessor {

    GitDiff process(GitDiff gitDiff);

}