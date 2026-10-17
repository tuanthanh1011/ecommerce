"use client";

import { usePublicHome } from "@/hooks/use-public-site";
import { HomeHero, HomeSpace, HomeStory } from "./home-sections";
import { NewProductsSection } from "./home-lists";

/**
 * The home page body, composed from the CMS "Trang chủ" configuration.
 * The new-products section can be switched off there, and also hides itself
 * while it has no content.
 */
export function HomeContent() {
  const { data: home } = usePublicHome();
  if (!home) return null;

  return (
    <>
      <HomeHero config={home.hero} />
      <HomeStory config={home.story} />
      <HomeSpace config={home.space} />
      {home.sections.newProducts && <NewProductsSection />}
    </>
  );
}
