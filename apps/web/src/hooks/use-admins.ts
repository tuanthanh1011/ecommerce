import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface AdminAccount {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
}

export interface CreateAdminInput {
  email: string;
  password: string;
  fullName: string;
}

const KEY = "admins";

export function useAdminsQuery() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => apiClient.get<AdminAccount[]>("/admin/admins"),
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAdminInput) =>
      apiClient.post<AdminAccount>("/admin/admins", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeactivateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/admins/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateAdminPassword(id: string) {
  return useMutation({
    mutationFn: (password: string) =>
      apiClient.patch(`/admin/admins/${id}/password`, { password }),
  });
}
