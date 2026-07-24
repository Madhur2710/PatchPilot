package com.patchpilot.backend.ai.mapper;

import com.patchpilot.backend.ai.dto.prompt.GitDiff;
import com.patchpilot.backend.ai.dto.prompt.GitDiffCommit;
import com.patchpilot.backend.ai.dto.prompt.GitDiffFile;
import com.patchpilot.backend.github.dto.compare.GitHubCompareCommitResponse;
import com.patchpilot.backend.github.dto.compare.GitHubCompareFileResponse;
import com.patchpilot.backend.github.dto.compare.GitHubCompareResponse;
import com.patchpilot.backend.repo.Repo;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GitDiffMapper {

    public GitDiff toGitDiff(
            Repo repo,
            String base,
            String head,
            GitHubCompareResponse compareResponse
    ) {

        GitDiff gitDiff = new GitDiff();

        gitDiff.setRepo(repo);
        gitDiff.setBaseCommit(base);
        gitDiff.setHeadCommit(head);
        gitDiff.setCompareStatus(compareResponse.getStatus());
        gitDiff.setAheadBy(compareResponse.getAheadBy());
        gitDiff.setBehindBy(compareResponse.getBehindBy());
        gitDiff.setTotalCommits(compareResponse.getTotalCommits());

        List<GitDiffCommit> commits = compareResponse.getCommits()
                .stream()
                .map(this::toGitDiffCommit)
                .toList();

        gitDiff.setCommits(commits);


        List<GitDiffFile> files = compareResponse.getFiles()
                .stream()
                .map(this::toGitDiffFile)
                .toList();

        gitDiff.setFiles(files);

        return gitDiff;
    }

    private GitDiffFile toGitDiffFile(
            GitHubCompareFileResponse file
    ) {

        GitDiffFile gitDiffFile = new GitDiffFile();

        gitDiffFile.setFilename(file.getFilename());
        gitDiffFile.setPatch(file.getPatch());
        gitDiffFile.setAdditions(file.getAdditions());
        gitDiffFile.setDeletions(file.getDeletions());
        gitDiffFile.setChanges(file.getChanges());
        gitDiffFile.setStatus(file.getStatus());

        return gitDiffFile;
    }

    private GitDiffCommit toGitDiffCommit(
            GitHubCompareCommitResponse commit
    ) {

        GitDiffCommit gitDiffCommit = new GitDiffCommit();

        gitDiffCommit.setSha(commit.getSha());
        gitDiffCommit.setMessage(commit.getCommit().getMessage());

        return gitDiffCommit;
    }
}