package com.patchpilot.backend.repo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConnectRepoRequest {

    @NotNull
    private Long githubRepositoryId;
}