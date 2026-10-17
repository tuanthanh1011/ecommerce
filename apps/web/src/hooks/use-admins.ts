import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AdminRole } from "@/lib/constants";

export interface AdminAccount {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  /** Set while login is temporarily blocked after too many wrong passwords. */
  lockedUntil?: string | null;
}

export interface CreateAdminInput {
  email: string;
  password: string;
  fullName: string;
  role: AdminRole;
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

export function useUpdateAdminRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: AdminRole }) =>
      apiClient.patch<AdminAccount>(`/admin/admins/${id}`, { role }),
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

export function useUnlockAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/admin/admins/${id}/unlock`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateAdminPassword(id: string) {
  return useMutation({
    mutationFn: (password: string) =>
      apiClient.patch(`/admin/admins/${id}/password`, { password }),
  });
}
