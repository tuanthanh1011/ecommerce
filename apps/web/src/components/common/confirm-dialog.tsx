"use client";

import { useState } from "react";
import { Loader2, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => Promise<unknown> | void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Xoá",
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false);

  const handleConfirm = async () => {
    setPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50 dark:bg-red-500/15 dark:ring-red-500/5">
            <TriangleAlert className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ?? "Hành động này không thể hoàn tác."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Huỷ</AlertDialogCancel>
          <Button
            className="bg-red-600 text-white shadow-red-900/20 [box-shadow:none] hover:bg-red-700"
            disabled={pending}
            onClick={handleConfirm}
          >
            {pending && <Loader2 className="animate-spin" />}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Icon-only delete trigger with a built-in confirmation step. */
export function DeleteButton({
  itemLabel,
  title,
  description,
  onConfirm,
  className,
  children,
}: {
  itemLabel: string;
  title?: string;
  description?: React.ReactNode;
  onConfirm: () => Promise<unknown> | void;
  className?: string;
  /** Custom trigger content; defaults to a trash icon */
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={children ? "sm" : "icon-sm"}
        className={cn(
          "text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10",
          className,
        )}
        onClick={() => setOpen(true)}
        aria-label={`Xoá ${itemLabel}`}
        title="Xoá"
      >
        {children ?? <Trash2 />}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={title ?? "Xác nhận xoá"}
        description={
          description ?? (
            <>
              Bạn sắp xoá <span className="font-medium text-foreground">“{itemLabel}”</span>.
              Hành động này không thể hoàn tác.
            </>
          )
        }
        onConfirm={onConfirm}
      />
    </>
  );
}
