import type { Tone } from "./tones";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export enum ProductCategory {
  DRINK = "DRINK",
  MERCHANDISE = "MERCHANDISE",
}

export enum DrinkSubType {
  HOT = "HOT",
  ICED = "ICED",
  FRESH = "FRESH",
}

export enum MerchandiseSubType {
  NOTEBOOK = "NOTEBOOK",
  PEN = "PEN",
  TUMBLER = "TUMBLER",
  BAG = "BAG",
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.DRINK]: "Đồ uống",
  [ProductCategory.MERCHANDISE]: "Vật phẩm S.t",
};

export const DRINK_SUB_TYPE_LABELS: Record<DrinkSubType, string> = {
  [DrinkSubType.HOT]: "Nóng",
  [DrinkSubType.ICED]: "Đá / Lạnh",
  [DrinkSubType.FRESH]: "Tươi",
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

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: "Đang bán",
  [ProductStatus.INACTIVE]: "Ẩn",
};

export enum PostType {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  COMING_SOON = "COMING_SOON",
  NEW_PRODUCT = "NEW_PRODUCT",
  CULTURE_ARTICLE = "CULTURE_ARTICLE",
  GIVE_BACK = "GIVE_BACK",
  INTERNAL_UPDATE = "INTERNAL_UPDATE",
}

export const POST_TYPE_LABELS: Record<PostType, string> = {
  [PostType.ANNOUNCEMENT]: "Thông báo",
  [PostType.COMING_SOON]: "Coming Soon",
  [PostType.NEW_PRODUCT]: "Sản phẩm mới",
  [PostType.CULTURE_ARTICLE]: "Bài viết",
  [PostType.GIVE_BACK]: "Cho đi",
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

export enum DocumentCategory {
  WORKFLOW = "WORKFLOW",
  RECIPE = "RECIPE",
  QUALITY_STANDARD = "QUALITY_STANDARD",
}

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  [DocumentCategory.WORKFLOW]: "Quy trình làm việc",
  [DocumentCategory.RECIPE]: "Công thức chế biến",
  [DocumentCategory.QUALITY_STANDARD]: "Tiêu chuẩn chất lượng",
};

export const POST_TYPE_TONES: Record<PostType, Tone> = {
  [PostType.ANNOUNCEMENT]: "sky",
  [PostType.COMING_SOON]: "violet",
  [PostType.NEW_PRODUCT]: "amber",
  [PostType.CULTURE_ARTICLE]: "emerald",
  [PostType.GIVE_BACK]: "rose",
  [PostType.INTERNAL_UPDATE]: "slate",
};

export const DOCUMENT_CATEGORY_TONES: Record<DocumentCategory, Tone> = {
  [DocumentCategory.WORKFLOW]: "indigo",
  [DocumentCategory.RECIPE]: "amber",
  [DocumentCategory.QUALITY_STANDARD]: "emerald",
};
