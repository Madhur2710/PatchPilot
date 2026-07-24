package com.patchpilot.backend.patchnotes;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PatchNotesRepository
        extends MongoRepository<PatchNotesDocument, String> {

    List<PatchNotesDocument> findByUserIdOrderByCreatedAtDesc(
            String userId
    );

    Optional<PatchNotesDocument> findByIdAndUserId(
            String id,
            String userId
    );

}