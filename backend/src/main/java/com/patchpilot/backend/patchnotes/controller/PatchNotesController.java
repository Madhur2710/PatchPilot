package com.patchpilot.backend.patchnotes.controller;

import com.patchpilot.backend.patchnotes.PatchNotesDocument;
import com.patchpilot.backend.patchnotes.service.PatchNotesService;
import com.patchpilot.backend.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patch-notes")
@Slf4j
public class PatchNotesController {

    @Autowired
    private PatchNotesService patchNotesService;

    @GetMapping
    public List<PatchNotesDocument> getAllPatchNotes(
            @AuthenticationPrincipal User user
    ) {

        return patchNotesService.getAll(user);
    }

    @GetMapping("/{patchNotesId}")
    public PatchNotesDocument getPatchNotes(
            @AuthenticationPrincipal User user,
            @PathVariable String patchNotesId
    ) {

        return patchNotesService.get(
                user,
                patchNotesId
        );
    }

    @DeleteMapping("/{patchNotesId}")
    public void deletePatchNotes(
            @AuthenticationPrincipal User user,
            @PathVariable String patchNotesId
    ) {

        patchNotesService.delete(
                user,
                patchNotesId
        );
    }

}