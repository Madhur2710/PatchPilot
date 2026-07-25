import { createFileRoute } from "@tanstack/react-router";
import { PatchNotesViewerPage } from "@/pages/PatchNotesViewerPage";

export const Route = createFileRoute("/_app/history/$patchNotesId")({
  component: PatchNotesViewerPage,
});
