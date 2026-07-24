package com.patchpilot.backend.ai.dto.prompt;

import lombok.Data;

@Data
public class Prompt {

    private String systemPrompt;

    private String userPrompt;

}