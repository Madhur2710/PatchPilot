import { createFileRoute } from "@tanstack/react-router";
import { DemoPatchNotesPage } from "@/pages/DemoPatchNotesPage";

export const Route = createFileRoute("/demo")({
  component: DemoPatchNotesPage,
  head: () => ({
    meta: [
      { title: "Example patch notes — PatchPilot" },
      {
        name: "description",
        content: "See what an evidence-backed release note looks like.",
      },
    ],
  }),
});
