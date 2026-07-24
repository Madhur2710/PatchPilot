package com.patchpilot.backend.repo.service;

import com.patchpilot.backend.repo.Repo;
import com.patchpilot.backend.repo.dto.ConnectRepoRequest;
import com.patchpilot.backend.repo.dto.RepoResponse;
import com.patchpilot.backend.user.User;

import java.util.List;

public interface RepoService {

    List<RepoResponse> connectRepositories(User user, List<ConnectRepoRequest> requests);

    List<RepoResponse> getRepositories(User user);

    void disconnectRepository(User user, String repoId);

    Repo getRepo(User user, String repositoryId);
}