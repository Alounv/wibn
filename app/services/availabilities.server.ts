import { getUserWithPeriods } from "~/models/user.server";
import { getNewDateWithAddedHours } from "~/utilities/dates.server";
import { Periods } from "../utilities/periods";
import { getUserEvents } from "./calendar.server";

interface IGetAvailablitiesFromEvents {
  start: Readonly<Date>;
  events: { start: Date; end: Date }[];
}

const getUserAvailabilitiesFromEvents = async ({
  start,
  events,
}: IGetAvailablitiesFromEvents): Promise<Periods[]> => {
  return Object.values(Periods).filter((_, i) => {
    const periodStart = getNewDateWithAddedHours(start, i * 8);
    const periodEnd = getNewDateWithAddedHours(periodStart, 8);

    const isAvailable = events.every(
      (e) => e.start > periodEnd || e.end < periodStart
    );

    return isAvailable;
  });
};

interface IGetUserAvailablities {
  userId: string;
  start: Readonly<Date>;
  end: Readonly<Date>;
}

export const getUserAvailabilities = async ({
  userId,
  start,
  end,
}: IGetUserAvailablities): Promise<Periods[]> => {
  const events = await getUserEvents({
    userId,
    start,
    end,
  });

  const eventsAvailabilities = await getUserAvailabilitiesFromEvents({
    start,
    events,
  });
  const { periods = [] } = (await getUserWithPeriods(userId)) || {};
  return eventsAvailabilities.filter((p) => !periods.includes(p));
};
