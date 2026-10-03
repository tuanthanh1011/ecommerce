"use client";

import { useEffect } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Warn on tab close / reload while the form has unsaved edits. */
export function useUnsavedChangesWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}

/**
 * Floating save bar that slides up only when the form is dirty, so the
 * primary action is always within reach on long forms.
 */
export function FormActionBar({
  formId,
  dirty,
  submitting,
  onDiscard,
  submitLabel = "Lưu thay đổi",
}: {
  formId: string;
  dirty: boolean;
  submitting: boolean;
  onDiscard: () => void;
  submitLabel?: string;
}) {
  useUnsavedChangesWarning(dirty);
  const visible = dirty || submitting;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none sticky bottom-4 z-20 mt-6 flex justify-center transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-stone-800 bg-stone-900/95 py-2.5 pr-2.5 pl-4 text-white shadow-2xl shadow-stone-900/30 backdrop-blur dark:border-stone-700",
          visible && "pointer-events-auto",
        )}
      >
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
        </span>
        <p className="flex-1 truncate text-sm">
          <span className="font-medium">Có thay đổi chưa lưu</span>
          <span className="hidden text-stone-400 sm:inline"> · Lưu để cập nhật lên website</span>
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          tabIndex={visible ? 0 : -1}
          disabled={submitting}
          onClick={onDiscard}
          className="text-stone-300 hover:bg-white/10 hover:text-white"
        >
          <RotateCcw />
          Hoàn tác
        </Button>
        <Button
          type="submit"
          form={formId}
          size="sm"
          tabIndex={visible ? 0 : -1}
          disabled={submitting}
          className="bg-amber-500 text-stone-950 [box-shadow:none] hover:bg-amber-400"
        >
          {submitting ? <Loader2 className="animate-spin" /> : <Save />}
          {submitting ? "Đang lưu..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}
