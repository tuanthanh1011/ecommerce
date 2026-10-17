import { PreviewFrame } from "@/components/common/preview-card";

/**
 * Frame for CMS previews of public content: the real website component sits on
 * the website's own background, so what you see here is what visitors see.
 */
export function SitePreview({
  label = "Xem trước trên website",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <PreviewFrame label={label}>
      <div className="space-y-4 bg-[#f3e9dc] p-4 text-stone-900">{children}</div>
    </PreviewFrame>
  );
}
