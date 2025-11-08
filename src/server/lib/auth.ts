import { db } from "@/server/db";
import * as schema from "@/server/db/schema/auth-schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, haveIBeenPwned, openAPI, organization } from "better-auth/plugins";
import { Emailer } from "../helpers/email";

export const auth = betterAuth({
  plugins: [
    openAPI(),
    admin(),
    organization({
      async sendInvitationEmail(data) {
        // Construct the invitation acceptance link
        const inviteLink = `${
          process.env.BETTER_AUTH_URL || "http://localhost:3000"
        }/accept-invitation/${data.id}`;

        // Log the invitation (in production, replace with actual email service)

        await Emailer.sendEmail({
          to: data.email,
          subject: `You've been invited to join ${data.organization.name}`,
          text: `Hello!\n${data.inviter.user.name} (${data.inviter.user.email}) has invited you to join ${data.organization.name} as a ${data.role}.\nClick the link below to accept the invitation:\n${inviteLink}`,
        });
      },
      schema: {
        organization: {
          additionalFields: {
            uen: {
              type: "string",
              required: true,
            },
            estimatedTurnover: {
              type: "string",
              required: false,
            },
            yearInOperation: {
              type: "string",
              required: false,
            },
            participatedInProgramLast5Years: {
              type: "string",
              required: false,
            },
            adequateSupportInFinance: {
              type: "string",
              required: false,
            },
          },
        },
        member: {
          additionalFields: {
            roleInCompany: {
              type: "string",
              required: false,
            },
          },
        },
      },
    }),
    haveIBeenPwned(),
  ],
  database: drizzleAdapter(db, {
    schema,
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await Emailer.sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        text: `Hello ${user.name || "there"}! We received a request to reset your password. Click the link below to create a new password: ${url} If you didn't request a password reset, you can safely ignore this email.`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await Emailer.sendEmail({
        to: user.email,
        subject: "Verify Your Email Address",
        text: `Hello ${user.name || "there"}! Thank you for registering. Please verify your email address by clicking the link below: ${url} If you didn't create an account, you can safely ignore this email.`,
      });
    },
  },
});
