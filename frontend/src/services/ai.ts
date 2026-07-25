import { apiClient } from "@/lib/apiClient";
import type { PatchNotesResponse } from "@/types/api";

export async function generatePatchNotes(params: {
  repositoryId: string;
  base: string;
  head: string;
}): Promise<PatchNotesResponse> {
  const { data } = await apiClient.get<PatchNotesResponse>(
    "/api/v1/ai/generate",
    {
      params,
      // Generation can take a while; give it plenty of headroom.
      timeout: 5 * 60 * 1000,
    },
  );
  return data;
}
