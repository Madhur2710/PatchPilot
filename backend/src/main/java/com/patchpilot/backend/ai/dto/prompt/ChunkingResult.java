package com.patchpilot.backend.ai.dto.prompt;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ChunkingResult {

    private List<GitDiffFile> files;

    private Map<Integer, DiffChunk> chunkIndex;

}