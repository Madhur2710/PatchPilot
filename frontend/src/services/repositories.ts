import { apiClient } from "@/lib/apiClient";
import type { ConnectRepoRequest, RepoResponse } from "@/types/api";

export async function getRepositories(): Promise<RepoResponse[]> {
  const { data } = await apiClient.get<RepoResponse[]>("/api/v1/repositories");
  return data;
}

export async function connectRepositories(
  requests: ConnectRepoRequest[],
): Promise<RepoResponse[]> {
  const { data } = await apiClient.post<RepoResponse[]>(
    "/api/v1/repositories",
    requests,
  );
  return data;
}

export async function disconnectRepository(repoId: string): Promise<void> {
  await apiClient.delete(`/api/v1/repositories/${repoId}`);
}
