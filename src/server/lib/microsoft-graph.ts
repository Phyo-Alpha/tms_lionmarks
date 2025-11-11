import env from "@/server/config/env";

// Cache for application access token
let cachedToken: {
  accessToken: string;
  expiresAt: Date;
} | null = null;

/**
 * Clear the cached token (useful for debugging permission issues)
 */
export function clearTokenCache(): void {
  cachedToken = null;
  console.log("Token cache cleared");
}

/**
 * Decode JWT token to inspect its contents
 */
function decodeToken(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(Buffer.from(paddedPayload, "base64").toString("utf-8"));
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

/**
 * Check if an email is likely a personal Microsoft account
 * Personal accounts typically use domains like: outlook.com, hotmail.com, live.com, msn.com, gmail.com
 * Work/school accounts use custom domains managed by Azure AD
 */
function isLikelyPersonalAccount(email: string): boolean {
  const personalDomains = [
    "@outlook.com",
    "@hotmail.com",
    "@live.com",
    "@msn.com",
    "@gmail.com",
    "@yahoo.com",
    "@icloud.com",
    "@aol.com",
  ];
  const emailLower = email.toLowerCase();
  return personalDomains.some((domain) => emailLower.endsWith(domain));
}

/**
 * Extract user email from Microsoft Graph API endpoint
 * Examples:
 * - /users/user@domain.com/calendar/events -> user@domain.com
 * - /users/user%40domain.com/calendar/events -> user@domain.com (URL encoded)
 */
function extractUserEmailFromEndpoint(endpoint: string): string | null {
  const match = endpoint.match(/\/users\/([^/]+)/);
  if (match) {
    // Decode URL-encoded email (e.g., user%40domain.com -> user@domain.com)
    return decodeURIComponent(match[1]);
  }
  return null;
}

/**
 * Get Microsoft Graph access token using Client Credentials flow
 * This uses application authentication (service account) instead of delegated auth
 */
export async function getMicrosoftGraphApplicationToken(): Promise<string> {
  if (!env.MICROSOFT_GRAPH_TENANT_ID) {
    throw new Error("MICROSOFT_GRAPH_TENANT_ID environment variable is not set");
  }
  if (!env.MICROSOFT_GRAPH_CLIENT_ID) {
    throw new Error("MICROSOFT_GRAPH_CLIENT_ID environment variable is not set");
  }
  if (!env.MICROSOFT_GRAPH_CLIENT_SECRET) {
    throw new Error("MICROSOFT_GRAPH_CLIENT_SECRET environment variable is not set");
  }
  // Check if cached token is still valid (with 5 minute buffer)
  if (cachedToken && cachedToken.expiresAt > new Date(Date.now() + 5 * 60 * 1000)) {
    return cachedToken.accessToken;
  }

  const tokenEndpoint = `https://login.microsoftonline.com/${env.MICROSOFT_GRAPH_TENANT_ID}/oauth2/v2.0/token`;

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.MICROSOFT_GRAPH_CLIENT_ID,
      client_secret: env.MICROSOFT_GRAPH_CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "https://graph.microsoft.com/.default",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Token request failed:", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    throw new Error(
      `Failed to get application token: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const tokenData = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  // Decode and log token contents for debugging
  const decoded = decodeToken(tokenData.access_token);
  if (decoded) {
    console.log("=== Token Contents ===");
    console.log("- Audience (aud):", decoded.aud);
    console.log("- App ID (appid):", decoded.appid);
    console.log("- Roles:", decoded.roles || "No roles found");
    console.log("- Scopes:", decoded.scp || "No scopes found");
    console.log("- Issuer:", decoded.iss);
    console.log("- Expires:", decoded.exp ? new Date(decoded.exp * 1000).toISOString() : "Unknown");
    console.log("=====================");
  } else {
    console.warn("Could not decode token for inspection");
  }

  // Cache the token
  cachedToken = {
    accessToken: tokenData.access_token,
    expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
  };

  return tokenData.access_token;
}

/**
 * Make a direct Microsoft Graph API call using fetch
 * Uses application authentication (service account)
 */
export async function callMicrosoftGraphAPI(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  // Always get a fresh token (will use cache if valid, but decode it to verify)
  const token = await getMicrosoftGraphApplicationToken();

  // Decode token to verify it has the right permissions
  const decoded = decodeToken(token);
  if (decoded) {
    console.log("=== Token Being Used ===");
    console.log("- Audience (aud):", decoded.aud);
    console.log("- App ID (appid):", decoded.appid);
    console.log("- Roles:", decoded.roles || "No roles found");
    console.log("- Scopes:", decoded.scp || "No scopes found");
    console.log("=====================");

    // Check if token has roles (application permissions)
    if (!decoded.roles || decoded.roles.length === 0) {
      console.error(
        "⚠️  WARNING: Token has no roles! This means application permissions are not granted.",
      );
      console.error(
        "Please ensure admin consent is granted for Calendars.ReadWrite application permission.",
      );
    } else {
      console.log("✅ Token has application permissions:", decoded.roles);
      // Check if Calendars.ReadWrite is present
      const hasCalendarPermission = decoded.roles.some(
        (role: string) =>
          role.toLowerCase().includes("calendar") ||
          role === "Calendars.ReadWrite" ||
          role === "Calendars.ReadWrite.All",
      );
      if (!hasCalendarPermission) {
        console.error(
          "⚠️  WARNING: Token does not have Calendars.ReadWrite application permission.",
        );
        console.error("Required permissions: Calendars.ReadWrite");
      }
    }
  }

  const graphUrl = `https://graph.microsoft.com/v1.0${endpoint}`;
  console.log(`Calling Microsoft Graph API: ${graphUrl}`);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(graphUrl, {
    ...options,
    headers,
  });

  console.log(`Response status: ${response.status} ${response.statusText}`);

  // Log response headers for debugging
  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });
  console.log("Response headers:", responseHeaders);

  if (!response.ok) {
    let errorText = "";
    let errorBody: any = null;

    // Try to read the error response body
    // Clone the response to read it without consuming the stream
    try {
      // Read the response body
      const clone = response.clone();
      errorText = await clone.text();

      // Try to parse as JSON
      if (errorText && errorText.trim().length > 0) {
        try {
          errorBody = JSON.parse(errorText);
        } catch {
          // Not JSON, keep as text
          errorBody = { message: errorText };
        }
      }
    } catch (e) {
      console.error("Failed to read error response:", e);
    }

    const contentType = response.headers.get("content-type");
    console.log("Error response content-type:", contentType);
    console.log("Error response body length:", errorText.length);

    // If we still don't have error body, check common 401 issues
    if (!errorBody || !errorBody.error) {
      if (response.status === 401) {
        // Common 401 causes with application permissions:
        // 1. Personal Microsoft accounts are NOT supported (only work/school accounts)
        // 2. User doesn't have Exchange Online/mailbox enabled
        // 3. User exists but calendar is not accessible
        // 4. Application doesn't have Calendars.ReadWrite permission
        // 5. Admin consent not granted for application permissions
        const decoded = decodeToken(token);
        const hasRoles = decoded?.roles && decoded.roles.length > 0;
        const hasCalendarPermission =
          hasRoles &&
          decoded.roles.some(
            (role: string) =>
              role.toLowerCase().includes("calendar") ||
              role === "Calendars.ReadWrite" ||
              role === "Calendars.ReadWrite.All",
          );

        // Extract user email from endpoint to provide specific guidance
        const userEmail = extractUserEmailFromEndpoint(endpoint);
        const isPersonalAccount = userEmail ? isLikelyPersonalAccount(userEmail) : false;

        let errorMessage = "Authentication failed (401).\n\n";

        // Add specific guidance based on what we detect
        if (isPersonalAccount) {
          errorMessage +=
            `❌ ISSUE DETECTED: The email "${userEmail}" appears to be a personal Microsoft account.\n\n` +
            "Application permissions only work with WORK/SCHOOL accounts (Azure AD) in the same tenant.\n\n" +
            "SOLUTION:\n" +
            `1. Use a work/school account email instead of "${userEmail}"\n` +
            "2. The account must be in the same Azure AD tenant as your application\n" +
            "3. The account must have Exchange Online license enabled\n\n" +
            "Examples of work/school accounts:\n" +
            "- user@yourcompany.com\n" +
            "- user@yourorganization.onmicrosoft.com\n" +
            "- user@yourdomain.com\n\n";
        } else {
          errorMessage +=
            "Common causes:\n" +
            "1. Personal Microsoft accounts are NOT supported - only work/school accounts (Azure AD) are supported\n" +
            "2. Application doesn't have Calendars.ReadWrite application permission granted\n" +
            "3. Admin consent not provided for application permissions\n" +
            "4. User does not have Exchange Online license/mailbox enabled\n" +
            "5. User mailbox not provisioned or calendar service not enabled\n\n";
        }

        if (!hasRoles) {
          errorMessage +=
            "⚠️  DIAGNOSIS: Token has no application permissions (roles). Please grant Calendars.ReadWrite application permission and provide admin consent.\n";
        } else if (!hasCalendarPermission) {
          errorMessage += `⚠️  DIAGNOSIS: Token has roles but missing Calendars.ReadWrite. Current roles: ${decoded.roles.join(", ")}\n`;
        } else {
          errorMessage += "✅ DIAGNOSIS: Token has correct permissions (Calendars.ReadWrite).\n\n";
          if (isPersonalAccount) {
            errorMessage +=
              "The issue is that you're trying to access a personal Microsoft account, which is not supported with application permissions.\n";
          } else if (userEmail) {
            errorMessage +=
              `The issue is likely one of:\n` +
              `- User "${userEmail}" doesn't have Exchange Online license\n` +
              `- User "${userEmail}" mailbox not provisioned\n` +
              `- User "${userEmail}" doesn't exist in the tenant\n`;
          } else {
            errorMessage +=
              "Issue may be:\n" +
              "- Target user is a personal Microsoft account (not supported)\n" +
              "- Target user doesn't have Exchange Online license\n" +
              "- Target user mailbox not provisioned\n";
          }
        }

        errorBody = {
          error: {
            code: "Unauthorized",
            message: errorMessage,
            innerError: errorBody || null,
          },
        };
      } else {
        errorBody = {
          error: {
            code: `HTTP_${response.status}`,
            message:
              errorText || `Microsoft Graph API returned ${response.status} ${response.statusText}`,
          },
        };
      }
    }

    console.error("Microsoft Graph API error:", {
      status: response.status,
      statusText: response.statusText,
      errorBody,
      fullErrorText: errorText || "(empty)",
      responseHeaders,
      endpoint: graphUrl,
    });

    const error: any = new Error(errorBody.error?.message || errorText || "Unknown error");
    error.statusCode = response.status;
    error.code = errorBody.error?.code;
    error.body = errorBody;
    throw error;
  }

  return await response.json();
}

/**
 * Check if user has Exchange Online license (requires Directory.Read.All or User.Read.All permission)
 */
export async function checkUserLicense(userEmail: string): Promise<{
  hasExchangeOnline: boolean;
  assignedLicenses: string[];
  error?: string;
}> {
  try {
    const user = await callMicrosoftGraphAPI(
      `/users/${encodeURIComponent(userEmail)}?$select=assignedLicenses,userPrincipalName`,
    );
    const licenses = user.assignedLicenses || [];

    // Exchange Online SKUs (common ones)
    const exchangeOnlineSkuIds = [
      "4b9405b0-7758-4e66-8c4e-8b5b6c8d9e0f", // Exchange Online Plan 1
      "19ec0d23-8335-4cbd-94ac-6050e30712fa", // Exchange Online Plan 2
      "9aaf7827-d63c-4b61-89c3-182f06f82e5c", // Exchange Online Kiosk
      "efb87545-963c-4e0d-99df-69c0356c87e4", // Exchange Online Archiving
      "e26c2fcc-ab91-4a61-b35c-03cdc1d4c16e", // Exchange Online Essentials
      "e95bec33-7c88-4a70-8e19-b10bd9d0c014", // Exchange Online Essentials
    ];

    const assignedSkuIds = licenses.map((l: any) => l.skuId);
    const hasExchangeOnline = assignedSkuIds.some((skuId: string) =>
      exchangeOnlineSkuIds.includes(skuId),
    );

    return {
      hasExchangeOnline,
      assignedLicenses: assignedSkuIds,
    };
  } catch (error: any) {
    // If we don't have permission to read licenses, return unknown
    if (error.statusCode === 403) {
      return {
        hasExchangeOnline: false,
        assignedLicenses: [],
        error: "Cannot check licenses: Directory.Read.All or User.Read.All permission required",
      };
    }
    return {
      hasExchangeOnline: false,
      assignedLicenses: [],
      error: error.message,
    };
  }
}

/**
 * Verify if a user exists and has a mailbox accessible via application permissions
 * This is a helper function to diagnose calendar access issues
 *
 * Note: This function skips user info check if User.Read.All permission is not available,
 * and goes straight to testing calendar access (which is what we actually need).
 */
export async function verifyUserMailbox(userEmail: string): Promise<{
  userExists: boolean;
  hasMailbox: boolean;
  hasCalendar: boolean;
  hasExchangeOnlineLicense?: boolean;
  error?: string;
  details?: string;
}> {
  let userExists = false;
  let userDetails: any = null;

  // Try to get the user info (requires User.Read.All permission)
  // If this fails, we'll skip it and test calendar access directly
  try {
    const user = await callMicrosoftGraphAPI(
      `/users/${encodeURIComponent(userEmail)}?$select=id,mail,userPrincipalName,userType,accountEnabled`,
    );
    userExists = true;
    userDetails = {
      id: user.id,
      mail: user.mail,
      userPrincipalName: user.userPrincipalName,
      userType: user.userType,
      accountEnabled: user.accountEnabled,
    };
    console.log("User found:", userDetails);
  } catch (error: any) {
    if (error.statusCode === 403) {
      console.log(
        "⚠️  Cannot verify user existence: User.Read.All permission may be missing. Skipping user check and testing calendar access directly.",
      );
      // Continue to test calendar access anyway
    } else if (error.statusCode === 404) {
      console.log("User not found in tenant");
      return {
        userExists: false,
        hasMailbox: false,
        hasCalendar: false,
        error: `User ${userEmail} not found in tenant`,
      };
    } else {
      console.error("User verification failed:", error.statusCode, error.message);
      return {
        userExists: false,
        hasMailbox: false,
        hasCalendar: false,
        error: error.message,
      };
    }
  }

  // Try to get mailbox settings (this confirms mailbox exists)
  // This requires MailboxSettings.Read permission
  let hasMailbox = false;
  let mailboxError: string | undefined;
  try {
    const mailboxSettings = await callMicrosoftGraphAPI(
      `/users/${encodeURIComponent(userEmail)}/mailboxSettings`,
    );
    hasMailbox = !!mailboxSettings;
    console.log("Mailbox settings accessible:", hasMailbox);
  } catch (e: any) {
    mailboxError = e.message;
    console.log("Mailbox settings check failed:", e.statusCode, e.message);
    // Don't fail here - mailbox settings might require additional permissions
  }

  // Check user license (requires Directory.Read.All or User.Read.All)
  let licenseCheck: {
    hasExchangeOnline: boolean;
    assignedLicenses: string[];
    error?: string;
  } | null = null;
  try {
    licenseCheck = await checkUserLicense(userEmail);
    if (licenseCheck.hasExchangeOnline) {
      console.log("✅ User has Exchange Online license");
    } else {
      console.log("❌ User does NOT have Exchange Online license");
      if (licenseCheck.error) {
        console.log("License check error:", licenseCheck.error);
      }
    }
  } catch (e) {
    console.log("Could not check license:", e);
  }

  // Try to get calendars (this confirms calendar is accessible)
  // This is the most important check - if this works, calendar operations should work
  let hasCalendar = false;
  let calendarError: string | undefined;
  try {
    const calendars = await callMicrosoftGraphAPI(
      `/users/${encodeURIComponent(userEmail)}/calendars?$top=1`,
    );
    hasCalendar = !!calendars.value && calendars.value.length > 0;
    console.log("Calendar accessible:", hasCalendar);
    if (hasCalendar) {
      console.log(
        "Available calendars:",
        calendars.value.map((c: any) => c.name || c.id),
      );
    }
  } catch (e: any) {
    calendarError = e.message;
    console.log("Calendar check failed:", e.statusCode, e.message);
  }

  // Compile results
  const details: string[] = [];
  if (!userExists && userDetails === null) {
    details.push("User existence check skipped (User.Read.All permission may be missing)");
  }
  if (licenseCheck && !licenseCheck.hasExchangeOnline) {
    details.push("⚠️ CRITICAL: User does NOT have Exchange Online license assigned");
    if (licenseCheck.error) {
      details.push(`License check: ${licenseCheck.error}`);
    } else {
      details.push(
        "To fix: Go to Azure Portal → Users → Select user → Licenses → Assign Exchange Online license",
      );
    }
  }
  if (mailboxError) {
    details.push(`Mailbox check: ${mailboxError}`);
  }
  if (calendarError) {
    details.push(`Calendar check: ${calendarError}`);
  }

  return {
    userExists,
    hasMailbox,
    hasCalendar,
    hasExchangeOnlineLicense: licenseCheck?.hasExchangeOnline ?? undefined,
    error: calendarError || mailboxError,
    details: details.length > 0 ? details.join("; ") : undefined,
  };
}
