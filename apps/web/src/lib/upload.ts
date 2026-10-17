import { apiClient } from "./api-client";
import { MAX_UPLOAD_SIZE_BYTES } from "./constants";

export interface MediaRecord {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  originalFileName: string | null;
}

interface PresignResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export async function uploadFile(file: File): Promise<MediaRecord> {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    const maxMb = (MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)).toFixed(0);
    throw new Error(`Kích thước file vượt quá giới hạn cho phép (tối đa ${maxMb}MB)`);
  }

  const presign = await apiClient.post<PresignResponse>("/admin/media/presign", {
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
  });

  const putRes = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error("Tải file lên thất bại");
  }

  return apiClient.post<MediaRecord>("/admin/media", {
    key: presign.key,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    originalFileName: file.name,
  });
}
