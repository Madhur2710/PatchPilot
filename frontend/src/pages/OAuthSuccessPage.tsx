import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { clearToken, setToken } from "@/lib/session";
import { fetchCurrentUser } from "@/services/auth";
import { toast } from "sonner";

export function OAuthSuccessPage() {
  const navigate = useNavigate();
  const ran = useRef(false);
  console.log("inside Oauth");
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (!token) {
      toast.error("Authentication failed");
      navigate({ to: "/", replace: true });
      return;
    }

    setToken(token);
    fetchCurrentUser()
      .then(() => {
        navigate({ to: "/dashboard", replace: true });
      })
      .catch(() => {
        clearToken();
        toast.error("Authentication failed");
        navigate({ to: "/", replace: true });
      });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
