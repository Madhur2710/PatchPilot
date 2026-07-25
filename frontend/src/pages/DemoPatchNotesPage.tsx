import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EvidencePanel } from "@/components/common/EvidencePanel";
import { ArrowLeft, Zap } from "lucide-react";
import type { PatchNotesResponse } from "@/types/api";

const DEMO: PatchNotesResponse = {
  title: "v1.4.0 · Refresh tokens & OAuth hardening",
  summary:
    "This release introduces first-class refresh token support in JwtService, tightens the GitHub OAuth callback flow, and refactors RepoService for cleaner repository lookups. All changes are grounded in the actual diff between commits.",
  features: [
    {
      title: "Refresh token validation",
      description:
        "JwtService now differentiates refresh tokens from access tokens before validation, enabling long-lived sessions.",
      evidence: [
        {
          file: "JwtService.java",
          changeType: "MODIFIED",
          startLine: 48,
          endLine: 72,
          patch:
            "@@ -48,6 +48,14 @@\n-    return validateLegacy(token);\n+    if (isRefreshToken(token)) {\n+      return validateRefresh(token);\n+    }\n+    return validateAccess(token);",
        },
      ],
    },
  ],
  bugFixes: [
    {
      title: "OAuth callback state handling",
      description:
        "Fixed a race condition when GitHub returned a state parameter out of order during the OAuth handshake.",
      evidence: [
        {
          file: "OAuthController.java",
          changeType: "MODIFIED",
          startLine: 33,
          endLine: 41,
          patch:
            "@@ -33,3 +33,9 @@\n-  session.set(\"state\", state);\n+  if (!expectedState.equals(state)) {\n+    throw new InvalidOAuthStateException();\n+  }",
        },
      ],
    },
  ],
  breakingChanges: null,
  performanceImprovements: [
    {
      title: "Cached repository lookups",
      description:
        "RepoService now caches repository lookups per-user, reducing MongoDB round trips on the compare endpoint.",
      evidence: [
        {
          file: "RepoService.java",
          changeType: "MODIFIED",
          startLine: 12,
          endLine: 24,
          patch:
            "@@ -12,4 +12,7 @@\n-    return repoRepository.findById(id);\n+    return cache.computeIfAbsent(\n+      id, k -> repoRepository.findById(k)\n+    );",
        },
      ],
    },
  ],
  refactorings: null,
  additionalNotes: null,
};

const CATEGORIES = [
  { key: "features", emoji: "✨", label: "Features" },
  { key: "bugFixes", emoji: "🐛", label: "Bug Fixes" },
  {
    key: "performanceImprovements",
    emoji: "⚡",
    label: "Performance Improvements",
  },
] as const;

export function DemoPatchNotesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold">PatchPilot</span>
          </Link>
          <Badge variant="outline" className="ml-2 text-[10px]">
            Example
          </Badge>
          <Button asChild variant="ghost" size="sm" className="ml-auto gap-1.5">
            <Link to="/">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {DEMO.title}
          </h1>
        </div>
        <div className="mx-auto mt-6 rounded-lg border border-border bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
          {DEMO.summary}
        </div>

        <div className="mt-10 space-y-10">
          {CATEGORIES.map((cat) => {
            const items = DEMO[cat.key];
            if (!items || items.length === 0) return null;
            return (
              <section key={cat.key}>
                <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <span aria-hidden>{cat.emoji}</span>
                  {cat.label}
                  <Badge variant="outline" className="ml-1 text-[10px]">
                    {items.length}
                  </Badge>
                </h2>
                <div className="mt-4 space-y-3">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                      <EvidencePanel evidence={item.evidence} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
