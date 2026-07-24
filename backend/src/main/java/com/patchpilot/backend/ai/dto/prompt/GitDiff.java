package com.patchpilot.backend.ai.dto.prompt;

import com.patchpilot.backend.repo.Repo;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class GitDiff {

    private Repo repo;

    private String baseCommit;

    private String headCommit;

    private String compareStatus;

    private Integer aheadBy;

    private Integer behindBy;

    private Integer totalCommits;

    private List<GitDiffCommit> commits;

    private List<GitDiffFile> files;

    private Map<Integer, DiffChunk> chunkIndex;



}