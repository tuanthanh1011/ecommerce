import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Paginated } from "@/hooks/use-stores";
import type { PostType } from "@/lib/constants";

export interface Post {
  id: string;
  title: string;
  slug: string;
  type: PostType;
  coverImageId: string | null;
  coverImage: { id: string; url: string } | null;
  content: string;
  excerpt: string | null;
  isPublished: boolean;
  publishedAt: string | null;
}

export interface PostInput {
  title: string;
  slug?: string;
  type: PostType;
  coverImageId?: string;
  content: string;
  excerpt?: string;
}

const KEY = "posts";

export function usePostsQuery(type?: PostType, search?: string) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (search) params.set("search", search);
  const qs = params.toString();
  return useQuery({
    queryKey: [KEY, "list", type ?? "all", search ?? ""],
    queryFn: () =>
      apiClient.get<Paginated<Post>>(`/admin/posts${qs ? `?${qs}` : ""}`),
  });
}

export function usePostQuery(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, "detail", id],
    queryFn: () => apiClient.get<Post>(`/admin/posts/${id}`),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PostInput) => apiClient.post<Post>("/admin/posts", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<PostInput>) =>
      apiClient.patch<Post>(`/admin/posts/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/posts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useSetPostPublished(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isPublished: boolean) =>
      apiClient.patch<Post>(`/admin/posts/${id}/publish`, { isPublished }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}
