package com.patchpilot.backend.patchnotes;

import com.patchpilot.backend.ai.dto.api.PatchNotesResponse;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Document(collection = "patch_notes")
public class PatchNotesDocument {

    @Id
    private String id;

    private String userId;

    private String repositoryId;

    private String repositoryName;

    private String baseCommit;

    private String headCommit;

    private PatchNotesResponse content;

    private Instant createdAt;

    private Instant updatedAt;

}