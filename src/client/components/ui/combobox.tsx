import { Button } from "@/client/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/client/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/client/components/ui/popover";
import { cn } from "@/client/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Check } from "lucide-react";
import * as React from "react";

export type ComboboxProps<TValue extends string> = {
  autoComplete?: boolean;
  options: {
    label: string;
    value: TValue;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onChange: (value: TValue) => void;
  value: TValue;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
};

export function Combobox<TValue extends string>({
  options,
  value,
  onChange,
  autoComplete,
  placeholder,
  className,
  contentClassName,
}: ComboboxProps<TValue>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("flex max-w-[230px] justify-between", className)}
        >
          <span className="truncate">
            {value
              ? options.find((option) => option.value === value)?.label
              : (placeholder ?? "Select...")}
          </span>
          <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("bg-background h-auto max-w-[230px] p-0 shadow-lg", contentClassName)}
        side="bottom"
        sideOffset={4}
        align="start"
      >
        <Command>
          {autoComplete && <CommandInput placeholder="Search..." />}
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {options.map((options) => (
                <CommandItem
                  key={options.value}
                  value={options.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? ("" as TValue) : (currentValue as TValue));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === options.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {options.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
