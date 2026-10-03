import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Paginated } from "@/hooks/use-stores";
import type { MediaRecord } from "@/lib/upload";

const KEY = "media";

export function useMediaQuery() {
  return useQuery({
    queryKey: [KEY, "list"],
    queryFn: () => apiClient.get<Paginated<MediaRecord>>("/admin/media?limit=60"),
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/media/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}
