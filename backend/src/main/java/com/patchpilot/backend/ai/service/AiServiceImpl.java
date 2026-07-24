package com.patchpilot.backend.ai.service;

import com.patchpilot.backend.ai.dto.api.PatchNotesResponse;
import com.patchpilot.backend.ai.dto.prompt.GitDiff;
import com.patchpilot.backend.ai.dto.response.PatchNotes;
import com.patchpilot.backend.ai.dto.prompt.Prompt;
import com.patchpilot.backend.ai.mapper.GitDiffMapper;
import com.patchpilot.backend.ai.mapper.ReleaseNotesMapper;
import com.patchpilot.backend.ai.processor.GitDiffProcessor;
import com.patchpilot.backend.ai.prompt.PromptBuilder;
import com.patchpilot.backend.ai.provider.AIProvider;
import com.patchpilot.backend.github.dto.compare.GitHubCompareResponse;
import com.patchpilot.backend.github.service.GitHubService;
import com.patchpilot.backend.patchnotes.service.PatchNotesService;
import com.patchpilot.backend.repo.Repo;
import com.patchpilot.backend.repo.service.RepoService;
import com.patchpilot.backend.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AiServiceImpl implements AiService {

    @Autowired
    private GitHubService gitHubService;

    @Autowired
    private GitDiffMapper gitDiffMapper;

    @Autowired
    private GitDiffProcessor gitDiffProcessor;

    @Autowired
    private PromptBuilder promptBuilder;

    @Autowired
    private RepoService repoService;

    @Autowired
    private AIProvider aiProvider;

    @Autowired
    private ReleaseNotesMapper releaseNotesMapper;

    @Autowired
    private PatchNotesService patchNotesService;

    @Override
    public PatchNotesResponse generatePatchNotes(
            User user,
            String repositoryId,
            String base,
            String head
    ) {

        Repo repo = repoService.getRepo(user, repositoryId);

        GitHubCompareResponse compareResponse =
                gitHubService.compare(
                        user,
                        repo,
                        base,
                        head
                );

        GitDiff gitDiff =
                gitDiffMapper.toGitDiff(
                        repo,
                        base,
                        head,
                        compareResponse
                );

        gitDiff = gitDiffProcessor.process(gitDiff);
        Prompt prompt = promptBuilder.buildPrompt(gitDiff);
//        System.out.println("========== USER PROMPT ==========");
//        System.out.println(prompt);
//
        PatchNotes aiResponse = aiProvider.generateReleaseNotes(prompt);
//        System.out.println("========== AI RESPONSE ==========");
//        System.out.println(aiResponse);
        PatchNotesResponse aiResponseWLineNos = releaseNotesMapper.toResponse(
                aiResponse,
                gitDiff.getChunkIndex());

        patchNotesService.save(
                user,
                repo,
                base,
                head,
                aiResponseWLineNos
        );

        return aiResponseWLineNos;
    }
}
