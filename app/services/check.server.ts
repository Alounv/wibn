import {
  getGroupsWithReminderNextWeek,
  getBestTimeForGroupOrPostpone,
} from "~/models/group.server";

export const checkGroupsForReminder = async () => {
  const groups = await getGroupsWithReminderNextWeek();
  console.info(
    `Found ${groups.length} groups with reminder next week: ${groups
      .map((g) => g.name)
      .join(", ")}`
  );

  await Promise.all(
    groups.map((g) =>
      getBestTimeForGroupOrPostpone(g.id, g.minParticipantsCount)
    )
  );
};
