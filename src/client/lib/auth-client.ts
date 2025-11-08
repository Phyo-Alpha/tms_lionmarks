import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    organizationClient({
      schema: {
        organization: {
          additionalFields: {
            uen: {
              type: "string",
            },
            estimatedTurnover: {
              type: "string",
            },
            yearInOperation: {
              type: "string",
            },
            participatedInProgramLast5Years: {
              type: "string",
            },
            adequateSupportInFinance: {
              type: "string",
            },
          },
        },
        member: {
          additionalFields: {
            roleInCompany: {
              type: "string",
            },
          },
        },
      },
    }),
  ],
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});
