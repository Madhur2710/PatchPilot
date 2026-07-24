package com.patchpilot.backend.ai.mapper;

import com.patchpilot.backend.ai.dto.api.PatchNotesResponse;
import com.patchpilot.backend.ai.dto.api.ReleaseItemResponse;
import com.patchpilot.backend.ai.dto.prompt.DiffChunk;
import com.patchpilot.backend.ai.dto.response.PatchEvidence;
import com.patchpilot.backend.ai.dto.response.PatchNotes;
import com.patchpilot.backend.ai.dto.response.ReleaseItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Objects;

import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class ReleaseNotesMapper {

    @Autowired
    private PatchEvidenceMapper patchEvidenceMapper;

    public ReleaseItemResponse toResponse(
            ReleaseItem releaseItem,
            Map<Integer, DiffChunk> chunkIndex
    ) {

        ReleaseItemResponse response = new ReleaseItemResponse();

        response.setTitle(releaseItem.getTitle());
        response.setDescription(releaseItem.getDescription());

        List<Integer> chunkIds = releaseItem.getChunkIds();

        if (chunkIds == null) {
            chunkIds = List.of();
        }

        List<PatchEvidence> evidence = chunkIds.stream()
                .distinct()
                .map(id -> {
                    DiffChunk chunk = chunkIndex.get(id);

                    if (chunk == null) {
                        log.warn("LLM returned unknown chunkId {}", id);
                    }

                    return chunk;
                })
                .filter(Objects::nonNull)
                .map(patchEvidenceMapper::toPatchEvidence)
                .toList();

        response.setEvidence(evidence);

        return response;
    }

    private List<ReleaseItemResponse> mapReleaseItems(
            List<ReleaseItem> items,
            Map<Integer, DiffChunk> chunkIndex
    ) {

        if (items == null) {
            return List.of();
        }

        return items.stream()
                .filter(Objects::nonNull)
                .map(item -> toResponse(item, chunkIndex))
                .toList();
    }

    public PatchNotesResponse toResponse(
            PatchNotes patchNotes,
            Map<Integer, DiffChunk> chunkIndex
    ) {

        PatchNotesResponse response = new PatchNotesResponse();

        response.setTitle(patchNotes.getTitle());
        response.setSummary(patchNotes.getSummary());

        response.setFeatures(
                mapReleaseItems(
                        patchNotes.getFeatures(),
                        chunkIndex
                )
        );

        response.setBugFixes(
                mapReleaseItems(
                        patchNotes.getBugFixes(),
                        chunkIndex
                )
        );

        response.setBreakingChanges(
                mapReleaseItems(
                        patchNotes.getBreakingChanges(),
                        chunkIndex
                )
        );

        response.setPerformanceImprovements(
                mapReleaseItems(
                        patchNotes.getPerformanceImprovements(),
                        chunkIndex
                )
        );

        response.setRefactorings(
                mapReleaseItems(
                        patchNotes.getRefactorings(),
                        chunkIndex
                )
        );

        response.setAdditionalNotes(
                mapReleaseItems(
                        patchNotes.getAdditionalNotes(),
                        chunkIndex
                )
        );

        return response;
    }

}