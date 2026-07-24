package com.patchpilot.backend.user;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByGithubId(Long githubId);

    Optional<User> findByUsername(String username);

}