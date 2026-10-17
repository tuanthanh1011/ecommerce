import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AdminRole } from "@/lib/constants";

export interface CurrentAdmin {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
}

export function useCurrentAdmin() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiClient.get<CurrentAdmin>("/auth/me"),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Employees are read-only everywhere in the CMS. The API enforces this on
 * every write; this hook is what the UI uses to hide the controls that would
 * only ever produce a 403. `false` while the user is still loading.
 */
export function useIsReadOnly(): boolean {
  const { data } = useCurrentAdmin();
  return data?.role === AdminRole.EMPLOYEE;
}
