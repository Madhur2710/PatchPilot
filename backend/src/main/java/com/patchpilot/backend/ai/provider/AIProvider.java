package com.patchpilot.backend.ai.provider;

import com.patchpilot.backend.ai.dto.response.PatchNotes;
import com.patchpilot.backend.ai.dto.prompt.Prompt;

public interface AIProvider {

    PatchNotes generateReleaseNotes(Prompt prompt);

}