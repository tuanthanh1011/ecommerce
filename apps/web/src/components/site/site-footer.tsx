"use client";

import { Clock, MessageCircle, Phone } from "lucide-react";
import { usePublicContact } from "@/hooks/use-public-site";
import type { ContactSettings } from "@/hooks/use-site-settings";
import { Reveal } from "./reveal";
import { MAROON } from "./theme";

/** Minimal brand glyphs — lucide-react no longer ships logo icons. */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.5H16l.5-3H13.5V8.5c0-.9.25-1.5 1.56-1.5H16.5V4.3c-.27-.04-1.2-.11-2.28-.11-2.25 0-3.8 1.37-3.8 3.9V10.5H8v3h2.42V21h3.08Z" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

/** Only http(s) links are rendered — these come from the CMS. */
const isHttpUrl = (v?: string): v is string => !!v && /^https?:\/\//i.test(v);

/**
 * Footer driven by "Thông tin liên hệ" in the CMS. Every block (message,
 * phone, hours, each social link) is shown only when it has a value.
 */
export function SiteFooter() {
  const { data: contact } = usePublicContact();
  return <SiteFooterView contact={contact} />;
}

/**
 * Pure view of the footer. The CMS "Thông tin liên hệ" page renders this
 * same component with the unsaved form values, so its preview is the real
 * footer, not a lookalike.
 */
export function SiteFooterView({ contact }: { contact?: ContactSettings }) {
  const socials = [
    { href: contact?.facebookUrl, label: "Facebook S+ Coffee", Icon: FacebookIcon },
    { href: contact?.instagramUrl, label: "Instagram S+ Coffee", Icon: InstagramIcon },
    { href: contact?.youtubeUrl, label: "YouTube S+ Coffee", Icon: YouTubeIcon },
    { href: contact?.tiktokUrl, label: "TikTok S+ Coffee", Icon: TikTokIcon },
    { href: contact?.chatUrl, label: "Chat với S+ Coffee", Icon: MessageCircle },
  ].filter((s) => isHttpUrl(s.href));

  const hasContactRow = !!contact?.phone || !!contact?.openingHours;

  return (
    <footer
      className="relative overflow-hidden pt-20 pb-10 text-center text-[#f3e9dc]"
      style={{ backgroundColor: MAROON }}
    >
      <svg
        className="absolute top-0 left-0 w-full text-[#f3e9dc]"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="currentColor" d="M0 0h1440v16c-240 24-480 32-720 32S240 40 0 16V0Z" />
      </svg>
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.15]" />

      <div className="relative mx-auto max-w-3xl px-4">
        <Reveal>
          {contact?.closingMessage && (
            <p
              className="text-xl font-medium sm:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {contact.closingMessage}
            </p>
          )}

          {hasContactRow && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white/70"
                >
                  <Phone className="size-4" /> {contact.phone}
                </a>
              )}
              {contact?.openingHours && (
                <span className="inline-flex items-center gap-2 text-[#f3e9dc]/85">
                  <Clock className="size-4" /> {contact.openingHours}
                </span>
              )}
            </div>
          )}

          {socials.length > 0 && (
            <div className="mt-7 flex items-center justify-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white/15"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}

          <p className="mt-10 border-t border-[#f3e9dc]/20 pt-6 text-xs text-[#f3e9dc]/60">
            © {new Date().getFullYear()} S+ Coffee. Mọi quyền được bảo lưu.
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
