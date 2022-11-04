import { days, periods } from "~/utilities/periods";

interface IPeriodsSelection {
  isDisabled?: boolean;
}

export const PeriodsSelection = ({ isDisabled = false }: IPeriodsSelection) => {
  return (
    <fieldset className="flex flex-col gap-2">
      {!isDisabled && (
        <legend className="mb-2">
          Select possible periods for the group to meet.
        </legend>
      )}

      <div key="label" className="flex gap-4 uppercase">
        <div className="mr-2 w-16" />
        {days.map((day) => {
          const id = `${day}-label`;
          return <div key={id}>{day[0]}</div>;
        })}
      </div>
      {periods.map((period) => {
        return (
          <div key={period} className="flex gap-3">
            <div className="w-20 capitalize">{period}</div>
            {days.map((day) => {
              const id = `${day}-${period}`;
              return (
                <input
                  key={id}
                  type="checkbox"
                  id={id}
                  name="periods"
                  disabled={isDisabled}
                />
              );
            })}
          </div>
        );
      })}
    </fieldset>
  );
};
