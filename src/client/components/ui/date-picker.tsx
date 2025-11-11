import { Button } from "@/client/components/ui/button";
import type { CalendarProps } from "@/client/components/ui/calendar";
import { Calendar } from "@/client/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/client/components/ui/popover";
import { cn } from "@/client/lib/utils";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import React, { useState } from "react";

export type DatePickerProps = {
  placeholder?: string;
  value?: Date;
  onChange: (date: Date | null | undefined) => void;
  CalenderProps?: Omit<CalendarProps, "selected" | "onSelect" | "onChange" | "mode" | "value">;
} & Omit<ComponentPropsWithoutRef<"button">, "onChange" | "value">;

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ value, onChange, placeholder, CalenderProps, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false); // Track if the popover is open

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            {...props}
            className={cn(
              "w-full justify-between rounded-xl text-left font-normal",
              !value && "text-black",
              props.className,
            )}
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }} // Toggle popover manually
          >
            {value ? (
              dayjs(value).format("DD/MM/YYYY")
            ) : (
              <span>{placeholder ?? "Pick a date"}</span>
            )}
            <CalendarIcon className="ms-2 size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-background w-auto rounded-md p-0 shadow-md"
          ref={ref}
          onClick={(e) => e.stopPropagation()}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setIsOpen(false); // Close the popover after selecting a date
            }}
            initialFocus
            {...CalenderProps}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

DatePicker.displayName = "DatePicker";
