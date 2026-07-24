package com.patchpilot.backend.patchnotes.exception;

import com.patchpilot.backend.common.exception.ResourceNotFoundException;

public class PatchNotesNotFoundException extends ResourceNotFoundException {

    public PatchNotesNotFoundException(String patchNotesId) {
        super("Patch notes with id '" + patchNotesId + "' not found.");
    }
}