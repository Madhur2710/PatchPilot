package com.patchpilot.backend.repo.exception;

import com.patchpilot.backend.common.exception.ResourceNotFoundException;

public class RepoNotFoundException extends ResourceNotFoundException {

    public RepoNotFoundException(String repoId) {
        super("Repository with id '" + repoId + "' not found.");
    }
}