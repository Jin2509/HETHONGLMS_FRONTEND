import apiClient from "./client";

function getFilenameFromDisposition(disposition?: string): string | null {
  if (!disposition) return null;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].replace(/"/g, ""));
  }

  const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
  return asciiMatch?.[1] || null;
}

function uniqueUrls(urls: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  return urls
    .map((url) => url?.trim())
    .filter((url): url is string => Boolean(url))
    .filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}

function getApiOrigin(): string {
  const baseUrl = apiClient.defaults.baseURL || window.location.origin;
  return new URL(baseUrl, window.location.origin).origin;
}

function toAbsoluteApiUrl(path: string): string {
  return new URL(path, getApiOrigin()).toString();
}

function getFilePathFromStoredUrl(storedUrl: string): string | null {
  if (/^https?:\/\//i.test(storedUrl)) {
    const parsedUrl = new URL(storedUrl);
    return getFilePathFromStoredUrl(parsedUrl.pathname);
  }

  const cleanUrl = storedUrl.trim().replace(/^\/+/, "");
  if (cleanUrl.startsWith("api/files/")) return cleanUrl.slice("api/files/".length);
  if (cleanUrl.startsWith("files/")) return cleanUrl.slice("files/".length);
  if (cleanUrl.startsWith("uploads/")) return cleanUrl.slice("uploads/".length);
  return cleanUrl || null;
}

function buildStoredFileUrls(storedUrl?: string): string[] {
  if (!storedUrl) return [];

  const urls = [storedUrl];
  const filePath = getFilePathFromStoredUrl(storedUrl);

  if (storedUrl.startsWith("/api/files/")) {
    urls.push(toAbsoluteApiUrl(storedUrl));
  }

  if (storedUrl.startsWith("/files/")) {
    urls.push(toAbsoluteApiUrl(storedUrl));
    if (filePath) {
      urls.push(toAbsoluteApiUrl(`/api/files/${filePath}`));
    }
  }

  if (filePath && !/^https?:\/\//i.test(storedUrl)) {
    urls.push(toAbsoluteApiUrl(`/api/files/${filePath}`));
    urls.push(toAbsoluteApiUrl(`/files/${filePath}`));
  }

  return uniqueUrls(urls);
}

export async function downloadFile(url: string | string[], fallbackName: string): Promise<void> {
  const urls = uniqueUrls(Array.isArray(url) ? url : [url]);
  let lastError: unknown;

  for (const downloadUrl of urls) {
    try {
      const response = await apiClient.get<Blob>(downloadUrl, {
        responseType: "blob",
        headers: { Accept: "application/octet-stream" },
      });
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      const filename = getFilenameFromDisposition(response.headers["content-disposition"]) || fallbackName;

      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function buildDownloadUrls(primaryUrl: string, storedUrl?: string): string[] {
  return uniqueUrls([...buildStoredFileUrls(storedUrl), primaryUrl]);
}
