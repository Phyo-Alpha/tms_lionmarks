import { DateFormats, formatter } from "@/client/lib/formatter";
import { cn } from "@/client/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { JSX, useEffect, useRef, useState, type FC } from "react";

import { Button, ButtonProps } from "./button";
import { Calendar } from "./calendar";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Switch } from "./switch";

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRangeString; rangeCompare?: DateRangeString }) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
  /** Initial value for start date for compare */
  initialCompareFrom?: Date | string;
  /** Initial value for end date for compare */
  initialCompareTo?: Date | string;
  /** Alignment of popover */
  align?: "start" | "center" | "end";
  /** Option for showing compare feature */
  showCompare?: boolean;
  /* Date Format Options */
  date_format?: DateFormats;
  /* Use a smaller size screen */
  useSmallScreen?: boolean;
  ButtonProps?: ButtonProps;
  placeholder?: string;
  /* Minimum date */
  minDate?: Date;
  /* Maximum date */
  maxDate?: Date;
  /* Don't set default value on clear. If true, the date range will be set to the min and max dates if they are defined. */
  noDefaultOnClear?: boolean;
}

const formatDate = (date: Date, format: DateFormats = "date"): string => {
  return formatter.date(date, format);
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    // Split the date string to get year, month, and day parts
    const parts = dateInput.split("-").map((part) => parseInt(part, 10));
    // Create a new Date object using the local timezone
    // Note: Month is 0-indexed, so subtract 1 from the month part
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date;
  } else {
    // If dateInput is already a Date object, return it directly
    return dateInput;
  }
};

interface DateRangeString {
  from: string;
  to: string;
}

interface DateRange {
  from: Date;
  to: Date | undefined;
}

interface Preset {
  name: string;
  label: string;
}

// Updated presets based on requirements
const PRESETS: Preset[] = [
  { name: "previous14Days", label: "Previous 14 Days" },
  { name: "currentMonth", label: "Current Month" },
  { name: "previousMonth", label: "Previous Month" },
  { name: "currentYear", label: "Current Year" },
  { name: "previousYear", label: "Previous Year" },
];

/** The DateRangePicker component allows a user to select a range of dates */
const DateRangePickerComponent: FC<DateRangePickerProps> = ({
  useSmallScreen,
  initialDateFrom,
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = "center",
  date_format = "date",
  showCompare = false,
  ButtonProps,
  placeholder = "Select Date",
  minDate,
  maxDate,
  noDefaultOnClear,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSelectedDates, setHasSelectedDates] = useState(false);

  const [range, setRange] = useState<DateRange>({
    from:
      initialDateFrom && initialDateFrom !== ""
        ? getDateAdjustedForTimezone(initialDateFrom)
        : new Date(),
    to:
      initialDateTo && initialDateTo !== "" ? getDateAdjustedForTimezone(initialDateTo) : undefined,
  });
  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    initialCompareFrom && initialCompareFrom !== "" && initialCompareTo && initialCompareTo !== ""
      ? {
          from: getDateAdjustedForTimezone(initialCompareFrom),
          to: getDateAdjustedForTimezone(initialCompareTo),
        }
      : undefined,
  );

  // Refs to store the values of range and rangeCompare when the date picker is opened
  const openedRangeRef = useRef<DateRange | undefined>(undefined);
  const openedRangeCompareRef = useRef<DateRange | undefined>(undefined);

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);

  const [isSmallScreen, setIsSmallScreen] = useState(
    useSmallScreen ?? (typeof window !== "undefined" ? window.innerWidth < 960 : false),
  );

  useEffect(() => {
    const handleResize = (): void => {
      if (useSmallScreen) {
        return;
      }
      setIsSmallScreen(window.innerWidth < 960);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Set hasSelectedDates based on initialDateFrom and initialDateTo
    setHasSelectedDates(
      Boolean(initialDateFrom && initialDateFrom !== "" && initialDateTo && initialDateTo !== ""),
    );
  }, [initialDateFrom, initialDateTo]);

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find(({ name }) => name === presetName);
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);

    // Utiliser initialDateTo comme référence, sinon aujourd'hui
    const referenceDate =
      initialDateTo && initialDateTo !== ""
        ? getDateAdjustedForTimezone(initialDateTo)
        : new Date();

    let from = new Date();
    let to = new Date();

    switch (preset.name) {
      case "previous14Days":
        to = new Date(referenceDate);
        from = new Date(referenceDate);
        from.setDate(referenceDate.getDate() - 13); // -13 pour inclure 14 jours
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "currentMonth":
        from = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
        from.setHours(0, 0, 0, 0);
        to = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "previousMonth":
        from = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1);
        from.setHours(0, 0, 0, 0);
        to = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "currentYear":
        from = new Date(to.getFullYear(), 0, 1);
        from.setHours(0, 0, 0, 0);
        to = new Date();
        to.setHours(23, 59, 59, 999);
        break;
      case "previousYear":
        from = new Date(referenceDate.getFullYear() - 1, 0, 1);
        from.setHours(0, 0, 0, 0);
        to = new Date(referenceDate.getFullYear() - 1, 11, 31);
        to.setHours(23, 59, 59, 999);
        break;
    }

    // Apply minDate and maxDate constraints
    if (minDate && from < minDate) {
      from.setTime(minDate.getTime());
    }
    if (maxDate && to > maxDate) {
      to.setTime(maxDate.getTime());
    }

    return { from, to };
  };

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset);
    setRange(range);
    if (rangeCompare) {
      const rangeCompare = {
        from: new Date(range.from.getFullYear() - 1, range.from.getMonth(), range.from.getDate()),
        to: range.to
          ? new Date(range.to.getFullYear() - 1, range.to.getMonth(), range.to.getDate())
          : undefined,
      };
      setRangeCompare(rangeCompare);
    }
  };

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);

      const normalizedRangeFrom = new Date(range.from);
      normalizedRangeFrom.setHours(0, 0, 0, 0);
      const normalizedPresetFrom = new Date(presetRange.from.setHours(0, 0, 0, 0));

      const normalizedRangeTo = new Date(range.to ?? 0);
      normalizedRangeTo.setHours(0, 0, 0, 0);
      const normalizedPresetTo = new Date(presetRange.to?.setHours(0, 0, 0, 0) ?? 0);

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }

    setSelectedPreset(undefined);
  };

  const resetValues = (): void => {
    // Update hasSelectedDates based on initialDateFrom and initialDateTo
    const hasValidDates = Boolean(
      initialDateFrom && initialDateFrom !== "" && initialDateTo && initialDateTo !== "",
    );
    setHasSelectedDates(hasValidDates);

    setRange({
      from:
        typeof initialDateFrom === "string" && initialDateFrom !== ""
          ? getDateAdjustedForTimezone(initialDateFrom)
          : new Date(),
      to:
        initialDateTo && initialDateTo !== ""
          ? typeof initialDateTo === "string"
            ? getDateAdjustedForTimezone(initialDateTo)
            : initialDateTo
          : undefined,
    });

    setRangeCompare(
      initialCompareFrom && initialCompareFrom !== "" && initialCompareTo && initialCompareTo !== ""
        ? {
            from:
              typeof initialCompareFrom === "string"
                ? getDateAdjustedForTimezone(initialCompareFrom)
                : initialCompareFrom,
            to: initialCompareTo
              ? typeof initialCompareTo === "string"
                ? getDateAdjustedForTimezone(initialCompareTo)
                : initialCompareTo
              : undefined,
          }
        : undefined,
    );
  };

  useEffect(() => {
    checkPreset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const PresetButton = ({
    preset,
    label,
    isSelected,
    onClick,
  }: {
    preset: string;
    label: string;
    isSelected: boolean;
    onClick?: () => void;
  }): JSX.Element => (
    <Button
      className={cn(isSelected && "pointer-events-none")}
      variant="ghost"
      onClick={() => {
        setPreset(preset);
        onClick?.();
      }}
    >
      <>
        <span className={cn("pr-2 opacity-0", isSelected && "opacity-70")}>
          <CheckIcon width={18} height={18} />
        </span>
        {label}
      </>
    </Button>
  );

  // Helper function to check if two date ranges are equal
  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b; // If either is undefined, return true if both are undefined
    return (
      a.from.getTime() === b.from.getTime() && (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    );
  };

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
      openedRangeCompareRef.current = rangeCompare;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isDateDisabled = (date: Date): boolean => {
    if (dayjs(date).isAfter(dayjs())) return true; // no future dates
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Simple DateInput component implementation
  const DateInput = ({ value, onChange }: { value?: Date; onChange: (date: Date) => void }) => {
    const dateString = value ? dayjs(value).format("YYYY-MM-DD") : "";

    return (
      <input
        type="date"
        value={dateString}
        onChange={(e) => {
          const newDate = new Date(e.target.value);
          if (!isNaN(newDate.getTime())) {
            onChange(newDate);
          }
        }}
        className="rounded-md border px-3 py-2"
      />
    );
  };

  const clearDateRange = () => {
    let defaultFrom: Date;
    let defaultTo: Date;

    if (noDefaultOnClear) {
      setRange({
        from: minDate ?? new Date(),
        to: maxDate ?? new Date(),
      });
      onUpdate?.({
        range: {
          from: dayjs(minDate ?? new Date()).format("YYYY-MM-DD"),
          to: dayjs(maxDate ?? new Date()).format("YYYY-MM-DD"),
        },
      });
      return;
    }

    if (minDate && maxDate) {
      // If both min and max dates are defined, use the full range
      defaultFrom = new Date(minDate);
      defaultTo = new Date(maxDate);
    } else if (maxDate) {
      // If only maxDate is defined, set range to one month before maxDate
      defaultTo = new Date(maxDate);
      defaultFrom = new Date(maxDate);
      defaultFrom.setMonth(defaultFrom.getMonth() - 1);
    } else {
      // Default to one month from today
      defaultTo = new Date();
      defaultFrom = new Date();
      defaultFrom.setMonth(defaultFrom.getMonth() - 1);
    }

    // Set hours for consistent time
    defaultFrom.setHours(0, 0, 0, 0);
    defaultTo.setHours(23, 59, 59, 999);

    setRange({ from: defaultFrom, to: defaultTo });
    setHasSelectedDates(true);

    onUpdate?.({
      range: {
        from: dayjs(defaultFrom).format("YYYY-MM-DD"),
        to: dayjs(defaultTo).format("YYYY-MM-DD"),
      },
    });
  };

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <div className="relative inline-block">
        <PopoverTrigger asChild>
          <Button
            size={"lg"}
            variant="outline"
            {...ButtonProps}
            className={cn(
              "flex w-full items-center justify-between border px-4 md:w-fit",
              "focus-visible:ring-ring focus-visible:ring-1",
              ButtonProps?.className,
            )}
          >
            <div className="text-left">
              <div>
                <div className="text-sm font-normal">
                  {hasSelectedDates && range.from && range.to
                    ? `${formatDate(range.from, date_format)} - ${formatDate(
                        range.to,
                        date_format,
                      )}`
                    : placeholder}
                </div>
              </div>
              {hasSelectedDates && rangeCompare?.from && rangeCompare?.to && (
                <div className="text-xs opacity-60">
                  <>
                    vs. {formatDate(rangeCompare.from, date_format)} -{" "}
                    {formatDate(rangeCompare.to, date_format)}
                  </>
                </div>
              )}
            </div>
            <div className="ml-8">
              <CalendarIcon className="h-4 w-4 opacity-60" />
            </div>
          </Button>
        </PopoverTrigger>
        {hasSelectedDates && (
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-accent hover:text-foreground absolute top-1/2 right-10 h-6 w-6 -translate-y-1/2 transform rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clearDateRange();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <PopoverContent align={align} className="z-99 w-fit">
        <div className="flex py-2">
          <div className="flex">
            <div className="flex flex-col">
              <div className="flex flex-col items-center justify-end gap-2 px-3 pb-4 lg:flex-row lg:items-start lg:pb-0">
                {showCompare && (
                  <div className="flex items-center space-x-2 py-1 pr-4">
                    <Switch
                      defaultChecked={Boolean(rangeCompare)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          if (!range.to) {
                            setRange({
                              from: range.from,
                              to: range.from,
                            });
                          }
                          setRangeCompare({
                            from: new Date(
                              range.from.getFullYear(),
                              range.from.getMonth(),
                              range.from.getDate() - 365,
                            ),
                            to: range.to
                              ? new Date(
                                  range.to.getFullYear() - 1,
                                  range.to.getMonth(),
                                  range.to.getDate(),
                                )
                              : new Date(
                                  range.from.getFullYear() - 1,
                                  range.from.getMonth(),
                                  range.from.getDate(),
                                ),
                          });
                        } else {
                          setRangeCompare(undefined);
                        }
                      }}
                      id="compare-mode"
                    />
                    <Label htmlFor="compare-mode">Compare</Label>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <DateInput
                      value={range.from}
                      onChange={(date) => {
                        const toDate = range.to == null || date > range.to ? date : range.to;
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: date,
                          to: toDate,
                        }));
                      }}
                    />
                    <div className="py-1">-</div>
                    <DateInput
                      value={range.to}
                      onChange={(date) => {
                        const fromDate = date < range.from ? date : range.from;
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: fromDate,
                          to: date,
                        }));
                      }}
                    />
                  </div>
                  {rangeCompare != null && (
                    <div className="flex gap-2">
                      <DateInput
                        value={rangeCompare?.from}
                        onChange={(date) => {
                          if (rangeCompare) {
                            const compareToDate =
                              rangeCompare.to == null || date > rangeCompare.to
                                ? date
                                : rangeCompare.to;
                            setRangeCompare((prevRangeCompare) => ({
                              ...prevRangeCompare,
                              from: date,
                              to: compareToDate,
                            }));
                          } else {
                            setRangeCompare({
                              from: date,
                              to: new Date(),
                            });
                          }
                        }}
                      />
                      <div className="py-1">-</div>
                      <DateInput
                        value={rangeCompare?.to}
                        onChange={(date) => {
                          if (rangeCompare && rangeCompare.from) {
                            const compareFromDate =
                              date < rangeCompare.from ? date : rangeCompare.from;
                            setRangeCompare({
                              ...rangeCompare,
                              from: compareFromDate,
                              to: date,
                            });
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {isSmallScreen && (
                <Select
                  defaultValue={selectedPreset}
                  onValueChange={(value) => {
                    setPreset(value);
                  }}
                >
                  <SelectTrigger className="mx-auto mb-2 w-[180px]">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div>
                <Calendar
                  mode="range"
                  onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                    if (value?.from != null) {
                      setRange({
                        from: value.from,
                        to: value?.to ?? value.from,
                      });
                      setHasSelectedDates(true);
                    }
                  }}
                  disabled={(date) => {
                    return isDateDisabled(date);
                  }}
                  selected={range}
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  defaultMonth={
                    new Date(new Date().setMonth(new Date().getMonth() - (isSmallScreen ? 0 : 1)))
                  }
                />
              </div>
            </div>
          </div>
          {!isSmallScreen && (
            <div className="flex flex-col items-end gap-1 pr-2">
              <div className="flex w-fit flex-col items-end gap-1 pr-2">
                {PRESETS.map((preset) => (
                  <PresetButton
                    key={preset.name}
                    preset={preset.name}
                    label={preset.label}
                    isSelected={selectedPreset === preset.name}
                    onClick={() => {
                      setPreset(preset.name);
                      setHasSelectedDates(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 py-2 pr-4">
          <Button
            onClick={() => {
              setIsOpen(false);
              resetValues();
            }}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              if (
                !areRangesEqual(range, openedRangeRef.current) ||
                !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
              ) {
                const formattedRange: DateRangeString = {
                  from: dayjs(range.from).format("YYYY-MM-DD"),
                  to: dayjs(range.to ?? range.from).format("YYYY-MM-DD"),
                };

                const formattedRangeCompare: DateRangeString | undefined = rangeCompare
                  ? {
                      from: dayjs(rangeCompare.from).format("YYYY-MM-DD"),
                      to: dayjs(rangeCompare.to ?? rangeCompare.from).format("YYYY-MM-DD"),
                    }
                  : undefined;

                onUpdate?.({
                  range: formattedRange,
                  rangeCompare: formattedRangeCompare,
                });
                setHasSelectedDates(true);
              }
            }}
          >
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const DateRangePicker = Object.assign(DateRangePickerComponent, {
  displayName: "DateRangePicker",
  filePath: "libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx",
});
