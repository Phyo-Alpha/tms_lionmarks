import type { Database } from "@/server/api";
import type { PublicRegistrationModel } from "./model";
import { LearnerService } from "@/server/api/learners/service";
import { RegistrationService } from "@/server/api/registrations/service";
import { Emailer } from "@/server/helpers/email";
import { status } from "@/server/helpers/responseWrapper";

export abstract class PublicRegistrationService {
  static async create(db: Database, payload: PublicRegistrationModel.CreateBody) {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        countryCode,
        dob,
        nationality,
        address,
        qualification,
        englishCompetency,
        vaccinated,
        courseId,
        classStartDate,
        salesperson,
        hearAboutUs,
      } = payload;

      const metadata = JSON.stringify({
        countryCode,
        dob: dob.toISOString(),
        nationality,
        address,
        qualification,
        englishCompetency,
        vaccinated,
        classStartDate: classStartDate?.toISOString(),
        salesperson,
        hearAboutUs,
      });

      const phoneWithCountryCode = `${countryCode} ${phone}`;

      const existingLearner = await db.query.learner.findFirst({
        where: (learnerTable, { eq }) => eq(learnerTable.email, email),
      });

      if (existingLearner) {
        throw status("Bad Request", { message: "You are already registered a course." });
      }

      const newLearner = await LearnerService.create(db, {
        firstName,
        lastName,
        email,
        phone: phoneWithCountryCode,
        status: "active",
        metadata,
        organization: "public",
      });

      const registration = await RegistrationService.create(db, {
        learnerId: newLearner.id,
        courseId,
        status: "enrolled",
      });

      try {
        await Emailer.sendEmail({
          to: email,
          subject: "Workshop Registration Confirmation",
          text: this.getConfirmationEmailText({
            firstName,
            lastName,
            courseId,
          }),
        });
      } catch (error) {
        console.error("Failed to send confirmation email:", error);
      }

      return {
        id: registration.id,
        message:
          "Registration successful! We will contact you shortly regarding your registration.",
      };
    } catch (error) {
      console.error("Failed to create public registration:", error);
      throw status("Internal Server Error", { message: "Failed to create public registration" });
    }
  }

  private static getConfirmationEmailText(params: {
    firstName: string;
    lastName: string;
    courseId: string;
  }): string {
    return `Hello ${params.firstName} ${params.lastName},

Thank you for registering for our workshop!

We have received your registration and will contact you shortly regarding a $30 refundable deposit. This deposit will be returned upon course completion.

If you have any questions, please don't hesitate to contact us.

Best regards,
Workshop Team`;
  }
}
