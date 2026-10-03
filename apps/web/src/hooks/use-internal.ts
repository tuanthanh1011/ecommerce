import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface InternalAnnouncement {
  id: string;
  title: string;
  content: string;
  pinnedUntil: string | null;
}

export interface AnnouncementInput {
  title: string;
  content: string;
  pinnedUntil?: string;
}

export interface ScheduleEntry {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string | null;
  location: string | null;
}

export interface ScheduleEntryInput {
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  location?: string;
}

const ANNOUNCEMENTS_KEY = "internal-announcements";
const SCHEDULE_KEY = "schedule-entries";

export function useAnnouncementsQuery() {
  return useQuery({
    queryKey: [ANNOUNCEMENTS_KEY],
    queryFn: () =>
      apiClient.get<InternalAnnouncement[]>("/admin/internal-announcements"),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AnnouncementInput) =>
      apiClient.post<InternalAnnouncement>(
        "/admin/internal-announcements",
        input,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_KEY] }),
  });
}

export function useUpdateAnnouncement(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<AnnouncementInput>) =>
      apiClient.patch<InternalAnnouncement>(
        `/admin/internal-announcements/${id}`,
        input,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_KEY] }),
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/admin/internal-announcements/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_KEY] }),
  });
}

export function useScheduleQuery() {
  return useQuery({
    queryKey: [SCHEDULE_KEY],
    queryFn: () => apiClient.get<ScheduleEntry[]>("/admin/schedule-entries"),
  });
}

export function useCreateScheduleEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ScheduleEntryInput) =>
      apiClient.post<ScheduleEntry>("/admin/schedule-entries", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY] }),
  });
}

export function useUpdateScheduleEntry(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<ScheduleEntryInput>) =>
      apiClient.patch<ScheduleEntry>(`/admin/schedule-entries/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY] }),
  });
}

export function useDeleteScheduleEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/admin/schedule-entries/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY] }),
  });
}
