import { Periods } from "../utilities/periods";
import { getUserEvents } from "./calendar.server";

const addHours = (date: Date, hours: number): Date => {
  date.setHours(date.getHours() + hours);
  return date;
};

const getWeekLimits = (date: Date): { start: Date; end: Date } => {
  const day = date.getDay();
  const startDiff = date.getDate() - day + (day === 0 ? -6 : 1);
  const endDiff = date.getDate() - day + (day === 0 ? -6 : 1) + 6;
  return {
    start: new Date(date.setDate(startDiff)),
    end: new Date(date.setDate(endDiff)),
  };
};

interface IGetAvailablitiesFromEvents {
  start: Date;
  events: { start: Date; end: Date }[];
}

const getUserAvailabilitiesFromEvents = async ({
  start,
  events,
}: IGetAvailablitiesFromEvents) => {
  return Object.values(Periods).filter((_, i) => {
    const periodStart = addHours(start, i * 8);
    const periodEnd = addHours(periodStart, 1);

    const isAvailable = events.every(
      (e) => e.start > periodEnd || e.end < periodStart
    );

    return isAvailable;
  });
};

interface IGetUserAvailablities {
  date: Date;
  userId: string;
}

export const getUserAvailabilities = async ({
  date,
  userId,
}: IGetUserAvailablities): Promise<Periods[]> => {
  const { start, end } = getWeekLimits(date);

  const events = await getUserEvents({
    userId,
    start,
    end,
  });

  return getUserAvailabilitiesFromEvents({ start, events });
};
