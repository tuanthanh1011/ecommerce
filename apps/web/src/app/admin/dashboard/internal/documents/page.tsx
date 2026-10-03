"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { FileText, Paperclip, Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Segmented } from "@/components/common/segmented";
import { TitleCell } from "@/components/common/thumb";
import { EditAction, RowActions } from "@/components/common/row-actions";
import { DeleteButton } from "@/components/common/confirm-dialog";
import {
  useDeleteDocument,
  useDocumentsQuery,
  type DocumentItem,
} from "@/hooks/use-documents";
import {
  DocumentCategory,
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_CATEGORY_TONES,
} from "@/lib/constants";
import { TONES, toneChip } from "@/lib/tones";
import { cn } from "@/lib/utils";

type CategoryFilter = "ALL" | DocumentCategory;

export default function DocumentsPage() {
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const { data, isLoading } = useDocumentsQuery();
  const deleteDocument = useDeleteDocument();

  const all = data ?? [];
  const rows = category === "ALL" ? all : all.filter((d) => d.category === category);

  const columns: ColumnDef<DocumentItem>[] = [
    {
      accessorKey: "title",
      header: "Tài liệu",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <TitleCell
            leading={
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
                  TONES[DOCUMENT_CATEGORY_TONES[d.category]].soft,
                )}
              >
                <FileText className="size-4" />
              </span>
            }
            title={d.title}
            subtitle={d.content ? d.content.replace(/<[^>]+>/g, " ").trim() : undefined}
          />
        );
      },
    },
    {
      accessorKey: "category",
      header: "Danh mục",
      cell: ({ row }) => (
        <span className={toneChip(DOCUMENT_CATEGORY_TONES[row.original.category])}>
          {DOCUMENT_CATEGORY_LABELS[row.original.category]}
        </span>
      ),
    },
    {
      id: "file",
      header: "Đính kèm",
      cell: ({ row }) =>
        row.original.file ? (
          <a
            href={row.original.file.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-[220px] items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-xs font-medium shadow-xs hover:border-primary/40 hover:text-primary"
          >
            <Paperclip className="size-3.5 shrink-0" />
            <span className="truncate">
              {row.original.file.originalFileName ?? "Tệp đính kèm"}
            </span>
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions>
          <EditAction href={`/admin/dashboard/internal/documents/form/?id=${row.original.id}`} />
          <DeleteButton
            itemLabel={row.original.title}
            onConfirm={async () => {
              try {
                await deleteDocument.mutateAsync(row.original.id);
                toast.success("Đã xoá tài liệu");
              } catch {
                toast.error("Xoá thất bại");
              }
            }}
          />
        </RowActions>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/internal/documents"
        actions={
          <LinkButton href="/admin/dashboard/internal/documents/form/">
            <Plus />
            Thêm tài liệu
          </LinkButton>
        }
      />
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        itemLabel="tài liệu"
        rowHref={(d) => `/admin/dashboard/internal/documents/form/?id=${d.id}`}
        toolbar={
          <Segmented
            value={category}
            onChange={setCategory}
            options={[
              { value: "ALL", label: "Tất cả", count: all.length },
              ...Object.values(DocumentCategory).map((c) => ({
                value: c,
                label: DOCUMENT_CATEGORY_LABELS[c],
                count: all.filter((d) => d.category === c).length,
              })),
            ]}
          />
        }
        empty={{
          icon: FileText,
          title: "Chưa có tài liệu",
          description: "Lưu quy trình, công thức và tiêu chuẩn để cả đội cùng tra cứu.",
          action: (
            <LinkButton href="/admin/dashboard/internal/documents/form/" variant="outline">
              <Plus />
              Thêm tài liệu
            </LinkButton>
          ),
        }}
      />
    </div>
  );
}
