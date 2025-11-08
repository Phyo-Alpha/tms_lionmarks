"use client";

import { cn } from "@/client/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

//---------------- HARDCODED VALUES ----------------
const DISPUTE_LINK_TEXT = "here";
const DISPUTE_LINK_HREF = "/account-dispute";
//---------------- END HARDCODED VALUES ----------------

const InfoIcon = () => (
  <svg
    className="w-6 aspect-square"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 20H14.6667V12H12V20ZM13.3333 9.33333C13.7111 9.33333 14.028 9.20533 14.284 8.94933C14.54 8.69333 14.6676 8.37689 14.6667 8C14.6658 7.62311 14.5378 7.30667 14.2827 7.05067C14.0276 6.79467 13.7111 6.66667 13.3333 6.66667C12.9556 6.66667 12.6391 6.79467 12.384 7.05067C12.1289 7.30667 12.0009 7.62311 12 8C11.9991 8.37689 12.1271 8.69378 12.384 8.95067C12.6409 9.20756 12.9573 9.33511 13.3333 9.33333ZM13.3333 26.6667C11.4889 26.6667 9.75556 26.3164 8.13334 25.616C6.51111 24.9156 5.1 23.9658 3.9 22.7667C2.7 21.5676 1.75022 20.1564 1.05067 18.5333C0.351113 16.9102 0.000890577 15.1769 1.68776e-06 13.3333C-0.000887201 11.4898 0.349335 9.75644 1.05067 8.13333C1.752 6.51022 2.70178 5.09911 3.9 3.9C5.09822 2.70089 6.50934 1.75111 8.13334 1.05067C9.75734 0.350222 11.4907 0 13.3333 0C15.176 0 16.9093 0.350222 18.5333 1.05067C20.1573 1.75111 21.5684 2.70089 22.7667 3.9C23.9649 5.09911 24.9151 6.51022 25.6173 8.13333C26.3196 9.75644 26.6693 11.4898 26.6667 13.3333C26.664 15.1769 26.3138 16.9102 25.616 18.5333C24.9182 20.1564 23.9684 21.5676 22.7667 22.7667C21.5649 23.9658 20.1538 24.916 18.5333 25.6173C16.9129 26.3187 15.1796 26.6684 13.3333 26.6667Z"
      fill="#0D2047"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    className="w-6 aspect-[28/24]"
    viewBox="0 0 28 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.2439 1L26.756 20.9387C26.9315 21.2427 27.0239 21.5876 27.0239 21.9387C27.0239 22.2897 26.9315 22.6346 26.756 22.9386C26.5804 23.2427 26.328 23.4952 26.0239 23.6707C25.7199 23.8462 25.375 23.9387 25.024 23.9387H1.99995C1.64888 23.9387 1.304 23.8462 0.999967 23.6707C0.695936 23.4952 0.443467 23.2427 0.267936 22.9386C0.0924057 22.6346 -2.22966e-06 22.2897 0 21.9387C2.22974e-06 21.5876 0.0924146 21.2427 0.267949 20.9387L11.7799 1C12.5493 -0.333333 14.4733 -0.333333 15.2439 1ZM13.5119 16.8027C13.1583 16.8027 12.8192 16.9431 12.5691 17.1932C12.3191 17.4432 12.1786 17.7824 12.1786 18.136C12.1786 18.4896 12.3191 18.8288 12.5691 19.0788C12.8192 19.3289 13.1583 19.4693 13.5119 19.4693C13.8656 19.4693 14.2047 19.3289 14.4548 19.0788C14.7048 18.8288 14.8453 18.4896 14.8453 18.136C14.8453 17.7824 14.7048 17.4432 14.4548 17.1932C14.2047 16.9431 13.8656 16.8027 13.5119 16.8027ZM13.5119 7.46933C13.1854 7.46938 12.8702 7.58928 12.6261 7.80629C12.3821 8.0233 12.2262 8.32233 12.1879 8.64667L12.1786 8.80267V14.136C12.179 14.4758 12.3091 14.8027 12.5424 15.0498C12.7757 15.2969 13.0946 15.4456 13.4338 15.4656C13.7731 15.4855 14.1071 15.3751 14.3677 15.157C14.6283 14.9389 14.7958 14.6295 14.8359 14.292L14.8453 14.136V8.80267C14.8453 8.44905 14.7048 8.10991 14.4548 7.85986C14.2047 7.60981 13.8656 7.46933 13.5119 7.46933Z"
      fill="#EB4841"
    />
  </svg>
);

type InfoBoxBaseProps = {
  className?: string;
  variant?: "info" | "warning";
};

type InfoBoxConditionalProps =
  | {
      variant?: "info";
      children: ReactNode;
      organizationName?: never;
      uen?: never;
      email?: never;
    }
  | {
      variant: "warning";
      organizationName: string;
      uen: string;
      email: string;
      children?: never;
    };

export type InfoBoxProps = InfoBoxBaseProps & InfoBoxConditionalProps;

export const InfoBox = ({
  children,
  className,
  variant = "info",
  organizationName,
  uen,
  email,
}: InfoBoxProps) => {
  const isWarning = variant === "warning";

  return (
    <div
      className={cn(
        "flex items-start rounded-lg border-2 space-x-3 sm:space-x-6 p-3 sm:p-5 lg:mx-10",
        isWarning ? " bg-sbf-pale-red border-sbf-red" : " bg-sbf-pale-blue border-sbf-dark-blue  ",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-center rounded-full">
        {isWarning ? <WarningIcon /> : <InfoIcon />}
      </div>

      {isWarning ? (
        <div className="flex flex-col gap-2 text-sm text-gray-800">
          <p>
            The organisation <strong>{organizationName}</strong> (UEN <strong>{uen}</strong>)
            already has a FRBI account registered under <strong>{email}</strong>
          </p>
          <p>
            If this email does not belong to your organisation or you believe this is an error,
            please contact SBF for assistance{" "}
            <Link href={DISPUTE_LINK_HREF} className="underline font-bold">
              {DISPUTE_LINK_TEXT}
            </Link>
            .
          </p>
        </div>
      ) : (
        <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: children as string }} />
      )}
    </div>
  );
};
