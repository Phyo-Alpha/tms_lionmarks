import * as nodemailer from "nodemailer";
import env from "../config/env";

export abstract class Emailer {
  private static transporter = nodemailer.createTransport({
    host: env.SMTP_HOST ?? "localhost",
    port: env.SMTP_PORT ? Number(env.SMTP_PORT) : 587,
    secure: env.SMTP_PORT === "465",
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
  });

  static async sendEmail(params: { to: string; subject: string; text: string }) {
    if (!env.SMTP_FROM) {
      throw new Error("SMTP_FROM environment variable is not set");
    }
    const info = await this.transporter.sendMail({
      from: env.SMTP_FROM,
      to: params.to,
      subject: params.subject,
      text: params.text,
    });

    return info;
  }
}
