import type { User } from "~/models/user.server";
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

interface IGetGroupAvailablities {
  users: User[];
  start: Readonly<Date>;
  end: Readonly<Date>;
  possibilities: Periods[];
}

export const getGroupUsersAvailabilities = async ({
  users,
  start,
  end,
  possibilities,
}: IGetGroupAvailablities): Promise<Record<Periods, string[]>> => {
  const usersAvailabilities = await Promise.all(
    users.map(async ({ id: userId }) =>
      getUserAvailabilities({ userId, start, end })
    )
  );

  const usersWithAvailabilities = usersAvailabilities.map(
    (availabilities, i) => ({
      email: users[i].email,
      availabilities,
    })
  );

  const results = possibilities.reduce((acc, slot) => {
    const availableUsers = usersWithAvailabilities.reduce(
      (acc, { email, availabilities }) => {
        if (availabilities.includes(slot)) {
          acc.push(email);
        }
        return acc;
      },
      [] as string[]
    );

    return { ...acc, [slot]: availableUsers };
  }, {} as Record<Periods, string[]>);

  return results;
};
