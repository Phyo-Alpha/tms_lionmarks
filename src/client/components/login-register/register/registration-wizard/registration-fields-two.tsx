"use client";

import FormSelect from "@/client/components/ui/form/form-select";
import { UnderlinedLink } from "@/client/components/login-register/underlined-link";

//---------------- HARDCODED VALUES ----------------
const EDIT_ACRA_TEXT = "Edit ACRA Information";
const EDIT_ACRA_LINK = "#";
export const TURNOVER_OPTIONS = [
  { label: "Below S$1 million", value: "<1m" },
  { label: "S$1 million to S$10 million", value: "1m-10m" },
  { label: "S$10 million to S$100 million", value: "10m-100m" },
  { label: "Above S$100 million", value: ">100m" },
] as const;

export const YEARS_IN_OPERATION_OPTIONS = [
  { label: "Less than 1 year", value: "<1" },
  { label: "1 to 5 Years", value: "1-5" },
  { label: "5 to 10 Years", value: "5-10" },
  { label: "More than 10 Years", value: ">10" },
] as const;
//---------------- END HARDCODED VALUES ----------------

export const RegistrationFieldsTwo = () => {
  return (
    <div className="flex w-full flex-col space-y-6">
      <div className="flex justify-end">
        <UnderlinedLink href={EDIT_ACRA_LINK}>{EDIT_ACRA_TEXT}</UnderlinedLink>
      </div>

      <FormSelect
        name="turnover"
        label="Est. Turnover"
        items={TURNOVER_OPTIONS as unknown as { label: string; value: string }[]}
      />
      <FormSelect
        name="yearsInOperation"
        label="Years in Operation"
        items={YEARS_IN_OPERATION_OPTIONS as unknown as { label: string; value: string }[]}
      />
    </div>
  );
};
