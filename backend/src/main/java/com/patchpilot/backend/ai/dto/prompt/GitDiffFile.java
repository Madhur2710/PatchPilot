package com.patchpilot.backend.ai.dto.prompt;

import lombok.Data;

import java.util.List;

@Data
public class GitDiffFile {

    private String filename;

    private String patch;

    private List<DiffChunk> chunks;

    private Integer additions;

    private Integer deletions;

    private Integer changes;

    private String status;

}