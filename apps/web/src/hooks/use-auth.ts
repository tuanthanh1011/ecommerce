import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface CurrentAdmin {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
}

export function useCurrentAdmin() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiClient.get<CurrentAdmin>("/auth/me"),
    staleTime: 5 * 60 * 1000,
  });
}
