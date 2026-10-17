"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { KeyRound, Lock, LockOpen, Plus, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { RowActions } from "@/components/common/row-actions";
import { DeleteButton } from "@/components/common/confirm-dialog";
import {
  useAdminsQuery,
  useDeactivateAdmin,
  useUnlockAdmin,
  type AdminAccount,
} from "@/hooks/use-admins";
import { useCurrentAdmin } from "@/hooks/use-auth";
import { ADMIN_ROLE_LABELS, AdminRole } from "@/lib/constants";
import { formatDateTime, initials } from "@/lib/format";

/** Login is temporarily blocked after too many wrong passwords. */
const isLoginLocked = (a: AdminAccount) =>
  !!a.lockedUntil && new Date(a.lockedUntil).getTime() > Date.now();

export default function AdminsPage() {
  const { data, isLoading } = useAdminsQuery();
  const deactivateAdmin = useDeactivateAdmin();
  const unlockAdmin = useUnlockAdmin();
  const { data: me } = useCurrentAdmin();

  const all = data ?? [];
  const activeCount = all.filter((a) => a.isActive).length;

  const columns: ColumnDef<AdminAccount>[] = [
    {
      accessorKey: "fullName",
      header: "Thành viên",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback
              className={
                row.original.isActive
                  ? "bg-linear-to-br from-amber-400 to-orange-600 text-xs font-semibold text-white"
                  : "bg-muted text-xs font-semibold text-muted-foreground"
              }
            >
              {initials(row.original.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{row.original.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      meta: { hideBelow: "sm" },
      header: "Vai trò",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1.5 text-[13px]">
          <ShieldCheck
            className={
              row.original.role === AdminRole.ADMIN
                ? "size-3.5 text-amber-600"
                : "size-3.5 text-muted-foreground"
            }
          />
          {ADMIN_ROLE_LABELS[row.original.role]}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      meta: { hideBelow: "md" },
      header: "Trạng thái",
      cell: ({ row }) => (
        <div className="flex flex-col items-start gap-1">
          <StatusBadge tone={row.original.isActive ? "success" : "danger"}>
            {row.original.isActive ? "Hoạt động" : "Đã khoá"}
          </StatusBadge>
          {row.original.isActive && isLoginLocked(row.original) && (
            <StatusBadge tone="warning">
              Tạm khoá đến {formatDateTime(row.original.lockedUntil)}
            </StatusBadge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions>
          {row.original.isActive && isLoginLocked(row.original) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-700 hover:text-amber-800"
              disabled={unlockAdmin.isPending}
              onClick={async () => {
                try {
                  await unlockAdmin.mutateAsync(row.original.id);
                  toast.success("Đã mở khoá đăng nhập");
                } catch {
                  toast.error("Thao tác thất bại");
                }
              }}
            >
              <LockOpen />
              Mở khoá
            </Button>
          )}
          <LinkButton
            href={`/admin/dashboard/admins/form/?id=${row.original.id}`}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <KeyRound />
            Đổi mật khẩu
          </LinkButton>
          {row.original.isActive &&
            row.original.role === AdminRole.EMPLOYEE &&
            row.original.id !== me?.id && (
            <DeleteButton
              itemLabel={row.original.email}
              title="Khoá tài khoản?"
              description={
                <>
                  <span className="font-medium text-foreground">{row.original.email}</span>{" "}
                  sẽ không thể đăng nhập CMS cho tới khi được mở lại.
                </>
              }
              onConfirm={async () => {
                try {
                  await deactivateAdmin.mutateAsync(row.original.id);
                  toast.success("Đã khoá tài khoản");
                } catch {
                  toast.error("Thao tác thất bại");
                }
              }}
            >
              <Lock />
              Khoá
            </DeleteButton>
          )}
        </RowActions>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        module="/admin/dashboard/admins"
        actions={
          <LinkButton href="/admin/dashboard/admins/form/">
            <Plus />
            Thêm admin
          </LinkButton>
        }
      />
      <DataTable
        columns={columns}
        data={all}
        isLoading={isLoading}
        itemLabel={`tài khoản · ${activeCount} đang hoạt động`}
        rowHref={(a) => `/admin/dashboard/admins/form/?id=${a.id}`}
        toolbar={
          <p className="text-[13px] text-muted-foreground">
            Mọi admin đều có quyền chỉnh sửa toàn bộ nội dung.
          </p>
        }
        empty={{ icon: Users, title: "Chưa có tài khoản" }}
      />
    </div>
  );
}
