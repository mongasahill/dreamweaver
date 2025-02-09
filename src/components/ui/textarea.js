import * as React from "react";

export function Textarea({ value, onChange, className }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className={`border rounded p-2 w-full ${className}`}
    />
  );
}

