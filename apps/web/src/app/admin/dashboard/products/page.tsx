"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Coffee, Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { Segmented } from "@/components/common/segmented";
import { StatusBadge } from "@/components/common/status-badge";
import { Thumb, TitleCell } from "@/components/common/thumb";
import { EditAction, RowActions } from "@/components/common/row-actions";
import { DeleteButton } from "@/components/common/confirm-dialog";
import {
  useDeleteProduct,
  useProductsQuery,
  type Product,
} from "@/hooks/use-products";
import {
  DRINK_SUB_TYPE_LABELS,
  MERCHANDISE_SUB_TYPE_LABELS,
  PRODUCT_CATEGORY_LABELS,
  ProductCategory,
} from "@/lib/constants";
import { toneChip } from "@/lib/tones";
import { formatPrice } from "@/lib/format";

type CategoryFilter = "ALL" | ProductCategory;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const { data, isLoading } = useProductsQuery(search);
  const deleteProduct = useDeleteProduct();

  const all = data?.data ?? [];
  const rows = category === "ALL" ? all : all.filter((p) => p.category === category);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Sản phẩm",
      cell: ({ row }) => {
        const p = row.original;
        const sub = p.drinkSubType
          ? DRINK_SUB_TYPE_LABELS[p.drinkSubType]
          : p.merchandiseSubType
            ? MERCHANDISE_SUB_TYPE_LABELS[p.merchandiseSubType]
            : undefined;
        const cover = [...p.photos].sort((a, b) => a.sortOrder - b.sortOrder)[0];
        return (
          <TitleCell
            leading={<Thumb src={cover?.media.url} icon={Coffee} />}
            title={p.name}
            subtitle={sub ?? p.description ?? undefined}
          />
        );
      },
    },
    {
      accessorKey: "category",
      header: "Danh mục",
      cell: ({ row }) => (
        <span
          className={toneChip(
            row.original.category === ProductCategory.DRINK ? "amber" : "violet",
          )}
        >
          {PRODUCT_CATEGORY_LABELS[row.original.category]}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => (
        <span className="font-medium text-foreground tabular-nums">
          {formatPrice(row.original.price)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <StatusBadge tone={row.original.status === "ACTIVE" ? "success" : "neutral"}>
          {row.original.status === "ACTIVE" ? "Đang bán" : "Ẩn"}
        </StatusBadge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions>
          <EditAction href={`/admin/dashboard/products/form/?id=${row.original.id}`} />
          <DeleteButton
            itemLabel={row.original.name}
            onConfirm={async () => {
              try {
                await deleteProduct.mutateAsync(row.original.id);
                toast.success("Đã xoá sản phẩm");
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
        module="/admin/dashboard/products"
        actions={
          <LinkButton href="/admin/dashboard/products/form/">
            <Plus />
            Thêm sản phẩm
          </LinkButton>
        }
      />
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading}
        itemLabel="sản phẩm"
        rowHref={(p) => `/admin/dashboard/products/form/?id=${p.id}`}
        toolbar={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên sản phẩm..." />
            <Segmented
              value={category}
              onChange={setCategory}
              options={[
                { value: "ALL", label: "Tất cả", count: all.length },
                {
                  value: ProductCategory.DRINK,
                  label: "Đồ uống",
                  count: all.filter((p) => p.category === ProductCategory.DRINK).length,
                },
                {
                  value: ProductCategory.MERCHANDISE,
                  label: "Vật phẩm",
                  count: all.filter((p) => p.category === ProductCategory.MERCHANDISE).length,
                },
              ]}
            />
          </>
        }
        empty={{
          icon: Coffee,
          title: search ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm nào",
          description: search
            ? "Thử từ khoá khác hoặc xoá bộ lọc."
            : "Thêm đồ uống hoặc vật phẩm đầu tiên để hiển thị trên website.",
          action: !search && (
            <LinkButton href="/admin/dashboard/products/form/" variant="outline">
              <Plus />
              Thêm sản phẩm
            </LinkButton>
          ),
        }}
      />
    </div>
  );
}
