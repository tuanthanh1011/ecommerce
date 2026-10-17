import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

/** Every field is optional — a missing field means "not shown on the site". */
export interface ContactSettings {
  phone?: string;
  openingHours?: string;
  closingMessage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
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
    stores: boolean;
    news: boolean;
    giveBack: boolean;
    jobs: boolean;
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
