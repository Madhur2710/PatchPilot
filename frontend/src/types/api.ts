// Types mirror backend DTOs (Java) 1:1. Do not rename fields.

export interface UserResponse {
  username: string;
  email: string | null;
  avatarUrl: string | null;
}

export interface RepoResponse {
  id: string;
  githubRepositoryId: number;
  name: string;
  fullName: string;
  owner: string;
  ownerAvatarUrl: string | null;
  isPrivate: boolean;
}

export interface GithubOwnerResponse {
  login: string;
  avatar_url: string | null;
}

export interface GitHubRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  isPrivate: boolean;
  owner: GithubOwnerResponse;
}

export interface GitHubBranchResponse {
  name: string;
  protected: boolean;
  commit: { sha: string };
}

export interface GitHubCommitAuthorResponse {
  name: string;
  date: string; // Instant
}

export interface GitHubCommitDetailsResponse {
  message: string;
  author: GitHubCommitAuthorResponse;
}

export interface GitHubCommitResponse {
  sha: string;
  commit: GitHubCommitDetailsResponse;
}

export interface GitHubCompareFileResponse {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch: string | null;
}

export interface GitHubCompareCommitResponse {
  sha: string;
  commit: GitHubCommitDetailsResponse;
}

export interface GitHubCompareResponse {
  status: string;
  ahead_by: number;
  behind_by: number;
  total_commits: number;
  commits: GitHubCompareCommitResponse[];
  files: GitHubCompareFileResponse[];
}

export interface PatchEvidence {
  file: string;
  changeType: string;
  startLine: number | null;
  endLine: number | null;
  patch: string;
}

export interface ReleaseItemResponse {
  title: string;
  description: string;
  evidence: PatchEvidence[] | null;
}

export interface PatchNotesResponse {
  title: string;
  summary: string;
  features: ReleaseItemResponse[] | null;
  bugFixes: ReleaseItemResponse[] | null;
  breakingChanges: ReleaseItemResponse[] | null;
  performanceImprovements: ReleaseItemResponse[] | null;
  refactorings: ReleaseItemResponse[] | null;
  additionalNotes: ReleaseItemResponse[] | null;
}

export interface PatchNotesDocument {
  id: string;
  userId: string;
  repositoryId: string;
  repositoryName: string;
  baseCommit: string;
  headCommit: string;
  content: PatchNotesResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectRepoRequest {
  githubRepositoryId: number;
}
