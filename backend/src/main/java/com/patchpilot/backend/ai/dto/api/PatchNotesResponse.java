package com.patchpilot.backend.ai.dto.api;

import lombok.Data;

import java.util.List;

@Data
public class PatchNotesResponse {

    private String title;

    private String summary;

    private List<ReleaseItemResponse> features;

    private List<ReleaseItemResponse> bugFixes;

    private List<ReleaseItemResponse> breakingChanges;

    private List<ReleaseItemResponse> performanceImprovements;

    private List<ReleaseItemResponse> refactorings;

    private List<ReleaseItemResponse> additionalNotes;

}