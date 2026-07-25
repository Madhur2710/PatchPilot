import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  connectRepositories,
  disconnectRepository,
  getRepositories,
} from "@/services/repositories";
import { getGithubRepositories } from "@/services/github";
import type { ConnectRepoRequest } from "@/types/api";

export function useRepositories() {
  return useQuery({
    queryKey: ["repositories"],
    queryFn: getRepositories,
  });
}

export function useGithubRepositories(enabled: boolean) {
  return useQuery({
    queryKey: ["github", "repositories"],
    queryFn: getGithubRepositories,
    enabled,
    staleTime: 60_000,
  });
}

export function useConnectRepositories() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requests: ConnectRepoRequest[]) => connectRepositories(requests),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["repositories"] });
      toast.success("Repository connected");
    },
    onError: () => toast.error("Failed to connect repository"),
  });
}

export function useDisconnectRepository() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (repoId: string) => disconnectRepository(repoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["repositories"] });
      toast.success("Repository removed");
    },
    onError: () => toast.error("Failed to remove repository"),
  });
}
