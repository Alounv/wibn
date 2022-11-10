import type { Periods } from "~/utilities/periods";
import { days, dayPeriods } from "~/utilities/periods";

interface IPeriodsSelection {
  isDisabled?: boolean;
  periods: Periods[];
  areAllSelected?: boolean;
  legend?: string;
}

export const PeriodsSelection = ({
  isDisabled = false,
  areAllSelected = false,
  periods,
  legend,
}: IPeriodsSelection) => {
  return (
    <fieldset className="flex flex-col gap-2">
      {!isDisabled && legend && <legend className="mb-2">{legend}</legend>}

      <div key="label" className="flex gap-4 uppercase">
        <div className="mr-3 w-16" />

        {days.map((day) => {
          const id = `${day.id}-label`;
          return (
            <div className="text-sm" key={id}>
              {day.label[0]}
            </div>
          );
        })}
      </div>

      {dayPeriods.map((dayPeriod) => {
        return (
          <div key={dayPeriod.id} className="flex gap-3">
            <div className="w-20 capitalize">{dayPeriod.label}</div>

            {days.map((day) => {
              const id = `${day.id}-${dayPeriod.id}` as Periods;
              return (
                <input
                  key={id}
                  type="checkbox"
                  id={id}
                  value={id}
                  name="periods"
                  disabled={isDisabled}
                  defaultChecked={areAllSelected || periods.includes(id)}
                />
              );
            })}
          </div>
        );
      })}
    </fieldset>
  );
};
