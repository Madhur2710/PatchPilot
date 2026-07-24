package com.patchpilot.backend.patchnotes.service;

import com.patchpilot.backend.ai.dto.api.PatchNotesResponse;
import com.patchpilot.backend.patchnotes.PatchNotesDocument;
import com.patchpilot.backend.patchnotes.PatchNotesRepository;
import com.patchpilot.backend.patchnotes.exception.PatchNotesNotFoundException;
import com.patchpilot.backend.patchnotes.mapper.PatchNotesMapper;
import com.patchpilot.backend.repo.Repo;
import com.patchpilot.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatchNotesServiceImpl implements PatchNotesService {

    @Autowired
    private PatchNotesRepository patchNotesRepository;

    @Autowired
    private PatchNotesMapper patchNotesMapper;

    @Override
    public PatchNotesDocument save(
            User user,
            Repo repo,
            String baseCommit,
            String headCommit,
            PatchNotesResponse response
    ) {

        PatchNotesDocument document =
                patchNotesMapper.toDocument(
                        user,
                        repo,
                        baseCommit,
                        headCommit,
                        response
                );

        return patchNotesRepository.save(document);
    }

    @Override
    public PatchNotesDocument get(
            User user,
            String patchNotesId
    ) {

        return patchNotesRepository
                .findByIdAndUserId(
                        patchNotesId,
                        user.getId()
                )
                .orElseThrow(() ->
                        new PatchNotesNotFoundException(patchNotesId));
    }

    @Override
    public List<PatchNotesDocument> getAll(User user) {

        return patchNotesRepository
                .findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                );
    }

    @Override
    public void delete(
            User user,
            String patchNotesId
    ) {

        PatchNotesDocument document =
                get(user, patchNotesId);

        patchNotesRepository.delete(document);
    }

}