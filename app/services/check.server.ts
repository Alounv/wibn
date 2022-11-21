import { getGroupsWithReminderToday } from "~/models/group.server";

export const checkGroupsForReminder = async () => {
  const groups = await getGroupsWithReminderToday();

  for (const group of groups) {
    const { bestTime, participants } = await getBestTimeForGroup(group.id);

    console.log("bestTime", bestTime);
    console.log("participants", participants);
  }
};
