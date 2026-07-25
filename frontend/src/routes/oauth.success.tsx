import { createFileRoute } from "@tanstack/react-router";
import { OAuthSuccessPage } from "@/pages/OAuthSuccessPage";

export const Route = createFileRoute("/oauth/success")({
  ssr: false,
  component: OAuthSuccessPage,
});
