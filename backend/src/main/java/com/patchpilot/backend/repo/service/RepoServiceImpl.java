package com.patchpilot.backend.repo.service;

import com.patchpilot.backend.github.dto.repository.GitHubRepositoryResponse;
import com.patchpilot.backend.github.service.GitHubService;
import com.patchpilot.backend.repo.Repo;
import com.patchpilot.backend.repo.RepoRepository;
import com.patchpilot.backend.repo.dto.ConnectRepoRequest;
import com.patchpilot.backend.repo.dto.RepoResponse;
import com.patchpilot.backend.repo.exception.RepoNotFoundException;
import com.patchpilot.backend.repo.mapper.RepoMapper;
import com.patchpilot.backend.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class RepoServiceImpl implements RepoService {

    @Autowired
    private RepoRepository repoRepository;

    @Autowired
    private RepoMapper repoMapper;

    @Autowired
    private GitHubService gitHubService;

    @Override
    public List<RepoResponse> connectRepositories(User user, List<ConnectRepoRequest> requests) {

        if (requests.isEmpty()) {
            throw new IllegalArgumentException(
                    "At least one repository must be selected."
            );
        }

        List<Repo> repos = new ArrayList<>();

        for (ConnectRepoRequest request : requests) {

            GitHubRepositoryResponse githubRepository = gitHubService.getRepository(user, request.getGithubRepositoryId());

            boolean alreadyConnected = repoRepository.findByUserIdAndGithubRepositoryId(user.getId(), githubRepository.getId()).isPresent();

            if (alreadyConnected) {
                continue;
            }

            Repo repo = repoMapper.toEntity(user, githubRepository);

            repos.add(repo);
        }

        if (!repos.isEmpty()) {
            repoRepository.saveAll(repos);
        }

        return repoMapper.toResponseList(repos);
    }

    @Override
    public List<RepoResponse> getRepositories(User user) {

        List<Repo> repos = repoRepository.findByUserId(user.getId());

        return repoMapper.toResponseList(repos);
    }

    @Override
    public void disconnectRepository(User user, String repoId) {
        Repo repo = repoRepository
                .findByIdAndUserId(repoId, user.getId())
                .orElseThrow(() -> new RepoNotFoundException(repoId));

        repoRepository.delete(repo);
    }

    @Override
    public Repo getRepo(User user, String repoId) {

        return repoRepository.findByIdAndUserId(repoId, user.getId())
                .orElseThrow(() -> new RepoNotFoundException(repoId));
    }

}