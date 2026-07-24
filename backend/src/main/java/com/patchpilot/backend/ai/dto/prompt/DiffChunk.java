package com.patchpilot.backend.ai.dto.prompt;

import lombok.Data;

@Data
public class DiffChunk {

    private Integer id;

    private String file;

    private Integer startLine;

    private Integer endLine;

    private String patch;

}