import https from "node:https";
import { ConfigSSGService } from "@/server/api/ssg/conf";
import env from "@/server/config/env";

interface SSGTLSRequestOptions extends Omit<RequestInit, "body"> {
  queryParams?: Record<string, string | string[]>;
  body?: unknown;
  returnRawResponse?: boolean;
}

/**
 * Makes an HTTPS request to SSG API with TLS client certificate authentication
 * Uses client certificate and key from cert_keys folder
 */
export async function callSSGAPIWithTLS<T = unknown>(
  endpoint: string,
  options: SSGTLSRequestOptions = {},
): Promise<T> {
  if (!env.SSG_API_URL) {
    throw new Error("SSG_API_URL environment variable is not set");
  }

  const method = (options.method || "GET").toUpperCase();
  const baseUrl = env.SSG_API_URL.replace(/\/$/, "");
  const url = new URL(endpoint, baseUrl);

  // Add query params to URL if present
  if (options.queryParams) {
    for (const [key, value] of Object.entries(options.queryParams)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          url.searchParams.append(key, v);
        }
      } else {
        url.searchParams.set(key, value);
      }
    }
  }

  // Load client certificate and key
  const clientCert = ConfigSSGService.getCertificate("credentials/cert");
  const clientKey = ConfigSSGService.getCertificate("credentials/key");

  // Create HTTPS agent with client certificate
  const agent = new https.Agent({
    cert: clientCert,
    key: clientKey,
    rejectUnauthorized: true,
  });

  // Prepare request body
  let body: string | undefined;
  if (options.body !== undefined) {
    body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  return new Promise<T>((resolve, reject) => {
    const requestOptions: https.RequestOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method,
      headers,
      agent,
    };

    // console.log("Debug Options");
    // console.log(requestOptions);

    const req = https.request(requestOptions, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          let errorBody;
          try {
            errorBody = JSON.parse(data);
          } catch {
            errorBody = { message: data };
          }

          const error = new Error(
            `SSG API Error (${res.statusCode}): ${errorBody.message || data}`,
          ) as Error & { statusCode?: number; body?: unknown };
          error.statusCode = res.statusCode;
          error.body = errorBody;
          reject(error);
          return;
        }

        if (options.returnRawResponse) {
          resolve(data as T);
          return;
        }

        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve(jsonData as T);
        } catch (error) {
          reject(
            new Error(
              `Failed to parse response: ${error instanceof Error ? error.message : String(error)}`,
            ),
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    if (body) {
      req.write(body);
    }

    req.end();
  });
}
