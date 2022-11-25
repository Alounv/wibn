import {
  getGroupsWithReminderNextWeek,
  getBestTimeForGroupOrPostpone,
} from "~/models/group.server";

export const checkGroupsForReminder = async () => {
  const groups = await getGroupsWithReminderNextWeek();

  await Promise.all(
    groups.map((g) =>
      getBestTimeForGroupOrPostpone(g.id, g.minParticipantsCount)
    )
  );
};
