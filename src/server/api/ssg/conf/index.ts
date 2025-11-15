import path from "node:path";
import fs from "node:fs";

export abstract class ConfigSSGService {
  private static certificates: Map<string, string> | null = null;
  private static readonly certKeysPath = path.join(process.cwd(), "src", "server", "cert_keys");

  /**
   * Load all .pem files from the cert_keys directory and store them in a map. Cache them in memory for subsequent calls.
   */
  private static loadCertificates() {
    if (this.certificates) return this.certificates;

    this.certificates = new Map<string, string>();

    if (!fs.existsSync(this.certKeysPath)) {
      throw new Error(`Certificate keys directory not found at: ${this.certKeysPath}`);
    }

    this.scanCertKeysDirectory(this.certKeysPath, this.certificates);

    return this.certificates;
  }

  /**
   * Recursively search the cert_keys directory for all .pem files and store them in the map.
   */
  private static scanCertKeysDirectory(dir: string, certificates: Map<string, string>) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        this.scanCertKeysDirectory(fullPath, certificates);
      } else if (file.isFile() && file.name.endsWith(".pem")) {
        const relativePath = path.relative(this.certKeysPath, fullPath);
        const key = relativePath.replace(/\\/g, "/").replace(/\.pem$/, "");
        const content = fs.readFileSync(fullPath, "utf-8");
        certificates.set(key, content);
      }
    }
  }

  /**
   * Gets a certificate by its relative path (without .pem extension)
   * Example: "credentials/client-cert" for "cert_keys/credentials/client-cert.pem"
   */
  static getCertificate(key: string): string {
    const certificates = this.loadCertificates();
    const cert = certificates.get(key);

    if (!cert) {
      throw new Error(
        `Certificate not found: ${key}. Available keys: ${Array.from(certificates.keys()).join(", ")}`,
      );
    }

    return cert;
  }

  /**
   * Gets all loaded certificates
   */
  static getAllCertificates(): Map<string, string> {
    return this.loadCertificates();
  }

  /**
   * Gets a certificate by full path within cert_keys folder
   * Example: "credentials/client-cert.pem"
   */
  static getCertificateByPath(filePath: string): string {
    const key = filePath.replace(/\.pem$/, "");
    return this.getCertificate(key);
  }

  /**
   * Clears the certificate cache
   */
  static clear(): void {
    this.certificates = null;
  }
}
