package com.patchpilot.backend.ai.dto.response;

import lombok.Data;

@Data
public class PatchEvidence {

    private String file;

    private String changeType;

    private Integer startLine;

    private Integer endLine;

    private String patch;
}