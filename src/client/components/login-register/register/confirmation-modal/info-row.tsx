"use client";

type InfoRowProps = {
  label: string;
  value: string;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col space-y-2 standardRoundness bg-sbf-pale-blue  border border-sbf-dark-blue p-4 2.5xl:p-5">
      <p className="">{label}</p>
      <h3 className="">{value || "-"}</h3>
    </div>
  );
}
