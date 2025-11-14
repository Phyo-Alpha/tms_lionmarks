import fs from "node:fs";
import path from "node:path";
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

      // Fetch full registration details with course info for email
      const registrationDetails = await RegistrationService.getById(db, registration.id);

      try {
        const htmlContent = await this.getConfirmationEmailHtml({
          firstName,
          lastName,
          email,
          phone: phoneWithCountryCode,
          address,
          registration,
          course: registrationDetails.course
            ? {
                id: registrationDetails.course.id,
                code: registrationDetails.course.code,
                title: registrationDetails.course.title,
                startDate: registrationDetails.course.startDate ?? null,
                endDate: registrationDetails.course.endDate ?? null,
              }
            : undefined,
          classStartDate,
        });

        await Emailer.sendEmail({
          to: email,
          subject: "Workshop Registration Confirmation",
          html: htmlContent,
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

  private static async getConfirmationEmailHtml(params: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    registration: { id: string; registeredAt: Date };
    course?: {
      id: string;
      code: string;
      title: string;
      startDate: Date | null;
      endDate: Date | null;
    };
    classStartDate?: Date;
  }): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      "src/server/api/public-registration/template/email-template.html",
    );

    let template = fs.readFileSync(templatePath, "utf-8");

    const toName = `${params.firstName} ${params.lastName}`;
    const todayDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const orderNumber = params.registration.id.slice(0, 8).toUpperCase();
    const courseName = params.course?.title || "Course";
    const courseCode = params.course?.code || "";
    const classStartDate = params.classStartDate
      ? params.classStartDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : params.course?.startDate
        ? new Date(params.course.startDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "TBD";

    // Replace template variables
    const replacements: Record<string, string> = {
      "{{to_name}}": toName,
      "{{today_date}}": todayDate,
      "{{order_number}}": orderNumber,
      "{{email}}": params.email,
      "{{address}}": params.address,
      "{{phone}}": params.phone,
      "{{course}}": courseName,
      "{{course_code}}": courseCode,
      "{{pax}}": "1",
      "{{course_price}}": "$0.00", // Default since pricing not in schema
      "{{mode_of_training}}": "Face-to-Face", // Default value
      "{{class_start_date}}": classStartDate,
      "{{class_time}}": "TBD", // Not available in schema
      "{{class_sponsorship}}": "SkillsFuture Credit", // Default value
      "{{name_on_certificate}}": toName,
      "{{additional_info}}": "N/A",
      "{{subtotal}}": "$0.00",
      "{{grand_total_excl_tax}}": "$0.00",
      "{{gst_percentage}}": "8",
      "{{gst_amount}}": "$0.00",
      "{{final_total}}": "$0.00",
    };

    // Replace all template variables
    for (const [key, value] of Object.entries(replacements)) {
      template = template.replaceAll(key, value);
    }

    return template;
  }
}
