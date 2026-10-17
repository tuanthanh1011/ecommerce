"use client";

import { BookOpen } from "lucide-react";
import { usePublicStoryBlocks, usePublicTeamMembers } from "@/hooks/use-public-site";
import { TEAM_MEMBER_GROUP_LABELS, TeamMemberGroup } from "@/lib/constants";
import { StoryBlockSection, TeamMemberCard } from "./cards";
import { Reveal } from "./reveal";
import { MAROON } from "./theme";
import { PageHero, SiteEmpty } from "./ui";

function TeamGroup({ group }: { group: TeamMemberGroup }) {
  const { data: members } = usePublicTeamMembers(group);
  if (!members?.length) return null;
  const sorted = [...members].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2
            className="text-3xl font-semibold tracking-tight"
            style={{ color: MAROON, fontFamily: "var(--font-display)" }}
          >
            {TEAM_MEMBER_GROUP_LABELS[group]}
          </h2>
          <div className="mx-auto mt-3 h-px w-16" style={{ backgroundColor: MAROON }} />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((member, i) => (
            <Reveal key={member.id} delay={(i % 4) * 80}>
              <TeamMemberCard member={member} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "Câu Chuyện S+" — hướng đi, văn hoá (story blocks) và đội ngũ. */
export function StoryPageContent() {
  const { data: blocks, isLoading } = usePublicStoryBlocks();
  const core = usePublicTeamMembers(TeamMemberGroup.CORE_TEAM).data;
  const advisory = usePublicTeamMembers(TeamMemberGroup.ADVISORY_BOARD).data;

  const sortedBlocks = [...(blocks ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const isEmpty = !sortedBlocks.length && !core?.length && !advisory?.length;

  return (
    <>
      <PageHero
        eyebrow="Câu chuyện S+"
        title="Hướng đi, văn hoá và con người"
        description="Vì sao S+ ra đời, S+ đang đi về đâu và những ai đang cùng nhau giữ lửa."
      />
      {isLoading ? null : isEmpty ? (
        <SiteEmpty icon={BookOpen} title="Câu chuyện S+ đang được viết tiếp" />
      ) : (
        <>
          <div className="mx-auto max-w-3xl space-y-14 px-4 pb-6 sm:px-6">
            {sortedBlocks.map((block, i) => (
              <Reveal key={block.id} delay={i * 80}>
                <StoryBlockSection index={i} title={block.title} content={block.content} />
              </Reveal>
            ))}
          </div>
          <TeamGroup group={TeamMemberGroup.CORE_TEAM} />
          <TeamGroup group={TeamMemberGroup.ADVISORY_BOARD} />
          <div className="pb-16" />
        </>
      )}
    </>
  );
}
