import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DocumentCategory } from "@/lib/constants";

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  content: string | null;
  fileId: string | null;
  file: { id: string; url: string; originalFileName: string | null } | null;
}

export interface DocumentInput {
  title: string;
  category: DocumentCategory;
  content?: string;
  fileId?: string;
}

const KEY = "documents";

export function useDocumentsQuery(category?: DocumentCategory) {
  return useQuery({
    queryKey: [KEY, "list", category ?? "all"],
    queryFn: () =>
      apiClient.get<DocumentItem[]>(
        `/admin/documents${category ? `?category=${category}` : ""}`,
      ),
  });
}

export function useDocumentQuery(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, "detail", id],
    queryFn: () => apiClient.get<DocumentItem>(`/admin/documents/${id}`),
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DocumentInput) =>
      apiClient.post<DocumentItem>("/admin/documents", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateDocument(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<DocumentInput>) =>
      apiClient.patch<DocumentItem>(`/admin/documents/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/documents/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}
