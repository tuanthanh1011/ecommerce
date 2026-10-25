import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

/** Every field is optional — a missing field means "not shown on the site". */
export interface ContactSettings {
  phone?: string;
  openingHours?: string;
  closingMessage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  chatUrl?: string;
}

const KEY = "site-settings";

export function useContactSettingsQuery() {
  return useQuery({
    queryKey: [KEY, "contact"],
    queryFn: () => apiClient.get<ContactSettings>("/admin/site-settings/contact"),
  });
}

export function useUpdateContactSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ContactSettings) =>
      apiClient.put<ContactSettings>("/admin/site-settings/contact", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export interface HomeSettings {
  hero: {
    enabled: boolean;
    heading: string;
    tagline: string;
    ctaLabel: string;
    slides: { url: string }[];
  };
  story: {
    enabled: boolean;
    badge: string;
    title: string;
    body: string;
    imageUrl: string;
  };
  space: {
    enabled: boolean;
    title: string;
    tagline: string;
    imageUrl: string;
  };
  /** On/off for sections whose content comes from other CMS tabs. */
  sections: {
    newProducts: boolean;
  };
}

export function useHomeSettingsQuery() {
  return useQuery({
    queryKey: [KEY, "home"],
    queryFn: () => apiClient.get<HomeSettings>("/admin/site-settings/home"),
  });
}

export function useUpdateHomeSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: HomeSettings) =>
      apiClient.put<HomeSettings>("/admin/site-settings/home", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export interface InternalNoticeItem {
  title: string;
  /** Where the "Chi Tiết" button goes (http(s) URL or a site path). */
  url: string;
}

export interface InternalNotices {
  /** Banner photo url; empty = plain red band. */
  bannerUrl: string;
  slogan: string;
  /** Faint S+ COFFEE mark behind the content. */
  showWatermark: boolean;
  title: string;
  intro: string;
  tocTitle: string;
  items: InternalNoticeItem[];
  closing: string;
}

export interface InternalPeople {
  /** Banner photo url; empty = plain red band. */
  bannerUrl: string;
  slogan: string;
  /** Faint S+ COFFEE mark behind the content. */
  showWatermark: boolean;
  title: string;
  lead: string;
  /** Rich text (HTML) bullets under the lead. */
  intro: string;
  highlight: string;
  detailTitle: string;
  /** Rich text (HTML): the numbered sections (one h2 each). */
  content: string;
  closing: string;
}

export function useInternalNoticesQuery() {
  return useQuery({
    queryKey: [KEY, "internal-notices"],
    queryFn: () => apiClient.get<InternalNotices>("/admin/site-settings/internal-notices"),
  });
}

export function useUpdateInternalNotices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InternalNotices) =>
      apiClient.put<InternalNotices>("/admin/site-settings/internal-notices", input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [KEY] });
      void queryClient.invalidateQueries({ queryKey: ["internal-pages"] });
    },
  });
}

export function useInternalPeopleQuery() {
  return useQuery({
    queryKey: [KEY, "internal-people"],
    queryFn: () => apiClient.get<InternalPeople>("/admin/site-settings/internal-people"),
  });
}

export function useUpdateInternalPeople() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InternalPeople) =>
      apiClient.put<InternalPeople>("/admin/site-settings/internal-people", input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [KEY] });
      void queryClient.invalidateQueries({ queryKey: ["internal-pages"] });
    },
  });
}
