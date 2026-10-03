import { apiClient } from "./api-client";

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
    throw new Error("Tải file lên R2 thất bại");
  }

  return apiClient.post<MediaRecord>("/admin/media", {
    key: presign.key,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    originalFileName: file.name,
  });
}
