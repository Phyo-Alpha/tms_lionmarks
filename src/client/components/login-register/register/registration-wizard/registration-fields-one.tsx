"use client";

import { FormInput } from "@/client/components/ui/form/form-input";
import FormSelect from "@/client/components/ui/form/form-select";

//---------------- HARDCODED VALUES ----------------
export const ROLE_OPTIONS = [
  { label: "Staff-level Employee", value: "staff" },
  { label: "Middle Management", value: "middle" },
  { label: "Senior Management", value: "senior" },
  { label: "Executive Leadership", value: "executive" },
] as const;
//---------------- END HARDCODED VALUES ----------------

export const RegistrationFieldsOne = () => {
  return (
    <div className="flex w-full flex-col space-y-6">
      <div className="flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:space-x-5">
        <FormInput
          name="name"
          InputProps={{ inputSize: "default" }}
          label="Your Name"
          placeholder="Enter your name"
          className="sm:w-1/2"
        />

        <FormSelect
          name="role"
          label="Role"
          FormItemProps={{ className: "sm:w-1/2" }}
          items={ROLE_OPTIONS as unknown as { label: string; value: string }[]}
        />
      </div>

      <FormInput
        name="uen"
        InputProps={{ inputSize: "default" }}
        label="Organisation UEN"
        placeholder="Enter your organisation UEN"
      />
    </div>
  );
};
