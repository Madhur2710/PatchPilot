package com.patchpilot.backend.ai.mapper;

import com.patchpilot.backend.ai.dto.prompt.DiffChunk;
import com.patchpilot.backend.ai.dto.response.PatchEvidence;
import org.springframework.stereotype.Component;

@Component
public class PatchEvidenceMapper {

    public PatchEvidence toPatchEvidence(DiffChunk chunk) {
        if(chunk == null) return null;

        PatchEvidence evidence = new PatchEvidence();

        evidence.setFile(chunk.getFile());
        evidence.setStartLine(chunk.getStartLine());
        evidence.setEndLine(chunk.getEndLine());
        evidence.setPatch(chunk.getPatch());

        return evidence;
    }

}