"use client";

import { FormInput } from "@/client/components/ui/form/form-input";
import FormSelect from "@/client/components/ui/form/form-select";
import { ROLE_OPTIONS } from "./registration-fields-one";
import { TURNOVER_OPTIONS, YEARS_IN_OPERATION_OPTIONS } from "./registration-fields-two";
import { QuestionSelect, questionSelectData } from "./registration-fields-three";

export const RegistrationReview = () => {
  return (
    <div className="flex w-full flex-col space-y-6 px-5 py-6 bg-accent rounded-lg border border-input">
      {/* Section 1 Fields - Name, Role, Organisation Name, UEN */}
      <div className="flex flex-col lg:flex-row space-y-6  lg:space-x-5 lg:space-y-0">
        <FormInput
          name="name"
          InputProps={{ inputSize: "default", disabled: true }}
          label="Your Name"
          placeholder="Enter your name"
          className="w-full lg:w-1/2"
        />

        <FormSelect
          name="role"
          label="Role"
          FormItemProps={{ className: "w-full lg:w-1/2" }}
          items={ROLE_OPTIONS as unknown as { label: string; value: string }[]}
          disabled
        />
      </div>
      <div className="flex flex-col lg:flex-row space-y-6  lg:space-x-5 lg:space-y-0">
        <FormInput
          name="organizationName"
          InputProps={{ inputSize: "default", disabled: true }}
          label="Name of Organisation"
          placeholder="Enter organisation name"
          className="w-full lg:w-1/2"
        />

        <FormInput
          name="uen"
          InputProps={{ inputSize: "default", disabled: true }}
          label="Organisation UEN"
          placeholder="Enter your organisation UEN"
          className="w-full lg:w-1/2"
        />
      </div>

      {/* Section 2 Fields - Est. Turnover, Years in Operation */}
      <FormSelect
        name="turnover"
        label="Est. Turnover"
        items={TURNOVER_OPTIONS as unknown as { label: string; value: string }[]}
        disabled
      />
      <FormSelect
        name="yearsInOperation"
        label="Years in Operation"
        items={YEARS_IN_OPERATION_OPTIONS as unknown as { label: string; value: string }[]}
        disabled
      />

      {/* Section 3 Fields - Support Programs, Banking Support */}
      {questionSelectData.map((data) => (
        <FormSelect
          key={data.name}
          name={data.name}
          label={data.label}
          items={data.items as unknown as { label: string; value: string }[]}
          noFormMessage
          disabled
        />
      ))}
    </div>
  );
};
