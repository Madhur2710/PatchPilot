package com.patchpilot.backend.ai.processor;

import com.patchpilot.backend.ai.chunking.ChunkService;
import com.patchpilot.backend.ai.dto.prompt.ChunkingResult;
import com.patchpilot.backend.ai.dto.prompt.GitDiff;
import com.patchpilot.backend.ai.dto.prompt.GitDiffFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GitDiffProcessorImpl implements GitDiffProcessor {

    @Autowired
    private ChunkService chunkService;

    @Override
    public GitDiff process(GitDiff gitDiff) {

        List<GitDiffFile> processedFiles = gitDiff.getFiles()
                .stream()
                .filter(this::shouldInclude)
                .toList();

        ChunkingResult chunkingResult = chunkService.chunkFiles(processedFiles);

        gitDiff.setFiles(chunkingResult.getFiles());
        gitDiff.setChunkIndex(chunkingResult.getChunkIndex());
        gitDiff.setFiles(processedFiles);

        return gitDiff;
    }

    private boolean shouldInclude(GitDiffFile file) {

        if (file.getPatch() == null || file.getPatch().isBlank()) {
            return false;
        }

        String filename = file.getFilename();

        if (filename.equals("package-lock.json")
                || filename.equals("yarn.lock")
                || filename.equals("pnpm-lock.yaml")
                || filename.equals("bun.lockb")) {
            return false;
        }


        return true;
    }
}