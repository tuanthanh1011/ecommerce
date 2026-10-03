import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { TeamMemberGroup } from "@/lib/constants";

export interface StoryBlock {
  id: string;
  slug: string;
  title: string;
  content: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface TeamMember {
  id: string;
  group: TeamMemberGroup;
  name: string;
  role: string;
  bio: string | null;
  photoId: string | null;
  photo: { id: string; url: string } | null;
  sortOrder: number;
}

export interface TeamMemberInput {
  group: TeamMemberGroup;
  name: string;
  role: string;
  bio?: string;
  photoId?: string;
}

const BLOCKS_KEY = "story-blocks";
const MEMBERS_KEY = "team-members";

export function useStoryBlocksQuery() {
  return useQuery({
    queryKey: [BLOCKS_KEY],
    queryFn: () => apiClient.get<StoryBlock[]>("/admin/story/blocks"),
  });
}

export function useUpsertStoryBlock(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      title: string;
      content: string;
      isPublished?: boolean;
    }) => apiClient.put<StoryBlock>(`/admin/story/blocks/${slug}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [BLOCKS_KEY] }),
  });
}

export function useTeamMembersQuery(group?: TeamMemberGroup) {
  return useQuery({
    queryKey: [MEMBERS_KEY, group ?? "all"],
    queryFn: () =>
      apiClient.get<TeamMember[]>(
        `/admin/story/team-members${group ? `?group=${group}` : ""}`,
      ),
  });
}

export function useTeamMemberQuery(id: string | undefined) {
  const { data } = useTeamMembersQuery();
  return data?.find((m) => m.id === id);
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TeamMemberInput) =>
      apiClient.post<TeamMember>("/admin/story/team-members", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MEMBERS_KEY] }),
  });
}

export function useUpdateTeamMember(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<TeamMemberInput>) =>
      apiClient.patch<TeamMember>(`/admin/story/team-members/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MEMBERS_KEY] }),
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/admin/story/team-members/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MEMBERS_KEY] }),
  });
}
