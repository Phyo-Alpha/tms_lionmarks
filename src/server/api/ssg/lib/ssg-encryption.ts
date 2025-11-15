import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const IV = "SSGAPIInitVector";
const ENCRYPTION_KEY_PATH = path.join(
  process.cwd(),
  "src",
  "server",
  "cert_keys",
  "encryption",
  "key.txt",
);

let cachedEncryptionKey: Buffer | null = null;

/**
 * Loads the encryption key from the key.txt file
 * Caches the key in memory for subsequent calls
 */
function getEncryptionKey(): Buffer {
  if (cachedEncryptionKey) {
    return cachedEncryptionKey;
  }

  if (!fs.existsSync(ENCRYPTION_KEY_PATH)) {
    throw new Error(`Encryption key not found at: ${ENCRYPTION_KEY_PATH}`);
  }

  const keyBase64 = fs.readFileSync(ENCRYPTION_KEY_PATH, "utf-8").trim();
  cachedEncryptionKey = Buffer.from(keyBase64, "base64");

  return cachedEncryptionKey;
}

/**
 * Encrypts a payload using AES-256-CBC encryption
 * Matches the encryption method used by SSG API
 * @param payload - The data to encrypt (object will be JSON stringified)
 * @returns Base64 encoded encrypted string
 */
export function encryptSSGPayload(payload: unknown): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(IV, "utf-8");

  const plaintext = typeof payload === "string" ? payload : JSON.stringify(payload);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  cipher.setAutoPadding(true);

  let encrypted = cipher.update(plaintext, "utf-8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
}

/**
 * Decrypts an encrypted payload using AES-256-CBC decryption
 * Matches the decryption method used by SSG API
 * @param encryptedPayload - Base64 encoded encrypted string
 * @returns Decrypted JSON string
 */
export function decryptSSGPayload(encryptedPayload: string): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(IV, "utf-8");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  decipher.setAutoPadding(true);

  let decrypted = decipher.update(encryptedPayload, "base64", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}

/**
 * Clears the cached encryption key
 * Useful for testing or when the key needs to be reloaded
 */
export function clearEncryptionKeyCache(): void {
  cachedEncryptionKey = null;
}
