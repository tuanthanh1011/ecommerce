import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Paginated, Store } from "@/hooks/use-stores";
import type { Post } from "@/hooks/use-posts";
import type { Job } from "@/hooks/use-jobs";
import type { Product } from "@/hooks/use-products";
import type { StoryBlock, TeamMember } from "@/hooks/use-story";
import type { ContactSettings, HomeSettings } from "@/hooks/use-site-settings";
import type {
  DrinkSubType,
  MerchandiseSubType,
  PostType,
  ProductCategory,
  TeamMemberGroup,
} from "@/lib/constants";

// Public, unauthenticated reads for the public website. Each hits a /public/*
// endpoint that already filters to publicly-visible rows server-side.
const OPTIONS = { skipAuth: true } as const;
const STALE = 60 * 1000;

type Params = Record<string, string | number | boolean | undefined>;

function qs(params: Params): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  ) as [string, string | number | boolean][];
  return entries.length
    ? `?${entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&")}`
    : "";
}

/** Shared react-query options for every public read. */
function publicQuery<T>(key: unknown[], path: string, enabled = true) {
  return {
    queryKey: ["public-site", ...key],
    queryFn: () => apiClient.get<T>(path, OPTIONS),
    enabled,
    staleTime: STALE,
    retry: 1,
  };
}

export function usePublicHome() {
  return useQuery(publicQuery<HomeSettings>(["home"], "/public/site-settings/home"));
}

export function usePublicContact() {
  return useQuery(
    publicQuery<ContactSettings>(["contact"], "/public/site-settings/contact"),
  );
}

// ── Stores ────────────────────────────────────────────────────────────────
export function usePublicStores(limit = 12) {
  return useQuery(
    publicQuery<Paginated<Store>>(["stores", limit], `/public/stores${qs({ limit })}`),
  );
}

export function usePublicStore(id: string | undefined) {
  return useQuery({
    ...publicQuery<Store>(["store", id], `/public/stores/${id}`, !!id),
    retry: false,
  });
}

// ── Posts ─────────────────────────────────────────────────────────────────
export interface PostsFilter {
  limit?: number;
  page?: number;
  type?: PostType;
  /** Leave one type out, e.g. keep "Cho đi" posts out of the news list. */
  excludeType?: PostType;
}

export function usePublicPosts(filter: PostsFilter = {}) {
  const { limit = 9, page = 1, type, excludeType } = filter;
  return useQuery(
    publicQuery<Paginated<Post>>(
      ["posts", limit, page, type ?? "all", excludeType ?? "none"],
      `/public/posts${qs({ limit, page, type, excludeType })}`,
    ),
  );
}

export function usePublicPost(slug: string | undefined) {
  return useQuery({
    ...publicQuery<Post>(
      ["post", slug],
      `/public/posts/${encodeURIComponent(slug ?? "")}`,
      !!slug,
    ),
    retry: false,
  });
}

// ── Jobs ──────────────────────────────────────────────────────────────────
export function usePublicJobs(limit = 10, page = 1) {
  return useQuery(
    publicQuery<Paginated<Job>>(
      ["jobs", limit, page],
      `/public/jobs${qs({ limit, page })}`,
    ),
  );
}

export function usePublicJob(id: string | undefined) {
  return useQuery({
    ...publicQuery<Job>(["job", id], `/public/jobs/${id}`, !!id),
    retry: false,
  });
}

// ── Products ──────────────────────────────────────────────────────────────
export interface ProductsFilter {
  limit?: number;
  page?: number;
  category?: ProductCategory;
  drinkSubType?: DrinkSubType;
  merchandiseSubType?: MerchandiseSubType;
  isNew?: boolean;
}

export function usePublicProducts(filter: ProductsFilter = {}) {
  const { limit = 12, page = 1, ...rest } = filter;
  return useQuery(
    publicQuery<Paginated<Product>>(
      ["products", limit, page, rest],
      `/public/products${qs({ limit, page, ...rest })}`,
    ),
  );
}

export function usePublicProduct(id: string | undefined) {
  return useQuery({
    ...publicQuery<Product>(["product", id], `/public/products/${id}`, !!id),
    retry: false,
  });
}

// ── Story ─────────────────────────────────────────────────────────────────
export function usePublicStoryBlocks() {
  return useQuery(publicQuery<StoryBlock[]>(["story-blocks"], "/public/story/blocks"));
}

export function usePublicTeamMembers(group: TeamMemberGroup) {
  return useQuery(
    publicQuery<TeamMember[]>(
      ["team-members", group],
      `/public/story/team-members${qs({ group })}`,
    ),
  );
}
