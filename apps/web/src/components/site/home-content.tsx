"use client";

import { usePublicHome } from "@/hooks/use-public-site";
import { HomeHero, HomeSpace, HomeStory } from "./home-sections";
import {
  GiveBackSection,
  JobsSection,
  NewProductsSection,
  NewsSection,
  StoresSection,
} from "./home-lists";

/**
 * The home page body, composed from the CMS "Trang chủ" configuration.
 * Sections backed by other CMS tabs can be switched off there, and also hide
 * themselves while they have no content.
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
      {home.sections.stores && <StoresSection />}
      {home.sections.news && <NewsSection />}
      {home.sections.giveBack && <GiveBackSection />}
      {home.sections.jobs && <JobsSection />}
    </>
  );
}
