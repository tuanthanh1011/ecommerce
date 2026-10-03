import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Paginated } from "@/hooks/use-stores";
import type {
  DrinkSubType,
  MerchandiseSubType,
  ProductCategory,
  ProductStatus,
} from "@/lib/constants";

export interface ProductPhoto {
  id: string;
  sortOrder: number;
  media: { id: string; url: string };
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  drinkSubType: DrinkSubType | null;
  merchandiseSubType: MerchandiseSubType | null;
  description: string | null;
  price: string | null;
  status: ProductStatus;
  photos: ProductPhoto[];
}

export interface ProductInput {
  name: string;
  category: ProductCategory;
  drinkSubType?: DrinkSubType;
  merchandiseSubType?: MerchandiseSubType;
  description?: string;
  price?: string;
  status?: ProductStatus;
}

const KEY = "products";

export function useProductsQuery(search?: string) {
  return useQuery({
    queryKey: [KEY, "list", search ?? ""],
    queryFn: () =>
      apiClient.get<Paginated<Product>>(
        `/admin/products${search ? `?search=${encodeURIComponent(search)}` : ""}`,
      ),
  });
}

export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, "detail", id],
    queryFn: () => apiClient.get<Product>(`/admin/products/${id}`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) =>
      apiClient.post<Product>("/admin/products", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) =>
      apiClient.patch<Product>(`/admin/products/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useAttachProductPhoto(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: string) =>
      apiClient.post(`/admin/products/${productId}/photos`, { mediaId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [KEY, "detail", productId] }),
  });
}

export function useDetachProductPhoto(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) =>
      apiClient.delete(`/admin/products/${productId}/photos/${photoId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [KEY, "detail", productId] }),
  });
}
