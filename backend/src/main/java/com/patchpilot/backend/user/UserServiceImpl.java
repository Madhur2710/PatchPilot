package com.patchpilot.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findOrCreateGithubUser(
            Long githubId,
            String username,
            String email,
            String avatarUrl
    ) {

        User user = userRepository.findByGithubId(githubId)
                .orElseGet(User::new);

        user.setGithubId(githubId);
        user.setUsername(username);
        user.setEmail(email);
        user.setAvatarUrl(avatarUrl);

        return userRepository.save(user);
    }
}