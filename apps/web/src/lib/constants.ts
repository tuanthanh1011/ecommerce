import type { Tone } from "./tones";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

// Must match the backend's MAX_UPLOAD_SIZE_BYTES default (apps/api/src/config/env.validation.ts).
// This is a client-side UX check only — the server enforces the real limit.
export const MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024;

export enum ProductCategory {
  DRINK = "DRINK",
  MERCHANDISE = "MERCHANDISE",
}

export enum DrinkSubType {
  MILK_TEA = "MILK_TEA",
  NEW = "NEW",
  TEA = "TEA",
  SPECIAL = "SPECIAL",
  COFFEE = "COFFEE",
  FRUIT = "FRUIT",
  TOPPING = "TOPPING",
}

export enum MerchandiseSubType {
  NOTEBOOK = "NOTEBOOK",
  PEN = "PEN",
  TUMBLER = "TUMBLER",
  BAG = "BAG",
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.DRINK]: "Đồ uống",
  [ProductCategory.MERCHANDISE]: "Vật phẩm S+",
};

export const DRINK_SUB_TYPE_LABELS: Record<DrinkSubType, string> = {
  [DrinkSubType.MILK_TEA]: "Trà sữa Việt",
  [DrinkSubType.NEW]: "Món mới",
  [DrinkSubType.TEA]: "Trà",
  [DrinkSubType.SPECIAL]: "Đặc biệt",
  [DrinkSubType.COFFEE]: "Cà phê",
  [DrinkSubType.FRUIT]: "Nước hoa quả",
  [DrinkSubType.TOPPING]: "Topping",
};

export const MERCHANDISE_SUB_TYPE_LABELS: Record<MerchandiseSubType, string> = {
  [MerchandiseSubType.NOTEBOOK]: "Sổ tay",
  [MerchandiseSubType.PEN]: "Bút",
  [MerchandiseSubType.TUMBLER]: "Bình giữ nhiệt",
  [MerchandiseSubType.BAG]: "Túi",
};

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum PostType {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  COMING_SOON = "COMING_SOON",
  NEW_PRODUCT = "NEW_PRODUCT",
  CULTURE_ARTICLE = "CULTURE_ARTICLE",
  INTERNAL_UPDATE = "INTERNAL_UPDATE",
}

export const POST_TYPE_LABELS: Record<PostType, string> = {
  [PostType.ANNOUNCEMENT]: "Thông báo",
  [PostType.COMING_SOON]: "Coming Soon",
  [PostType.NEW_PRODUCT]: "Sản phẩm mới",
  [PostType.CULTURE_ARTICLE]: "Bài viết",
  [PostType.INTERNAL_UPDATE]: "Cập nhật nội bộ",
};

export enum JobStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum TeamMemberGroup {
  CORE_TEAM = "CORE_TEAM",
  ADVISORY_BOARD = "ADVISORY_BOARD",
}

export const TEAM_MEMBER_GROUP_LABELS: Record<TeamMemberGroup, string> = {
  [TeamMemberGroup.CORE_TEAM]: "Đội ngũ cốt lõi",
  [TeamMemberGroup.ADVISORY_BOARD]: "Đội ngũ cố vấn",
};

export const POST_TYPE_TONES: Record<PostType, Tone> = {
  [PostType.ANNOUNCEMENT]: "sky",
  [PostType.COMING_SOON]: "violet",
  [PostType.NEW_PRODUCT]: "amber",
  [PostType.CULTURE_ARTICLE]: "emerald",
  [PostType.INTERNAL_UPDATE]: "slate",
};

export enum AdminRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  [AdminRole.ADMIN]: "Quản trị viên",
  [AdminRole.EMPLOYEE]: "Nhân viên",
};
