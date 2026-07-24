package com.patchpilot.backend.ai.dto.api;

import com.patchpilot.backend.ai.dto.response.PatchEvidence;
import lombok.Data;

import java.util.List;

@Data
public class ReleaseItemResponse {

    private String title;

    private String description;

    private List<PatchEvidence> evidence;

}