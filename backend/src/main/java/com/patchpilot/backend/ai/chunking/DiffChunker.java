package com.patchpilot.backend.ai.chunking;

import com.patchpilot.backend.ai.dto.prompt.DiffChunk;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DiffChunker {

    private static final Pattern HUNK_HEADER =
            Pattern.compile("@@ -\\d+(?:,\\d+)? \\+(\\d+)(?:,(\\d+))? @@");

    public List<DiffChunk> chunkify(String fileName, String patch) {

        List<DiffChunk> chunks = new ArrayList<>();

        if (patch == null || patch.isBlank()) {
            return chunks;
        }

        String[] lines = patch.split("\n");

        StringBuilder currentPatch = null;
        int startLine = 0;
        int endLine = 0;

        for (String line : lines) {

            if (line.startsWith("@@")) {

                if (currentPatch != null) {
                    DiffChunk chunk = new DiffChunk();
                    chunk.setFile(fileName);
                    chunk.setStartLine(startLine);
                    chunk.setEndLine(endLine);
                    chunk.setPatch(currentPatch.toString());

                    chunks.add(chunk);
                }

                Matcher matcher = HUNK_HEADER.matcher(line);

                if (!matcher.find()) {
                    currentPatch = null;
                    continue;
                }

                startLine = Integer.parseInt(matcher.group(1));

                int length = matcher.group(2) == null
                        ? 1
                        : Integer.parseInt(matcher.group(2));

                endLine = startLine + Math.max(length - 1, 0);

                currentPatch = new StringBuilder();
            }

            if (currentPatch != null) {
                currentPatch.append(line).append("\n");
            }
        }

        if (currentPatch != null) {
            DiffChunk chunk = new DiffChunk();
            chunk.setFile(fileName);
            chunk.setStartLine(startLine);
            chunk.setEndLine(endLine);
            chunk.setPatch(currentPatch.toString());

            chunks.add(chunk);
        }

        return chunks;
    }
}