"use client";

import { FormInput } from "@/client/components/ui/form/form-input";
import FormSelect from "@/client/components/ui/form/form-select";

const countryCodes = [
  { value: "SG +65", label: "SG +65" },
  { value: "MY +60", label: "MY +60" },
  { value: "TH +66", label: "TH +66" },
  { value: "ID +62", label: "ID +62" },
  { value: "PH +63", label: "PH +63" },
  { value: "VN +84", label: "VN +84" },
  { value: "US +1", label: "US +1" },
  { value: "UK +44", label: "UK +44" },
  { value: "AU +61", label: "AU +61" },
  { value: "CN +86", label: "CN +86" },
  { value: "JP +81", label: "JP +81" },
  { value: "KR +82", label: "KR +82" },
  { value: "IN +91", label: "IN +91" },
];

const nationalities = [
  { value: "Singaporean", label: "Singaporean" },
  { value: "PR", label: "PR" },
  { value: "Others", label: "Others" },
];

export function Step1PersonalInfo() {
  return (
    <div className="bg-white rounded-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Details</h1>
      <p className="text-gray-600 mb-8">Please provide your personal information</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          name="firstName"
          label="First Name"
          required
          inputBox="default"
          inputSize="default"
        />

        <FormInput
          name="lastName"
          label="Last Name"
          required
          inputBox="default"
          inputSize="default"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          name="email"
          label="Email"
          type="email"
          required
          inputBox="default"
          inputSize="default"
        />

        <div className="flex gap-2">
          <FormSelect
            name="countryCode"
            items={countryCodes}
            required
            noFormMessage
            FormLabelProps={{ className: "sr-only" }}
          />

          <div className="flex-1">
            <FormInput
              name="phone"
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
              required
              inputBox="default"
              inputSize="default"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          name="dob"
          label="Date of Birth"
          type="date"
          required
          InputProps={{
            max: new Date().toISOString().split("T")[0],
          }}
          inputBox="default"
          inputSize="default"
        />

        <FormSelect name="nationality" label="Nationality" items={nationalities} required />
      </div>

      <FormInput
        name="address"
        label="Home Address"
        required
        inputBox="default"
        inputSize="default"
      />
    </div>
  );
}
