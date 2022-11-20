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
}: IGetUserAvailablities): Promise<{
  availabilities: Periods[];
  error: string;
}> => {
  const { events, error } = await getUserEvents({
    userId,
    start,
    end,
  });

  const eventsAvailabilities = await getUserAvailabilitiesFromEvents({
    start,
    events,
  });
  const { periods = [] } = (await getUserWithPeriods(userId)) || {};
  return {
    availabilities: eventsAvailabilities.filter((p) => !periods.includes(p)),
    error,
  };
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
}: IGetGroupAvailablities) => {
  const usersAvailabilities = await Promise.all(
    users.map(async ({ id: userId }) =>
      getUserAvailabilities({ userId, start, end })
    )
  );

  const usersWithAvailabilities = usersAvailabilities.map(
    ({ availabilities, error }, i) => ({
      email: users[i].email,
      availabilities,
      error,
    })
  );

  const results = possibilities.reduce((acc, slot) => {
    const availableUsers = usersWithAvailabilities.reduce(
      (acc, { email, availabilities, error }) => {
        if (availabilities.includes(slot)) {
          acc.push({ email, error });
        }
        return acc;
      },
      [] as { email: string; error: string }[]
    );

    return { ...acc, [slot]: availableUsers };
  }, {} as Record<Periods, { email: string; error: string }[]>);

  return results;
};
