import type {ForwardedRef} from "react";
import {forwardRef} from "react";

interface ILabelledInput {
  label: string;
  error: string | null | undefined;
  value?: string;
  name: string;
  rows?: number;
}

export const LabelledInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  ILabelledInput
>(({label, error, name, value, rows}, ref) => {
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
        {rows ? (
          <textarea
            {...commonProps}
            ref={ref as ForwardedRef<HTMLTextAreaElement>}
            rows={rows}
          />
        ) : (
          <input {...commonProps} ref={ref as ForwardedRef<HTMLInputElement>} />
        )}
      </label>
      {error && (
        <div className="pt-1 text-red-700" id="name-error">
          {error}
        </div>
      )}
    </div>
  );
});
