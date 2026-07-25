import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RepositoriesPage } from "@/pages/RepositoriesPage";

export const Route = createFileRoute("/_app/repositories")({
  component: RepositoriesLayout,
});

function RepositoriesLayout() {
  return <Outlet />;
}