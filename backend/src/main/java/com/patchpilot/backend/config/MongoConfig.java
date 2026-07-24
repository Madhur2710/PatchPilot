package com.patchpilot.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing // Spring automatically updates createdAt and updatedAt
public class MongoConfig {
}