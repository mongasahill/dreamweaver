import * as React from "react";

export function Input({ type = "text", value, onChange, className }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`border rounded p-2 w-full ${className}`}
    />
  );
}
