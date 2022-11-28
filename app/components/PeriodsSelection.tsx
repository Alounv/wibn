import type { ReactNode } from "react";
import type { Periods } from "~/utilities/periods";
import { days, dayPeriods } from "~/utilities/periods";

interface IPeriodsSelection {
  isDisabled?: boolean;
  periods: Periods[];
  areAllSelected?: boolean;
  children?: ReactNode;
  variant?: "blue" | "red" | "green";
}

export const PeriodsSelection = ({
  isDisabled = false,
  areAllSelected = false,
  periods,
  children,
  variant = "blue",
}: IPeriodsSelection) => {
  const accent = `accent-${variant}-500`;
  const disabledClass = isDisabled ? "opacity-50 pointer-events-none" : "";
  return (
    <fieldset className="flex flex-col gap-2">
      {children}

      <div key="label" className="flex gap-2 uppercase">
        <div className="mr-3 w-16" />

        {days.map((day) => {
          const id = `${day.id}-label`;
          return (
            <div className="w-8 text-center" key={id}>
              {day.label[0]}
            </div>
          );
        })}
      </div>

      {dayPeriods.map((dayPeriod) => {
        return (
          <div key={dayPeriod.id} className="flex gap-2">
            <div className="w-20 capitalize">{dayPeriod.label}</div>

            {days.map((day) => {
              const id = `${day.id}-${dayPeriod.id}` as Periods;
              const isChecked = areAllSelected || periods.includes(id);
              return (
                <input
                  className={`w-8 ${accent} ${disabledClass}`}
                  key={id}
                  type="checkbox"
                  id={id}
                  value={id}
                  name="periods"
                  defaultChecked={isChecked}
                  {...(isDisabled && { checked: isChecked })}
                  {...(isDisabled && { readOnly: true })}
                />
              );
            })}

            <div className="text-gray-400">{dayPeriod.hours}</div>
          </div>
        );
      })}

      <div className="none accent-red-500" />
      <div className="none accent-green-500" />
    </fieldset>
  );
};
