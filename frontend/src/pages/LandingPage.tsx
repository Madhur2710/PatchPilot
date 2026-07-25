import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { OAUTH_START_URL } from "@/lib/apiClient";
import { getToken } from "@/lib/session";
import {
  Zap,
  Github,
  Sparkles,
  GitCompareArrows,
  FileSearch,
  FolderGit2,
  History,
  Rocket,
  ArrowRight,
  Check,
  Plus,
  Minus,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Release Notes",
    desc: "Generate structured release notes from any two GitHub commits.",
  },
  {
    icon: GitCompareArrows,
    title: "GitHub Compare",
    desc: "Compare any two commits across branches — no releases required.",
  },
  {
    icon: FileSearch,
    title: "Evidence Mapping",
    desc: "Every item links back to the exact file, lines, and diff patch.",
  },
  {
    icon: FolderGit2,
    title: "Repository Management",
    desc: "Securely connect multiple repositories from your GitHub account.",
  },
  {
    icon: History,
    title: "Patch Note History",
    desc: "Every generation is stored — revisit and share previous notes.",
  },
  {
    icon: Rocket,
    title: "Fast Generation",
    desc: "Get polished release notes in seconds, not hours.",
  },
];

const steps = [
  { icon: Github, label: "Sign in with GitHub" },
  { icon: FolderGit2, label: "Connect a repository" },
  { icon: GitCompareArrows, label: "Pick a branch" },
  { icon: FileSearch, label: "Choose base & head" },
  { icon: Sparkles, label: "Generate patch notes" },
  { icon: History, label: "Review history" },
];

const faqs = [
  {
    q: "Do I need to use GitHub Releases?",
    a: "No. PatchPilot compares any two commits directly — no tags or releases required.",
  },
  {
    q: "Can I compare any two commits?",
    a: "Yes. Pick any base and head commit on the same branch to generate release notes.",
  },
  {
    q: "Is my code stored?",
    a: "Only the repositories you explicitly connect are accessible. Generated notes are stored in your account.",
  },
  {
    q: "How are release notes generated?",
    a: "PatchPilot uses AI over the actual git diff, and every item is grounded in evidence from the code.",
  },
];

function startGithubLogin() {
  window.location.href = OAUTH_START_URL;
}

export function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getToken()) {
      navigate({ to: "/dashboard", replace: true });
    }
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header
        className={`sticky top-0 z-40 border-b transition-colors ${
          scrolled
            ? "border-border bg-background/85 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              PatchPilot
            </span>
          </a>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="ml-auto">
            <Button size="sm" onClick={startGithubLogin} className="gap-2">
              <Github className="h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_18%,transparent)_0%,transparent_60%)]"
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-20 md:grid-cols-2 md:pt-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Evidence-backed AI, grounded in your git diff
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Generate AI-powered patch notes in seconds
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              PatchPilot reads the diff between any two commits and generates
              professional release notes backed by real code evidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={startGithubLogin} className="gap-2">
                <Github className="h-4 w-4" />
                Continue with GitHub
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/demo">
                  View Example Patch Notes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero illustration */}
          <HeroIllustration />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            eyebrow="Features"
            title="Built for engineering teams that ship often"
            subtitle="Everything you need to translate commits into release-ready notes — nothing you don't."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-border/70"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <f.icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            eyebrow="How it works"
            title="From commit to release note in under a minute"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {steps.map((s, i) => (
              <div
                key={s.label}
                className="relative rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-10 divide-y divide-border rounded-lg border border-border bg-card">
            {faqs.map((f) => (
              <FaqItem key={f.q} question={f.q} answer={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="font-medium text-foreground">PatchPilot</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </a>
            {/* TODO: replace href once docs / privacy / contact URLs exist. */}
            <a href="#" className="hover:text-foreground">
              Documentation
            </a>
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-medium uppercase tracking-wider text-primary">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="flex w-full flex-col items-start gap-2 px-5 py-4 text-left transition-colors hover:bg-muted/30"
    >
      <span className="flex w-full items-center justify-between gap-3 text-sm font-medium">
        {question}
        {open ? (
          <Minus className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Plus className="h-4 w-4 text-muted-foreground" />
        )}
      </span>
      {open ? (
        <span className="text-sm text-muted-foreground">{answer}</span>
      ) : null}
    </button>
  );
}

function HeroIllustration() {
  return (
    <div className="relative rounded-xl border border-border bg-card/60 p-4 shadow-2xl">
      <div className="flex items-center gap-1.5 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-3 font-mono text-[11px] text-muted-foreground">
          patchpilot · JwtService.java
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {/* Diff column */}
        <div className="rounded-md border border-border bg-background p-3 font-mono text-[11px] leading-relaxed">
          <div className="text-primary">@@ -48,6 +48,14 @@</div>
          <div className="diff-line-del px-1">- return validateLegacy(token);</div>
          <div className="diff-line-add px-1">+ if (isRefreshToken(token)) {"{"}</div>
          <div className="diff-line-add px-1">+ &nbsp; return validateRefresh(token);</div>
          <div className="diff-line-add px-1">+ {"}"}</div>
          <div className="diff-line-add px-1">+ return validateAccess(token);</div>
        </div>
        {/* Notes column */}
        <div className="rounded-md border border-border bg-background p-3">
          <div className="text-[10px] font-medium uppercase tracking-wider text-primary">
            ✨ Features
          </div>
          <div className="mt-1.5 text-sm font-semibold">
            Refresh token validation
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            JwtService now differentiates access from refresh tokens before
            validation.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[11px] text-muted-foreground">
            <Check className="h-3 w-3 text-success" />
            Evidence · JwtService.java · L48–L62
          </div>
        </div>
      </div>
    </div>
  );
}
