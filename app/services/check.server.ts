import {
  getGroupsWithReminderToday,
  getBestTimeForGroupOrPostpone,
} from "~/models/group.server";

export const checkGroupsForReminder = async () => {
  const groups = await getGroupsWithReminderToday();

  await Promise.all(
    groups.map((g) =>
      getBestTimeForGroupOrPostpone(g.id, g.minParticipantsCount)
    )
  );
};
