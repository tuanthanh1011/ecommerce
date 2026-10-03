import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface StorePhoto {
  id: string;
  sortOrder: number;
  media: { id: string; url: string };
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  googleMapsUrl: string | null;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  photos: StorePhoto[];
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface StoreInput {
  name: string;
  address: string;
  phone?: string;
  googleMapsUrl?: string;
  description?: string;
  isActive?: boolean;
}

const KEY = "stores";

export function useStoresQuery(search?: string) {
  return useQuery({
    queryKey: [KEY, "list", search ?? ""],
    queryFn: () =>
      apiClient.get<Paginated<Store>>(
        `/admin/stores${search ? `?search=${encodeURIComponent(search)}` : ""}`,
      ),
  });
}

export function useStoreQuery(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, "detail", id],
    queryFn: () => apiClient.get<Store>(`/admin/stores/${id}`),
    enabled: !!id,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StoreInput) =>
      apiClient.post<Store>("/admin/stores", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateStore(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StoreInput) =>
      apiClient.patch<Store>(`/admin/stores/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/stores/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useAttachStorePhoto(storeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: string) =>
      apiClient.post(`/admin/stores/${storeId}/photos`, { mediaId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [KEY, "detail", storeId] }),
  });
}

export function useDetachStorePhoto(storeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) =>
      apiClient.delete(`/admin/stores/${storeId}/photos/${photoId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [KEY, "detail", storeId] }),
  });
}
