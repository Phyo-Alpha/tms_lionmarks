"use client";

import FormSelect from "@/client/components/ui/form/form-select";
import { FormRadioGroup } from "@/client/components/ui/form/form-radio-group";

const qualifications = [
  { value: "Primary", label: "Primary" },
  { value: "Secondary", label: "Secondary" },
  { value: "Diploma/A-Levels", label: "Diploma/A-Levels" },
  { value: "Degree", label: "Degree" },
  { value: "Masters", label: "Masters" },
  { value: "PHD", label: "PHD" },
  { value: "Others", label: "Others" },
];

const englishCompetencies = [
  { value: "Competent", label: "Competent" },
  { value: "Not competent", label: "Not competent" },
];

const vaccinatedOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export function Step2AdditionalInfo() {
  return (
    <div className="bg-white rounded-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Additional Information</h1>
      <p className="text-gray-600 mb-8">Tell us more about yourself</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect name="qualification" label="Highest Qualification" items={qualifications} />

        <FormSelect
          name="englishCompetency"
          label="English Competency"
          items={englishCompetencies}
        />
      </div>

      <FormRadioGroup
        name="vaccinated"
        label="Fully vaccinated?"
        options={vaccinatedOptions}
        RadioGroupProps={{
          className: "flex gap-6",
        }}
      />
    </div>
  );
}
