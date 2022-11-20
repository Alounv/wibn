import type { ForwardedRef } from "react";
import { forwardRef } from "react";

interface ILabelledSelect {
  label: string;
  error: string | null | undefined;
  value?: string;
  name: string;
  options: { value: string; label: string }[];
}

export const LabelledSelect = forwardRef<HTMLSelectElement, ILabelledSelect>(
  ({ label, error, name, value, options }, ref) => {
    const commonProps = {
      name,
      defaultValue: value,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${name}-error` : undefined,
      className:
        "flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose",
    };

    return (
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>{label}</span>
          <select {...commonProps} ref={ref as ForwardedRef<HTMLSelectElement>}>
            {options.map(({ value, label }) => (
              <option value={value}>{label}</option>
            ))}
          </select>
        </label>
        {error && (
          <div className="pt-1 text-red-700" id="name-error">
            {error}
          </div>
        )}
      </div>
    );
  }
);
