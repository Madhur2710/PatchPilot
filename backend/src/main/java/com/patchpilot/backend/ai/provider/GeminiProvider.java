package com.patchpilot.backend.ai.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.patchpilot.backend.ai.dto.response.PatchNotes;
import com.patchpilot.backend.ai.dto.prompt.Prompt;
import com.patchpilot.backend.ai.exception.AiResponseParsingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class GeminiProvider implements AIProvider {

    @Autowired
    private ChatClient chatClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public PatchNotes generateReleaseNotes(Prompt prompt) {

        String response = chatClient.prompt()
                .system(prompt.getSystemPrompt())
                .user(prompt.getUserPrompt())
                .call()
                .content();

        response = cleanResponse(response);

        log.info("""

            ==================== Gemini Response ====================
            {}
            =========================================================

            """, response);

        try {
            return objectMapper.readValue(response, PatchNotes.class);
        } catch (JsonProcessingException e) {
            throw new AiResponseParsingException(e);
        }

    }

    private String cleanResponse(String response) {

        response = response.trim();

        if (response.startsWith("```json")) {
            response = response.substring(7);
        }

        if (response.endsWith("```")) {
            response = response.substring(0, response.length() - 3);
        }

        return response.trim();

    }

}