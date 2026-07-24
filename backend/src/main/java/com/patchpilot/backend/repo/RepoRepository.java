package com.patchpilot.backend.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RepoRepository extends MongoRepository<Repo, String> {

    Optional<Repo> findByUserIdAndGithubRepositoryId(
            String userId,
            Long githubRepositoryId
    );

    List<Repo> findByUserId(String userId);

    Optional<Repo> findByIdAndUserId(
            String id,
            String userId
    );
}