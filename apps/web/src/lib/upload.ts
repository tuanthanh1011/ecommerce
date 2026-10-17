import { apiClient } from "./api-client";
import { MAX_UPLOAD_SIZE_BYTES } from "./constants";

export interface MediaRecord {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  originalFileName: string | null;
}

export async function uploadFile(file: File): Promise<MediaRecord> {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    const maxMb = (MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)).toFixed(0);
    throw new Error(`Kích thước file vượt quá giới hạn cho phép (tối đa ${maxMb}MB)`);
  }

  // The API stores the file in Garage and returns the media record.
  const form = new FormData();
  form.append("file", file);
  return apiClient.post<MediaRecord>("/admin/media/upload", form);
}
