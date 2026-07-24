package com.patchpilot.backend.ai.controller;

import com.patchpilot.backend.ai.dto.api.PatchNotesResponse;
import com.patchpilot.backend.ai.service.AiService;
import com.patchpilot.backend.user.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
public class AIController {

    @Autowired
    private AiService patchNotesService;

    @GetMapping("/generate")
    public PatchNotesResponse getPrompt(
            @AuthenticationPrincipal User user,
            @RequestParam String repositoryId,
            @RequestParam String base,
            @RequestParam String head
    ) {

        return patchNotesService.generatePatchNotes(
                user,
                repositoryId,
                base,
                head
        );
    }
}