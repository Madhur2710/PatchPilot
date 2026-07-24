package com.patchpilot.backend.ai.prompt;

import com.patchpilot.backend.common.exception.InternalServerException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class ResourcePromptLoader implements PromptLoader {

    @Override
    public String load(String promptName) {

        try {

            ClassPathResource resource = new ClassPathResource("prompts/" + promptName);

            return new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

        } catch (IOException e) {
            throw new InternalServerException("Failed to Parse AI response",e);
        }
    }
}