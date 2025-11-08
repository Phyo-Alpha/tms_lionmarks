// src/components/multi-select.tsx

import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/client/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/client/components/ui/popover";
import { Separator } from "@/client/components/ui/separator";
import { cn } from "@/client/lib/utils";
import { Portal } from "@radix-ui/react-portal";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDown, XCircle } from "lucide-react";
import * as React from "react";
import { forwardRef } from "react";

const multiSelectVariants = cva("m-1 transition delay-150 duration-300 ease-in-out", {
  variants: {
    variant: {
      default: "border-foreground/10 bg-card text-foreground hover:bg-card/80",
      secondary:
        "text-secondary-foreground border-foreground/10 bg-secondary hover:bg-secondary/80",
      destructive:
        "text-destructive-foreground border-transparent bg-destructive hover:bg-destructive/80",
      inverted: "inverted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type MultiSelectOptions<TValue extends string> = readonly {
  label: string;
  value: TValue;
  icon?: React.ComponentType<{ className?: string }>;
}[];
interface MultiSelectProps<TValue extends string>
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: MultiSelectOptions<TValue>;
  onValueChange: (value: TValue[]) => void;
  defaultValue: TValue[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  asChild?: boolean;
  className?: string;
  selectAllOption?: boolean;
  selectAllLabel?: string;
}

export const MultiSelect = forwardRef(
  <TValue extends string>(
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder,
      animation = 0,
      maxCount = 5,
      className,
      selectAllOption = false,
      selectAllLabel,
      ...props
    }: MultiSelectProps<TValue>,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    // const { t } = useTranslation('announcement')
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    // React.useEffect(() => {
    //   if (JSON.stringify(selectedValues) !== JSON.stringify(defaultValue)) {
    //     setSelectedValues(defaultValue)
    //   }
    // }, [defaultValue, selectedValues])
    React.useEffect(() => {
      if (JSON.stringify(selectedValues) !== JSON.stringify(defaultValue)) {
        setSelectedValues(defaultValue);
      }
    }, [defaultValue, selectedValues]);

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues as TValue[]);
      }
    };

    const toggleOption = (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues as TValue[]);

      // Ensure the Popover stays open after selecting an option
      setIsPopoverOpen(true);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    // const clearExtraOptions = () => {
    //   const newSelectedValues = selectedValues.slice(0, maxCount)
    //   setSelectedValues(newSelectedValues)
    //   onValueChange(newSelectedValues as TValue[])
    // }

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => {
          if (open || document.activeElement?.closest("[data-popover]")) {
            setIsPopoverOpen(true);
          } else {
            setIsPopoverOpen(false);
          }
        }}
      >
        {/* // <Popover
          //   open={isPopoverOpen}
          //   onOpenChange={(open) => {
          //     // Only allow the popover to close if the user clicks outside
          //     if (open || document.activeElement?.closest('[data-popover]')) {
          //       setIsPopoverOpen(true)
          //       console.log("Popover open:", isPopoverOpen);
          //     }
          //     else {
          //       setIsPopoverOpen(false)
          //     }
          //   }}
          // > */}
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            className={cn(
              "border-input text-foreground z-0! flex h-auto min-h-14 w-full items-center justify-between rounded-xl border bg-inherit p-1 shadow-none hover:bg-inherit",
              className,
              isPopoverOpen && "border-ring",
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="z-0! flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      selectedValues.length <= maxCount && (
                        <Badge
                          key={value}
                          className={cn(
                            multiSelectVariants({ variant, className }),
                            "border text-sm shadow-none",
                          )}
                          style={{ animationDuration: `${animation}s` }}
                        >
                          {IconComponent && <IconComponent className="mr-2 size-4" />}
                          {option?.label}
                          <Button
                            className="z-32! size-4"
                            variant="ghost"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleOption(value);
                            }}
                          >
                            <XCircle className="text-foreground ml-2 cursor-pointer" />
                          </Button>
                        </Badge>
                      )
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        "border-foreground/1 text-foreground bg-transparent hover:bg-transparent",
                        multiSelectVariants({ variant, className }),
                        "border text-sm shadow-none",
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ${selectedValues.length} more`}
                      <Button
                        className="z-32! size-4"
                        variant="ghost"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClear();
                        }}
                      >
                        <XCircle className="text-foreground ml-2 cursor-pointer" />
                      </Button>
                    </Badge>
                  )}
                </div>
                <div className="z-30! flex items-center justify-between">
                  {/* <Button size="icon" variant="ghost" className='z-32!' onClick={(event) => {
                      event.stopPropagation()
                      handleClear()
                    }}>
                      <XIcon
                        className="mx-2 h-4 cursor-pointer text-foreground"
                      />
                    </Button> */}
                  <Separator orientation="vertical" className="flex h-full min-h-6" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="z-32!"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePopover();
                    }}
                  >
                    <ChevronDown className="text-foreground mx-2 h-4 cursor-pointer" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="mx-auto flex w-full items-center justify-between"
                onClick={handleTogglePopover}
              >
                <span className="text-foreground mx-3 text-base">{placeholder}</span>
                <ChevronDown className="text-foreground mx-2 cursor-pointer" />
              </div>
            )}
          </Button>
        </PopoverTrigger>

        <Portal>
          <PopoverContent
            className="bg-background z-60 w-[200px] overflow-y-auto p-0" // Set max height and enable scrolling
            align="start"
            side="bottom"
            onClick={(e) => e.stopPropagation()}
            onEscapeKeyDown={() => setIsPopoverOpen(false)}
          >
            <Command>
              <CommandInput placeholder="Search Filters" onKeyDown={handleInputKeyDown} autoFocus />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {selectAllOption && (
                    <CommandItem
                      key="all"
                      onSelect={toggleAll}
                      style={{ pointerEvents: "auto", opacity: 1 }}
                      className="hover:bg-primary hover:text-background focus:bg-primary focus:text-background cursor-pointer"
                    >
                      <div
                        className={cn(
                          "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                          selectedValues.length === options.length
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <CheckIcon className="size-4" />
                      </div>
                      <span>{selectAllLabel || "(Select All)"}</span>
                    </CommandItem>
                  )}
                  {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => toggleOption(option.value)}
                        style={{ pointerEvents: "auto", opacity: 1 }}
                        className="hover:bg-primary hover:text-background focus:bg-primary focus:text-background cursor-pointer"
                      >
                        <div
                          className={cn(
                            "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                            isSelected
                              ? "bg-primary text-background"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <CheckIcon className="size-4" />
                        </div>
                        {option.icon && <option.icon className="text-foreground mr-2 size-4" />}
                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <div className="flex items-center justify-between">
                    {selectedValues.length > 0 && (
                      <>
                        <CommandItem
                          onSelect={handleClear}
                          style={{ pointerEvents: "auto", opacity: 1 }}
                          className="hover:bg-primary hover:text-background focus:bg-primary focus:text-background flex-1 cursor-pointer justify-center"
                        >
                          Clear
                        </CommandItem>
                        <Separator orientation="vertical" className="flex h-full min-h-6" />
                      </>
                    )}
                    <CommandSeparator />
                    <CommandItem
                      onSelect={() => setIsPopoverOpen(false)}
                      style={{ pointerEvents: "auto", opacity: 1 }}
                      className="hover:bg-primary hover:text-background focus:bg-primary focus:text-background flex-1 cursor-pointer justify-center"
                    >
                      Close
                    </CommandItem>
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Portal>
      </Popover>
    );
  },
);

MultiSelect.displayName = "MultiSelect";
