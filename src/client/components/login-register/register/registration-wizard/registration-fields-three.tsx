"use client";

import FormSelect from "@/client/components/ui/form/form-select";

//---------------- HARDCODED VALUES ----------------
export type QuestionSelectData = {
  question: string;
  subtext?: string;
  label?: string;
  name: string;
  items: readonly { label: string; value: string }[];
};

export const SUPPORT_PROGRAMS_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
] as const;

export const BANKING_SUPPORT_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Not Sure", value: "unsure" },
] as const;

export const questionSelectData: QuestionSelectData[] = [
  {
    question:
      "Has your company participated in any SBF/government programs to improve company performance in the past 5 years?",
    subtext: "(e.g., Career Conversion Programme, Mid-career Pathways Programme)",
    label: "Any SBF/Government Programs",
    name: "supportPrograms",
    items: SUPPORT_PROGRAMS_OPTIONS,
  },
  {
    question:
      "Are you getting adequate support for your banking and financing needs in the markets you operate in?",
    label: "Adequate Banking Support",
    name: "bankingSupport",
    items: BANKING_SUPPORT_OPTIONS,
  },
];
//---------------- END HARDCODED VALUES ----------------

// Question with select field component
export const QuestionSelect = ({
  question,
  subtext,
  name,
  items,
  disabled = false,
}: QuestionSelectData & { disabled?: boolean }) => {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold">{question}</p>
      {subtext && <p className="">{subtext}</p>}
      <FormSelect
        name={name}
        label={undefined}
        items={items as unknown as { label: string; value: string }[]}
        noFormMessage
        disabled={disabled}
      />
    </div>
  );
};

export const RegistrationFieldsThree = () => {
  return (
    <div className="flex w-full flex-col space-y-6">
      {questionSelectData.map((data, idx) => (
        <QuestionSelect key={idx} {...data} />
      ))}
    </div>
  );
};
