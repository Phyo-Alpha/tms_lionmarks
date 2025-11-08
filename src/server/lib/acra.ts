import env from "@/server/config/env";
import { status } from "@/server/helpers/responseWrapper";

interface AcraErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
}

interface AcraError extends Error {
  statusCode: number;
  code?: string;
  body?: AcraErrorResponse;
}

/**
 * Make a direct ACRA API call using fetch
 * Uses application authentication (service account)
 */
export async function callAcraAPI<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const acraUrl = `${env.ACRA_API_URL}${endpoint}`;

  const headers = {
    token: env.ACRA_API_TOKEN,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(acraUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorText = "";
    let errorBody: AcraErrorResponse | null = null;

    try {
      const clone = response.clone();
      errorText = await clone.text();

      if (errorText && errorText.trim().length > 0) {
        try {
          errorBody = JSON.parse(errorText);
        } catch {
          errorBody = { message: errorText };
        }
      }
    } catch (e) {
      console.error("Failed to read error response:", e);
    }

    // Normalize error response structure
    if (!errorBody?.error) {
      if (response.status === 401) {
        errorBody = {
          error: {
            code: "Unauthorized",
            message: "Authentication failed (401)",
          },
        };
      } else {
        errorBody = {
          error: {
            code: `HTTP_${response.status}`,
            message: errorText || `ACRA API returned ${response.status} ${response.statusText}`,
          },
        };
      }
    }

    const error: AcraError = new Error(
      errorBody.error?.message || errorText || "Unknown error",
    ) as AcraError;
    error.statusCode = response.status;
    error.code = errorBody.error?.code;
    error.body = errorBody;
    throw status(error.statusCode, {
      message: errorBody.message,
      details: errorBody.error,
    });
  }

  return (await response.json()) as T;
}
