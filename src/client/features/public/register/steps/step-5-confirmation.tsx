"use client";

import { PublicRegistrationInput } from "@/client/services/public-registration";
import { CheckCircle2 } from "lucide-react";

export function Step5Confirmation({
  registration,
}: {
  registration: PublicRegistrationInput | null;
}) {
  if (!registration) {
    return <p>No registration found</p>;
  }
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
      </div>

      <h2 className="text-3xl font-bold">Thanks for submitting!</h2>

      <p className="text-lg text-muted-foreground">
        We will contact you shortly regarding your registration.
      </p>

      <div className="bg-muted rounded-lg p-6 mt-8 text-left">
        <h3 className="font-semibold mb-4">Registration Summary:</h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Name:</strong> {registration.firstName} {registration.lastName}
          </p>
          <p>
            <strong>Email:</strong> {registration.email}
          </p>
          <p>
            <strong>Phone:</strong> {registration.countryCode} {registration.phone}
          </p>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-sm text-muted-foreground">
          You should receive a confirmation email shortly. If you have any questions, please
          don&apos;t hesitate to contact us.
        </p>
      </div>
    </div>
  );
}
