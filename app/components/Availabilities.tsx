import type { D, P, Periods } from "~/utilities/periods";
import { days, dayPeriods } from "~/utilities/periods";

interface ISlot extends IAvailabilities {
  day: { label: string; id: D };
  dayPeriod: { label: string; id: P };
}

const Slot = ({
  day,
  dayPeriod,
  possibilities,
  availabilities,
  areDisconnectedVisible,
}: ISlot) => {
  const id = `${day.id}-${dayPeriod.id}` as Periods;

  if (!possibilities.includes(id)) {
    return <div key={id} className="w-8 bg-gray-200 text-center" />;
  }

  const dayAvailabilities = availabilities[id] || [];
  const usedAvailabilities = areDisconnectedVisible
    ? dayAvailabilities
    : dayAvailabilities.filter((a) => !a.error);

  const count = usedAvailabilities.length;
  const emails = usedAvailabilities.map(({ email }) => email) || [];
  const tooltip = emails.join("\n") || "Nobody";
  const value = Math.min(Math.max(50, count * 100), 900);
  return (
    <div
      title={tooltip}
      className={`w-8 bg-green-${value} cursor-default text-center`}
      key={id}
    >
      {count}
    </div>
  );
};

interface IAvailabilities {
  availabilities: Record<Periods, { email: string; error: string }[]>;
  possibilities: Periods[];
  areDisconnectedVisible: boolean;
}

export const Availabilities = ({
  availabilities,
  possibilities,
  areDisconnectedVisible,
}: IAvailabilities) => {
  return (
    <div className="flex flex-col gap-2">
      <div key="label" className="flex gap-3 uppercase">
        <div className="mr-3 w-16" />

        {days.map((day) => (
          <div className="w-8 text-center" key={`${day.id}-label`}>
            {day.label[0]}
          </div>
        ))}
      </div>

      {dayPeriods.map((dayPeriod) => (
        <div key={dayPeriod.id} className="flex gap-3">
          <div className="w-20 capitalize">{dayPeriod.label}</div>
          {days.map((day) => (
            <Slot
              key={dayPeriod.id}
              day={day}
              dayPeriod={dayPeriod}
              availabilities={availabilities}
              possibilities={possibilities}
              areDisconnectedVisible={areDisconnectedVisible}
            />
          ))}
        </div>
      ))}

      <div className="none">
        {/* so tailwind had thoses colors loaded */}
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
