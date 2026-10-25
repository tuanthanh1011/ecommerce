import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { InternalNotices, InternalPeople } from "@/hooks/use-site-settings";

/**
 * What the website's staff-only "Nội bộ" pages show. Unlike the /public/*
 * reads these need a signed-in account (Admin or Employee).
 */
export function useInternalNotices() {
  return useQuery({
    queryKey: ["internal-pages", "notices"],
    queryFn: () => apiClient.get<InternalNotices>("/internal/notices"),
    staleTime: 60 * 1000,
  });
}

export function useInternalPeople() {
  return useQuery({
    queryKey: ["internal-pages", "people"],
    queryFn: () => apiClient.get<InternalPeople>("/internal/people"),
    staleTime: 60 * 1000,
  });
}
