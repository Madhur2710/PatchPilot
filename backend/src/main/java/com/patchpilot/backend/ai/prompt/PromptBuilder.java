package com.patchpilot.backend.ai.prompt;

import com.patchpilot.backend.ai.dto.prompt.GitDiff;
import com.patchpilot.backend.ai.dto.prompt.Prompt;

public interface PromptBuilder {

    Prompt buildPrompt(GitDiff gitDiff);

}