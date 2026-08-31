import type { AxiosError } from "axios";

export function getErrorMessage(err: unknown, fallbackMessage = "An unexpected error occurred."): string {
  if (!err) return fallbackMessage;

  const axiosError = err as AxiosError<{
    message?: string;
    error?: string;
    status?: number;
    validationErrors?: Record<string, string>;
  }>;

  if (axiosError.response) {
    const status = axiosError.response.status;
    const data = axiosError.response.data;

    // Detailed backend validation messages
    if (status === 400) {
      if (data?.validationErrors && Object.keys(data.validationErrors).length > 0) {
        const details = Object.entries(data.validationErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(", ");
        return `Validation failed (${details})`;
      }
      return data?.message || data?.error || "Bad Request (400): Invalid request payload or parameters.";
    }

    if (status === 401) {
      return data?.message || "Authentication failed (401): Session expired or invalid token.";
    }

    if (status === 403) {
      return data?.message || "Access denied (403): You do not have permission to perform this action.";
    }

    if (status === 404) {
      return data?.message || "Resource not found (404).";
    }

    if (status === 500) {
      return data?.message || "Server Error (500): Internal backend exception.";
    }

    if (data?.message) {
      return data.message;
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallbackMessage;
}
