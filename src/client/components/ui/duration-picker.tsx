import { Input } from "@/client/components/ui/input";
import React from "react";

export interface DurationPickerProps {
  hours?: string;
  minutes?: string;
  seconds?: string;
  readOnly?: boolean;
  placeholder?: boolean;
  onDurationChange?: (duration: { hours: string; minutes: string; seconds: string }) => void;
}

export function DurationPicker({
  hours: initialHours = "",
  minutes: initialMinutes = "",
  seconds: initialSeconds = "",
  readOnly = false,
  placeholder = false,
  onDurationChange,
}: DurationPickerProps) {
  const [hours, setHours] = React.useState(initialHours);
  const [minutes, setMinutes] = React.useState(initialMinutes);
  const [seconds, setSeconds] = React.useState(initialSeconds);

  React.useEffect(() => {
    if (!placeholder) {
      setHours(initialHours);
      setMinutes(initialMinutes);
      setSeconds(initialSeconds);
    }
  }, [initialHours, initialMinutes, initialSeconds, placeholder]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setHours(value);
      onDurationChange?.({ hours: value, minutes, seconds });
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
      setMinutes(value);
      onDurationChange?.({ hours, minutes: value, seconds });
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
      setSeconds(value);
      onDurationChange?.({ hours, minutes, seconds: value });
    }
  };

  return (
    <div className="space-y-1">
      <div className="text-muted-foreground flex gap-4 text-sm">
        <span className="w-28 text-center">Hrs</span>
        <span className="w-28 text-center">Min</span>
        <span className="w-28 text-center">Sec</span>
      </div>
      <div className="flex items-center">
        <Input
          type="number"
          min={0}
          value={placeholder ? "" : hours}
          onChange={handleHoursChange}
          disabled={readOnly}
          placeholder="--"
          className="w-28 rounded-none border-0 border-b text-center focus-visible:border-b-2 focus-visible:ring-0"
        />
        <span className="mx-4">:</span>
        <Input
          type="number"
          min={0}
          max={59}
          value={placeholder ? "" : minutes}
          onChange={handleMinutesChange}
          disabled={readOnly}
          placeholder="--"
          className="w-28 rounded-none border-0 border-b text-center focus-visible:border-b-2 focus-visible:ring-0"
        />
        <span className="mx-4">:</span>
        <Input
          type="number"
          min={0}
          max={59}
          value={placeholder ? "" : seconds}
          onChange={handleSecondsChange}
          disabled={readOnly}
          placeholder="--"
          className="w-28 rounded-none border-0 border-b text-center focus-visible:border-b-2 focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
