import { useQuery } from "@tanstack/react-query";
import { getBranches, getCommits } from "@/services/github";

export function useBranches(repositoryId: string | undefined) {
  return useQuery({
    queryKey: ["branches", repositoryId],
    queryFn: () => getBranches(repositoryId!),
    enabled: !!repositoryId,
  });
}

export function useCommits(
  repositoryId: string | undefined,
  branch: string | undefined,
) {
  return useQuery({
    queryKey: ["commits", repositoryId, branch],
    queryFn: () => getCommits(repositoryId!, branch!),
    enabled: !!repositoryId && !!branch,
  });
}
