import { createFileRoute } from "@tanstack/react-router";
import { RepositoriesPage } from "@/pages/RepositoriesPage";

export const Route = createFileRoute("/_app/repositories/")({
  component: RepositoriesPage,
});
