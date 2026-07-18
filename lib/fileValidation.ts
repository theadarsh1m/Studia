export const MAX_FILE_SIZE_MB = 15;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_MIME_TYPE = "application/pdf";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function validatePdfFile(file: File): string | null {
  if (file.type !== ALLOWED_MIME_TYPE) {
    return "Only PDF files are supported.";
  }
  if (file.size === 0) {
    return "The selected file is empty.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`;
  }
  return null;
}
