"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  type LucideIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  /** Left side of the header bar — search, filters */
  toolbar?: React.ReactNode;
  /** Total shown in the header bar, defaults to data.length */
  total?: number;
  /** Unit for the counter, e.g. "sản phẩm" */
  itemLabel?: string;
  /** Makes the whole row a link to this href (buttons/links inside still work) */
  rowHref?: (row: TData) => string;
  pageSize?: number;
  empty?: {
    icon?: LucideIcon;
    title?: string;
    description?: string;
    action?: React.ReactNode;
  };
  className?: string;
}

/** Compact page list: 1 … 4 5 6 … 12 */
function pageWindow(current: number, count: number): (number | "gap")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i);
  const pages = new Set([0, count - 1, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 0 && p < count).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  toolbar,
  total,
  itemLabel = "mục",
  rowHref,
  pageSize = 10,
  empty,
  className,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const count = total ?? data.length;
  const rows = table.getRowModel().rows;
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const from = data.length === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, data.length);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgb(28_25_23/0.04)]",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b bg-linear-to-b from-muted/30 to-transparent px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">{toolbar}</div>
        <p className="shrink-0 text-xs text-muted-foreground">
          {isLoading ? (
            "Đang tải..."
          ) : (
            <>
              <span className="font-semibold text-foreground tabular-nums">{count}</span>{" "}
              {itemLabel}
            </>
          )}
        </p>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b bg-muted/40 hover:bg-muted/40">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort() && !!header.column.columnDef.header;
                const sorted = header.column.getIsSorted();
                const label = header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext());
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
                    }
                    className="h-10 px-4 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase"
                  >
                    {canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          "-ml-1.5 inline-flex items-center gap-1 rounded px-1.5 py-1 uppercase transition-colors hover:bg-muted hover:text-foreground",
                          sorted && "text-foreground",
                        )}
                      >
                        {label}
                        {sorted === "asc" ? (
                          <ArrowUp className="size-3 text-amber-600" />
                        ) : sorted === "desc" ? (
                          <ArrowDown className="size-3 text-amber-600" />
                        ) : (
                          <ChevronsUpDown className="size-3 opacity-40" />
                        )}
                      </button>
                    ) : (
                      label
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {columns.map((_, j) => (
                  <TableCell key={j} className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {j === 0 && <div className="size-10 shrink-0 animate-pulse rounded-lg bg-muted" />}
                      <div
                        className="h-3.5 animate-pulse rounded bg-muted"
                        style={{ width: j === 0 ? "60%" : `${40 + ((i + j) % 3) * 15}%` }}
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length ? (
            rows.map((row) => {
              const href = rowHref?.(row.original);
              return (
                <TableRow
                  key={row.id}
                  onClick={
                    href
                      ? (e) => {
                          const target = e.target as HTMLElement;
                          // Ignore clicks from portaled dialogs and from inner controls.
                          if (!e.currentTarget.contains(target)) return;
                          if (target.closest("a,button,input,[role=dialog]")) return;
                          router.push(href);
                        }
                      : undefined
                  }
                  className={cn(
                    "group/row border-border/70 transition-colors hover:bg-amber-50/50 dark:hover:bg-amber-500/4",
                    href && "cursor-pointer",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 text-foreground/85">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                <EmptyState
                  icon={empty?.icon}
                  title={empty?.title ?? "Chưa có dữ liệu"}
                  description={empty?.description}
                  action={empty?.action}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Footer / pagination */}
      {!isLoading && data.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t bg-muted/20 px-4 py-2.5 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Hiển thị{" "}
            <span className="font-medium text-foreground tabular-nums">
              {from}–{to}
            </span>{" "}
            trên <span className="font-medium text-foreground tabular-nums">{data.length}</span>
          </p>
          {pageCount > 1 && (
            <nav aria-label="Phân trang" className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Trang trước"
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground hover:shadow-xs disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              {pageWindow(pageIndex, pageCount).map((p, i) =>
                p === "gap" ? (
                  <span key={`gap-${i}`} className="px-1 text-xs text-muted-foreground">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => table.setPageIndex(p)}
                    aria-current={p === pageIndex ? "page" : undefined}
                    className={cn(
                      "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium tabular-nums transition-colors",
                      p === pageIndex
                        ? "bg-stone-900 text-white shadow-sm dark:bg-amber-400 dark:text-stone-950"
                        : "text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-xs",
                    )}
                  >
                    {p + 1}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Trang sau"
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground hover:shadow-xs disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
