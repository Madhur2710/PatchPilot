package com.patchpilot.backend.ai.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ReleaseItem {

    private String title;

    private String description;

    private List<Integer> chunkIds;
}