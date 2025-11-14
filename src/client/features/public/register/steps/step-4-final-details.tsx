"use client";

import { FormInput } from "@/client/components/ui/form/form-input";
import { FormRadioGroup } from "@/client/components/ui/form/form-radio-group";

const hearAboutUsOptions = [
  { value: "Google Search", label: "Google Search" },
  { value: "Instagram", label: "Instagram" },
  { value: "Facebook", label: "Facebook" },
  { value: "Friends", label: "Friends" },
  { value: "Sales Booth", label: "Sales Booth" },
  { value: "Others", label: "Others" },
];

export function Step4FinalDetails() {
  return (
    <div className="bg-white rounded-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Final Details</h1>
      <p className="text-gray-600 mb-8">Almost done! Just a few more details</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          name="classStartDate"
          label="Class Start Date"
          type="date"
          InputProps={{
            min: new Date().toISOString().split("T")[0],
          }}
          inputBox="default"
          inputSize="default"
        />

        <FormInput
          name="salesperson"
          label="Salesperson's name (if applicable)"
          placeholder="Enter salesperson name"
          inputBox="default"
          inputSize="default"
        />
      </div>

      <FormRadioGroup
        name="hearAboutUs"
        label="How did you hear about us?"
        options={hearAboutUsOptions}
        RadioGroupProps={{
          className: "grid grid-cols-2 md:grid-cols-3 gap-4",
        }}
      />
    </div>
  );
}
