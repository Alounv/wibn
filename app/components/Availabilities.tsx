import type { Periods } from "~/utilities/periods";
import { days, dayPeriods } from "~/utilities/periods";

interface IAvailabilities {
  availabilities: Record<Periods, string[]>;
  possibilities: Periods[];
}

export const Availabilities = ({
  availabilities,
  possibilities,
}: IAvailabilities) => {
  return (
    <div className="flex flex-col gap-2">
      <div key="label" className="flex gap-3 uppercase">
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
          <div key={dayPeriod.id} className="flex gap-3">
            <div className="w-20 capitalize">{dayPeriod.label}</div>

            {days.map((day) => {
              const id = `${day.id}-${dayPeriod.id}` as Periods;

              if (!possibilities.includes(id)) {
                return <div key={id} className="w-8 bg-gray-200 text-center" />;
              }

              const count = availabilities[id]?.length || 0;
              const value = Math.min(Math.max(50, count * 100), 900);
              return (
                <div className={`w-8 bg-green-${value} text-center`} key={id}>
                  {count}
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="none">
        {/* so tailwind had thoes colors loaded */}
        <div className="bg-green-50" />
        <div className="bg-green-100" />
        <div className="bg-green-200" />
        <div className="bg-green-300" />
        <div className="bg-green-400" />
        <div className="bg-green-500" />
        <div className="bg-green-600" />
        <div className="bg-green-700" />
        <div className="bg-green-800" />
        <div className="bg-green-900" />
      </div>
    </div>
  );
};
