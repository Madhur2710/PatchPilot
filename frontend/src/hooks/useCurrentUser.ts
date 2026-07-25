import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/services/auth";
import { getToken } from "@/lib/session";
import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [hasToken, setHasToken] = useState<boolean>(false);
  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
