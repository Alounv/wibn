import { Periods, days, dayPeriods } from "~/utilities/periods";

interface IAvailabilities {
  availabilities: Record<Periods, string[]>;
}

export const Availabilities = ({ availabilities }: IAvailabilities) => {
  return (
    <div className="flex flex-col gap-2">
      <div key="label" className="flex gap-3 uppercase">
        <div className="mr-3 w-16" />

        {days.map((day) => {
          const id = `${day.id}-label`;
          return (
            <div className="w-8 text-sm" key={id}>
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
              const count = availabilities[id].length;
              const value = Math.min(count * 100, 900);
              return (
                <div className={`w-8 bg-red-${value} text-center`} key={id}>
                  {count}
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="none">
        {/* so tailwind had thoes colors loaded */}
        <div className="bg-red-100" />
        <div className="bg-red-200" />
        <div className="bg-red-300" />
        <div className="bg-red-400" />
        <div className="bg-red-500" />
        <div className="bg-red-600" />
        <div className="bg-red-700" />
        <div className="bg-red-800" />
        <div className="bg-red-900" />
      </div>
    </div>
  );
};
