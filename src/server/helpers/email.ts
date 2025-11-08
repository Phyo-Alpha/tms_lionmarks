import * as nodemailer from "nodemailer";
import env from "../config/env";

export abstract class Emailer {
  private static transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  static async sendEmail(params: { to: string; subject: string; text: string }) {
    const info = await this.transporter.sendMail({
      from: env.SMTP_FROM,
      to: params.to,
      subject: params.subject,
      text: params.text,
    });

    return info;
  }
}
