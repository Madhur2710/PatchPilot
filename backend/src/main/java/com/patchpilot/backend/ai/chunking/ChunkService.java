package com.patchpilot.backend.ai.chunking;

import com.patchpilot.backend.ai.dto.prompt.ChunkingResult;
import com.patchpilot.backend.ai.dto.prompt.DiffChunk;
import com.patchpilot.backend.ai.dto.prompt.GitDiffFile;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChunkService {

    private final DiffChunker diffChunker = new DiffChunker();

    public ChunkingResult chunkFiles(List<GitDiffFile> files) {

        Map<Integer, DiffChunk> chunkIndex = new LinkedHashMap<>();

        int nextId = 1;

        for (GitDiffFile file : files) {

            List<DiffChunk> chunks = diffChunker.chunkify(
                    file.getFilename(),
                    file.getPatch()
            );

            for (DiffChunk chunk : chunks) {
                chunk.setId(nextId++);
                chunkIndex.put(chunk.getId(), chunk);
            }

            file.setChunks(chunks);
            file.setPatch(null);
        }

        ChunkingResult result = new ChunkingResult();
        result.setFiles(files);
        result.setChunkIndex(chunkIndex);

        return result;
    }

}