package com.patchpilot.backend.repo.controller;

import com.patchpilot.backend.repo.dto.ConnectRepoRequest;
import com.patchpilot.backend.repo.dto.RepoResponse;
import com.patchpilot.backend.repo.service.RepoService;
import com.patchpilot.backend.user.User;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/repositories")
public class RepoController {

    @Autowired
    private RepoService repoService;

    @PostMapping
    public List<RepoResponse> connectRepositories(Authentication authentication, @Valid @RequestBody List<ConnectRepoRequest> requests) {

        User user = (User) authentication.getPrincipal();
        return repoService.connectRepositories(user, requests);
    }

    @GetMapping
    public List<RepoResponse> getRepositories(Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return repoService.getRepositories(user);
    }

    @DeleteMapping("/{repoId}") //the mongo id
    public void disconnectRepository(Authentication authentication, @PathVariable String repoId) {

        User user = (User) authentication.getPrincipal();
        repoService.disconnectRepository(user, repoId);
    }
}