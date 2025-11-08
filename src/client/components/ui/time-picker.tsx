import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import React from "react";

export interface TimePickerProps {
  hours?: number;
  minutes?: number;
  period?: "AM" | "PM";
  readOnly?: boolean;
  placeholder?: boolean;
  onTimeChange?: (time: { hours: number; minutes: number; period: "AM" | "PM" }) => void;
}

export function TimePicker({
  hours: initialHours = 12,
  minutes: initialMinutes = 0,
  period: initialPeriod = "AM",
  readOnly = false,
  placeholder = false,
  onTimeChange,
}: TimePickerProps) {
  const [hours, setHours] = React.useState<number>(initialHours);
  const [minutes, setMinutes] = React.useState<number>(initialMinutes);
  const [period, setPeriod] = React.useState<"AM" | "PM">(initialPeriod);

  React.useEffect(() => {
    if (!placeholder) {
      setHours(initialHours);
      setMinutes(initialMinutes);
      setPeriod(initialPeriod);
    }
  }, [initialHours, initialMinutes, initialPeriod, placeholder]);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);

    if (isNaN(value)) {
      value = 12;
    }

    if (value < 1) value = 1;
    if (value > 12) value = 12;

    setHours(value);
    onTimeChange?.({ hours: value, minutes, period });
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);

    if (isNaN(value)) {
      value = 0;
    }

    if (value < 0) value = 0;
    if (value > 59) value = 59;

    setMinutes(value);
    onTimeChange?.({ hours, minutes: value, period });
  };

  const handlePeriodChange = (value: "AM" | "PM") => {
    setPeriod(value);
    onTimeChange?.({ hours, minutes, period: value });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <input
          type="number"
          value={placeholder ? "" : hours}
          onChange={handleHourChange}
          min={1}
          max={12}
          disabled={readOnly}
          placeholder="--"
          className="w-20 rounded-md border px-2 py-1 text-center disabled:opacity-50"
        />
        <span className="mx-1">:</span>
        <input
          type="number"
          value={placeholder ? "" : minutes.toString().padStart(2, "0")}
          onChange={handleMinuteChange}
          min={0}
          max={59}
          disabled={readOnly}
          placeholder="--"
          className="w-20 rounded-md border px-2 py-1 text-center disabled:opacity-50"
        />
      </div>
      <Select
        value={placeholder ? undefined : period}
        onValueChange={handlePeriodChange}
        disabled={readOnly}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
