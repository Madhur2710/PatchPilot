package com.patchpilot.backend.patchnotes.mapper;

import com.patchpilot.backend.ai.dto.api.PatchNotesResponse;
import com.patchpilot.backend.patchnotes.PatchNotesDocument;
import com.patchpilot.backend.repo.Repo;
import com.patchpilot.backend.user.User;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class PatchNotesMapper {

    public PatchNotesDocument toDocument(
            User user,
            Repo repo,
            String baseCommit,
            String headCommit,
            PatchNotesResponse response
    ) {

        PatchNotesDocument document = new PatchNotesDocument();

        document.setUserId(user.getId());

        document.setRepositoryId(repo.getId());

        document.setRepositoryName(repo.getName());

        document.setBaseCommit(baseCommit);

        document.setHeadCommit(headCommit);

        document.setContent(response);

        Instant now = Instant.now();

        document.setCreatedAt(now);

        document.setUpdatedAt(now);

        return document;
    }

}