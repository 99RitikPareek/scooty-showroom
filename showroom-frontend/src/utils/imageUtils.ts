export const getImageUrl = (url?: string | null): string => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
  const baseUrl = apiBase.replace(/\/api\/?$/, "");

  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};
