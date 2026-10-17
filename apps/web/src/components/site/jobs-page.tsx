"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase, MessageCircle, Phone } from "lucide-react";
import { usePublicContact, usePublicJob, usePublicJobs } from "@/hooks/use-public-site";
import { JobCard } from "./cards";
import { Reveal } from "./reveal";
import { MAROON } from "./theme";
import { PageHero, Pager, SiteEmpty } from "./ui";

const PAGE_SIZE = 10;

const detailHref = (id: string) => `/jobs/detail/?id=${id}`;

/** "Tuyển Dụng" — vị trí đang mở (server chỉ trả tin OPEN). */
export function JobsListContent() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePublicJobs(PAGE_SIZE, page);
  const jobs = data?.data ?? [];

  return (
    <>
      <PageHero
        eyebrow="Cộng sự S+"
        title="Cùng làm việc với S+"
        description="Chúng mình tìm những người đồng hành tử tế, ấm áp và yêu nghề."
      />
      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {isLoading ? null : jobs.length === 0 ? (
            <SiteEmpty
              icon={Briefcase}
              title="Hiện chưa có vị trí nào đang tuyển"
              description="Hãy quay lại sau — S+ luôn chào đón những người bạn mới."
            />
          ) : (
            <ul className="space-y-4">
              {jobs.map((job, i) => (
                <Reveal key={job.id} delay={i * 80}>
                  <li>
                    <JobCard job={job} href={detailHref(job.id)} />
                  </li>
                </Reveal>
              ))}
            </ul>
          )}
          <Pager page={page} total={data?.total ?? 0} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
      </section>
    </>
  );
}

const isHttpUrl = (v?: string): v is string => !!v && /^https?:\/\//i.test(v);

function JobDetailInner() {
  const id = useSearchParams().get("id") ?? undefined;
  const { data: job, isLoading, isError } = usePublicJob(id);
  const { data: contact } = usePublicContact();

  if (isLoading || (!job && !isError)) return <div className="min-h-[60vh]" />;
  if (isError || !job) {
    return (
      <SiteEmpty
        icon={Briefcase}
        title="Vị trí này không còn tuyển"
        action={{ href: "/jobs/", label: "Xem các vị trí khác" }}
      />
    );
  }

  const hasContact = !!contact?.phone || isHttpUrl(contact?.chatUrl);

  return (
    <>
      <PageHero
        eyebrow={job.department}
        title={job.title}
        description={`Đăng ngày ${new Date(job.postedAt).toLocaleDateString("vi-VN")}`}
        crumbs={[{ label: "Tuyển dụng", href: "/jobs/" }]}
      />
      <section className="pb-24">
        <div className="mx-auto grid grid-cols-1 max-w-5xl gap-10 px-4 sm:px-6 md:grid-cols-[3fr_2fr] lg:px-8">
          <div className="space-y-10">
            {/* Plain-text fields in the CMS: keep line breaks, never parse as HTML. */}
            {[
              ["Mô tả công việc", job.description],
              ["Yêu cầu", job.requirements],
            ].map(([heading, body]) => (
              <div key={heading}>
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: MAROON, fontFamily: "var(--font-display)" }}
                >
                  {heading}
                </h2>
                <div className="mt-2 h-px w-16" style={{ backgroundColor: MAROON }} />
                <p className="mt-5 leading-loose whitespace-pre-line text-stone-700">{body}</p>
              </div>
            ))}
          </div>

          {hasContact && (
            <aside className="h-fit space-y-4 rounded-2xl border border-[#960000]/10 bg-white p-6 shadow-sm md:sticky md:top-24">
              <h2
                className="text-xl font-semibold"
                style={{ color: MAROON, fontFamily: "var(--font-display)" }}
              >
                Ứng tuyển
              </h2>
              <p className="text-sm text-stone-600">
                Liên hệ S+ để gửi hồ sơ hoặc hẹn trao đổi cho vị trí này.
              </p>
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                  className="flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: MAROON }}
                >
                  <Phone className="size-4" /> {contact.phone}
                </a>
              )}
              {isHttpUrl(contact?.chatUrl) && (
                <a
                  href={contact.chatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#960000]/30 text-sm font-semibold"
                  style={{ color: MAROON }}
                >
                  <MessageCircle className="size-4" /> Nhắn tin cho S+
                </a>
              )}
            </aside>
          )}
        </div>
      </section>
    </>
  );
}

/** `/jobs/detail/?id=...` — static export has no dynamic routes. */
export function JobDetailContent() {
  return (
    <Suspense fallback={null}>
      <JobDetailInner />
    </Suspense>
  );
}
