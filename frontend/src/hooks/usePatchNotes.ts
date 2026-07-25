import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deletePatchNotes,
  getPatchNotes,
  getPatchNotesHistory,
} from "@/services/patchNotes";
import { generatePatchNotes } from "@/services/ai";

export function usePatchNotesHistory() {
  return useQuery({
    queryKey: ["patch-notes"],
    queryFn: getPatchNotesHistory,
  });
}

export function usePatchNotes(id: string | undefined) {
  return useQuery({
    queryKey: ["patch-note", id],
    queryFn: () => getPatchNotes(id!),
    enabled: !!id,
  });
}

export function useDeletePatchNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePatchNotes(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patch-notes"] });
      toast.success("Patch notes deleted");
    },
    onError: () => toast.error("Failed to delete patch notes"),
  });
}

export function useGeneratePatchNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: generatePatchNotes,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patch-notes"] });
    },
  });
}
