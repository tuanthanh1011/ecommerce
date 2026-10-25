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

export function useCurrentAdmin(enabled = true) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiClient.get<CurrentAdmin>("/auth/me"),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
