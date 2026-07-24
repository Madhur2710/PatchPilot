package com.patchpilot.backend.ai.prompt;

import com.patchpilot.backend.ai.dto.prompt.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ReleaseNotesPromptBuilder implements PromptBuilder {

    private static final String NEW_LINE = "\n";
    private static final String DOUBLE_NEW_LINE = "\n\n";
    private static final String SECTION_SEPARATOR = "=======================================";

    @Autowired
    private PromptLoader promptLoader;

    @Override
    public Prompt buildPrompt(GitDiff gitDiff) {

        Prompt prompt = new Prompt();
        String systemPrompt = promptLoader.load("release-notes-system.txt");

        prompt.setSystemPrompt(systemPrompt);
        prompt.setUserPrompt(buildUserPrompt(gitDiff));

//        System.out.println(prompt.getSystemPrompt());
//        System.out.println(prompt.getUserPrompt());

        return prompt;
    }

    private String buildUserPrompt(GitDiff gitDiff) {

        StringBuilder builder = new StringBuilder();

        appendRepositoryInfo(builder, gitDiff);

        appendComparisonInfo(builder, gitDiff);

        appendCommitMessages(builder, gitDiff);

        appendChangedFiles(builder, gitDiff);

        return builder.toString();
    }

    private void appendRepositoryInfo(
            StringBuilder builder,
            GitDiff gitDiff
    ) {

        builder.append("Repository: ")
                .append(gitDiff.getRepo().getFullName())
                .append(DOUBLE_NEW_LINE);

    }

    private void appendCommitMessages(
            StringBuilder builder,
            GitDiff gitDiff
    ) {

        builder.append("### Commits")
                .append(DOUBLE_NEW_LINE);

        int index = 1;

        for (GitDiffCommit commit : gitDiff.getCommits()) {

            builder.append("Commit ")
                    .append(index++)
                    .append(DOUBLE_NEW_LINE);

            builder.append("SHA:")
                    .append(NEW_LINE)
                    .append(commit.getSha())
                    .append(DOUBLE_NEW_LINE);

            builder.append("Message:")
                    .append(NEW_LINE)
                    .append(commit.getMessage())
                    .append(DOUBLE_NEW_LINE);

            builder.append(SECTION_SEPARATOR)
                    .append(DOUBLE_NEW_LINE);
        }
    }

    private void appendComparisonInfo(
            StringBuilder builder,
            GitDiff gitDiff
    ) {

        builder.append("Comparison Status: ")
                .append(gitDiff.getCompareStatus())
                .append(NEW_LINE);

        builder.append("Total Commits: ")
                .append(gitDiff.getTotalCommits())
                .append(NEW_LINE);

        builder.append("Ahead By: ")
                .append(gitDiff.getAheadBy())
                .append(NEW_LINE);

        builder.append("Behind By: ")
                .append(gitDiff.getBehindBy())
                .append(NEW_LINE);

        builder.append("Base Commit: ")
                .append(gitDiff.getBaseCommit())
                .append(NEW_LINE);

        builder.append("Head Commit: ")
                .append(gitDiff.getHeadCommit())
                .append(DOUBLE_NEW_LINE);

    }

    private void appendChangedFiles(
            StringBuilder builder,
            GitDiff gitDiff
    ) {

        builder.append("### Changed Files")
                .append(DOUBLE_NEW_LINE);

        int index = 1;

        for (GitDiffFile file : gitDiff.getFiles()) {

            builder.append("File ")
                    .append(index++)
                    .append(DOUBLE_NEW_LINE);

            builder.append("Status:")
                    .append(NEW_LINE)
                    .append(file.getStatus())
                    .append(DOUBLE_NEW_LINE);

            builder.append("Filename:")
                    .append(NEW_LINE)
                    .append(file.getFilename())
                    .append(DOUBLE_NEW_LINE);

            builder.append("Additions:")
                    .append(NEW_LINE)
                    .append(file.getAdditions())
                    .append(NEW_LINE);

            builder.append("Deletions:")
                    .append(NEW_LINE)
                    .append(file.getDeletions())
                    .append(NEW_LINE);

            builder.append("Total Changes:")
                    .append(NEW_LINE)
                    .append(file.getChanges())
                    .append(DOUBLE_NEW_LINE);

            builder.append("Total Chunks:")
                    .append(NEW_LINE)
                    .append(file.getChunks().size())
                    .append(DOUBLE_NEW_LINE);

            builder.append("Chunks:")
                    .append(DOUBLE_NEW_LINE);

            for (DiffChunk chunk : file.getChunks()) {

                builder.append("Chunk #")
                        .append(chunk.getId())
                        .append(NEW_LINE);

                builder.append("Lines:")
                        .append(NEW_LINE)
                        .append(chunk.getStartLine())
                        .append("-")
                        .append(chunk.getEndLine())
                        .append(DOUBLE_NEW_LINE);

                builder.append(chunk.getPatch())
                        .append(DOUBLE_NEW_LINE);

                builder.append("---------------------------------------")
                        .append(DOUBLE_NEW_LINE);
            }

            builder.append(SECTION_SEPARATOR)
                    .append(DOUBLE_NEW_LINE);

        }

    }




}