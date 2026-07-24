package com.patchpilot.backend.ai.service;

import com.patchpilot.backend.ai.dto.api.PatchNotesResponse;
import com.patchpilot.backend.user.User;

public interface AiService {

    PatchNotesResponse generatePatchNotes(
            User user,
            String repositoryId,
            String base,
            String head
    );

}