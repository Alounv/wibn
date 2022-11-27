import { forwardRef } from "react";

interface ILabelledNumberInput {
  label: string;
  error: string | null | undefined;
  value?: number;
  name: string;
  min?: number;
  max?: number;
  step?: number;
}

export const LabelledNumberInput = forwardRef<
  HTMLInputElement,
  ILabelledNumberInput
>(({ label, error, name, value, min, max, step }, ref) => {
  const props = {
    type: "number",
    ref,
    min,
    max,
    step,
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
        <input {...props} />
      </label>
      {error && (
        <div className="pt-1 text-red-700" id="name-error">
          {error}
        </div>
      )}
    </div>
  );
});
