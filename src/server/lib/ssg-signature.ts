import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import env from "@/server/config/env";

interface SignaturePayload {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  queryParams?: Record<string, string | string[]>;
  body?: unknown;
  timestamp?: string;
}

interface SignatureHeaders {
  signature: string;
  timestamp: string;
}

/**
 * SSG TPGateway API Digital Signature Utility
 *
 * Implements RSA-SHA256 signature generation for SSG APIs as per
 * TPGateway API documentation requirements.
 */
export class SSGSignature {
  private static privateKey: string | null = null;

  /**
   * Loads the private key from file system
   */
  private static getPrivateKey(): string {
    if (this.privateKey) {
      return this.privateKey;
    }

    const privateKeyPath = env.SSG_PRIVATE_KEY_PATH || path.join(process.cwd(), "private.pem");

    if (!fs.existsSync(privateKeyPath)) {
      throw new Error(`Private key not found at: ${privateKeyPath}`);
    }

    this.privateKey = fs.readFileSync(privateKeyPath, "utf-8");
    return this.privateKey;
  }

  /**
   * Generates ISO 8601 timestamp in UTC format
   * Format: YYYY-MM-DDTHH:mm:ss.sssZ
   */
  static generateTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Sorts and serializes query parameters
   */
  private static serializeQueryParams(params?: Record<string, string | string[]>): string {
    if (!params || Object.keys(params).length === 0) {
      return "";
    }

    const sortedKeys = Object.keys(params).sort();
    const queryPairs: string[] = [];

    for (const key of sortedKeys) {
      const value = params[key];
      if (Array.isArray(value)) {
        // Handle array values (e.g., ?tag=a&tag=b)
        for (const v of value.sort()) {
          queryPairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
        }
      } else if (value !== undefined && value !== null) {
        queryPairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }

    return queryPairs.length > 0 ? `?${queryPairs.join("&")}` : "";
  }

  /**
   * Serializes request body to string
   */
  private static serializeBody(body?: unknown): string {
    if (!body) {
      return "";
    }

    if (typeof body === "string") {
      return body;
    }

    // For objects/arrays, use JSON.stringify without spaces
    return JSON.stringify(body);
  }

  /**
   * Constructs the signature base string according to SSG TPGateway specification
   * Format: {METHOD}{PATH}{QUERY_STRING}{BODY}{TIMESTAMP}
   */
  private static constructSignatureBaseString(payload: SignaturePayload): string {
    const {
      method,
      path,
      queryParams,
      body,
      timestamp,
    } = payload;

    const queryString = this.serializeQueryParams(queryParams);
    const bodyString = this.serializeBody(body);
    const timestampString = timestamp || this.generateTimestamp();

    // Construct base string: METHOD + PATH + QUERY + BODY + TIMESTAMP
    const baseString = `${method}${path}${queryString}${bodyString}${timestampString}`;

    console.log("Signature Base String:", baseString);
    return baseString;
  }

  /**
   * Generates RSA-SHA256 digital signature
   */
  static generateSignature(payload: SignaturePayload): SignatureHeaders {
    const privateKey = this.getPrivateKey();
    const timestamp = payload.timestamp || this.generateTimestamp();

    // Ensure timestamp is included in the payload
    const payloadWithTimestamp = { ...payload, timestamp };

    // Construct the signature base string
    const baseString = this.constructSignatureBaseString(payloadWithTimestamp);

    // Create signature using RSA-SHA256
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(baseString, "utf-8");
    const signature = sign.sign(privateKey, "base64");

    return {
      signature,
      timestamp,
    };
  }

  /**
   * Verifies a signature using the public key (for testing purposes)
   */
  static verifySignature(
    payload: SignaturePayload,
    signature: string,
    publicKeyPath?: string,
  ): boolean {
    try {
      const pubKeyPath = publicKeyPath || env.SSG_PUBLIC_KEY_PATH || path.join(process.cwd(), "public.pem");

      if (!fs.existsSync(pubKeyPath)) {
        throw new Error(`Public key not found at: ${pubKeyPath}`);
      }

      const publicKey = fs.readFileSync(pubKeyPath, "utf-8");
      const baseString = this.constructSignatureBaseString(payload);

      const verify = crypto.createVerify("RSA-SHA256");
      verify.update(baseString, "utf-8");

      return verify.verify(publicKey, signature, "base64");
    } catch (error) {
      console.error("Signature verification error:", error);
      return false;
    }
  }

  /**
   * Creates complete headers object for SSG API request
   */
  static createAuthHeaders(payload: SignaturePayload): Record<string, string> {
    const { signature, timestamp } = this.generateSignature(payload);

    return {
      "X-Signature": signature,
      "X-Timestamp": timestamp,
      "X-API-Key": env.SSG_API_KEY || "",
      "Content-Type": "application/json",
    };
  }
}

/**
 * Convenience function for making authenticated SSG API calls
 */
export async function callSSGAPI<T = unknown>(
  endpoint: string,
  options: RequestInit & {
    queryParams?: Record<string, string | string[]>;
  } = {},
): Promise<T> {
  if (!env.SSG_API_URL) {
    throw new Error("SSG_API_URL environment variable is not set");
  }

  const method = (options.method || "GET").toUpperCase() as SignaturePayload["method"];
  const url = new URL(endpoint, env.SSG_API_URL);
  const path = url.pathname;

  // Parse body if present
  let body: unknown = undefined;
  if (options.body) {
    try {
      body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
    } catch {
      body = options.body;
    }
  }

  // Generate signature headers
  const authHeaders = SSGSignature.createAuthHeaders({
    method,
    path,
    queryParams: options.queryParams,
    body,
  });

  // Merge headers
  const headers = {
    ...authHeaders,
    ...options.headers,
  };

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

  const response = await fetch(url.toString(), {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorBody;

    try {
      errorBody = JSON.parse(errorText);
    } catch {
      errorBody = { message: errorText };
    }

    throw new Error(
      `SSG API Error (${response.status}): ${errorBody.message || errorText}`,
    );
  }

  return (await response.json()) as T;
}
