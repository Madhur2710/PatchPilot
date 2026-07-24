package com.patchpilot.backend.ai.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class PatchNotes {

    private String title;

    private String summary;

    private List<ReleaseItem> features;

    private List<ReleaseItem> bugFixes;

    private List<ReleaseItem> performanceImprovements;

    private List<ReleaseItem> refactorings;

    private List<ReleaseItem> breakingChanges;

    private List<ReleaseItem> additionalNotes;
}