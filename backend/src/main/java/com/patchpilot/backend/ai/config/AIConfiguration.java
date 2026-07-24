package com.patchpilot.backend.ai.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfiguration {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder.build();
    }

    @Bean
    public com.fasterxml.jackson.databind.ObjectMapper objectMapper() { //ObjectMapperBug
        return new com.fasterxml.jackson.databind.ObjectMapper();
    }

}