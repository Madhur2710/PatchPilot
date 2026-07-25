import { apiClient } from "@/lib/apiClient";
import type { UserResponse } from "@/types/api";

export async function fetchCurrentUser(): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>("/api/v1/users/me");
  return data;
}
