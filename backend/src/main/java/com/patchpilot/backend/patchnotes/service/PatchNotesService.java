package com.patchpilot.backend.patchnotes.service;

import com.patchpilot.backend.ai.dto.api.PatchNotesResponse;
import com.patchpilot.backend.patchnotes.PatchNotesDocument;
import com.patchpilot.backend.repo.Repo;
import com.patchpilot.backend.user.User;

import java.util.List;

public interface PatchNotesService {

    PatchNotesDocument save(
            User user,
            Repo repo,
            String baseCommit,
            String headCommit,
            PatchNotesResponse response
    );

    PatchNotesDocument get(
            User user,
            String patchNotesId
    );

    List<PatchNotesDocument> getAll(User user);

    void delete(
            User user,
            String patchNotesId
    );

}