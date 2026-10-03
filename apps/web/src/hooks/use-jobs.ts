import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Paginated } from "@/hooks/use-stores";
import type { JobStatus } from "@/lib/constants";

export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  status: JobStatus;
  postedAt: string;
}

export interface JobInput {
  title: string;
  department: string;
  description: string;
  requirements: string;
  status?: JobStatus;
}

const KEY = "jobs";

export function useJobsQuery(search?: string) {
  return useQuery({
    queryKey: [KEY, "list", search ?? ""],
    queryFn: () =>
      apiClient.get<Paginated<Job>>(
        `/admin/jobs${search ? `?search=${encodeURIComponent(search)}` : ""}`,
      ),
  });
}

export function useJobQuery(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, "detail", id],
    queryFn: () => apiClient.get<Job>(`/admin/jobs/${id}`),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: JobInput) => apiClient.post<Job>("/admin/jobs", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateJob(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<JobInput>) =>
      apiClient.patch<Job>(`/admin/jobs/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/jobs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useCloseJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch<Job>(`/admin/jobs/${id}/close`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}
