package com.patchpilot.backend.common;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    @GetMapping("/api/v1/health")
    public ApiResponse<Map<String, String>> health(HttpServletRequest request) {

        logger.info("Health check requested.");

        return ApiResponse.<Map<String, String>>builder()
                .success(true)
                .message("PatchPilot backend is running.")
                .data(Map.of("status", "UP"))
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
    }
}