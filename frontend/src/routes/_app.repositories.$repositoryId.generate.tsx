import { createFileRoute } from "@tanstack/react-router";
import { GeneratePatchNotesPage } from "@/pages/GeneratePatchNotesPage";

export const Route = createFileRoute(
  "/_app/repositories/$repositoryId/generate",
)({
  component: GeneratePatchNotesPage,
});
