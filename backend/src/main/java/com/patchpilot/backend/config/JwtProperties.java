package com.patchpilot.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt") // use yaml props which fall under jwt:
public class JwtProperties {

    private String secret;

    private long expiration;
}