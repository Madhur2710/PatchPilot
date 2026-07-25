import { apiClient } from "@/lib/apiClient";
import type {
  GitHubBranchResponse,
  GitHubCommitResponse,
  GitHubCompareResponse,
  GitHubRepositoryResponse,
} from "@/types/api";

export async function getGithubRepositories(): Promise<
  GitHubRepositoryResponse[]
> {
  const { data } = await apiClient.get<GitHubRepositoryResponse[]>(
    "/api/v1/github/repositories",
  );
  return data;
}

export async function getBranches(
  repositoryId: string,
): Promise<GitHubBranchResponse[]> {
  const { data } = await apiClient.get<GitHubBranchResponse[]>(
    `/api/v1/github/repositories/${repositoryId}/branches`,
  );
  return data;
}

export async function getCommits(
  repositoryId: string,
  branch: string,
): Promise<GitHubCommitResponse[]> {
  const { data } = await apiClient.get<GitHubCommitResponse[]>(
    `/api/v1/github/repositories/${repositoryId}/branches/${encodeURIComponent(branch)}/commits`,
  );
  return data;
}

export async function compareCommits(
  repositoryId: string,
  base: string,
  head: string,
): Promise<GitHubCompareResponse> {
  const { data } = await apiClient.get<GitHubCompareResponse>(
    `/api/v1/github/repositories/${repositoryId}/compare`,
    { params: { base, head } },
  );
  return data;
}
