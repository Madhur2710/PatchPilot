import { apiClient } from "@/lib/apiClient";
import type { PatchNotesDocument } from "@/types/api";

export async function getPatchNotesHistory(): Promise<PatchNotesDocument[]> {
  const { data } = await apiClient.get<PatchNotesDocument[]>("/api/patch-notes");
  return data;
}

export async function getPatchNotes(id: string): Promise<PatchNotesDocument> {
  const { data } = await apiClient.get<PatchNotesDocument>(
    `/api/patch-notes/${id}`,
  );
  return data;
}

export async function deletePatchNotes(id: string): Promise<void> {
  await apiClient.delete(`/api/patch-notes/${id}`);
}
