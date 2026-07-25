import { createFileRoute } from "@tanstack/react-router";
import { RepositoryDetailsPage } from "@/pages/RepositoryDetailsPage";

export const Route = createFileRoute("/_app/repositories/$repositoryId/")({
  component: RepositoryDetailsPage,
});
