"use client";

import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function TimePicker({ value, onChange, disabled }: TimePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="time">Time</Label>
      <Input
        id="time"
        type="time"
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
} 