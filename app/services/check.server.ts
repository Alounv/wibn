import type { Group } from "~/models/group.server";
import {
  getGroupsWithReminderNextWeek,
  postponeReminder,
} from "~/models/group.server";
import type { Periods } from "~/utilities/periods";
import { getBestTimeForGroup } from "./availabilities.server";
import { sendMail } from "./mail.server";

interface ISendGroupReminder {
  to: string;
  groupName: string;
  participantCount: number;
  weekDay: string;
  dayPeriod: string;
}

export const sendGroupReminder = async ({
  to,
  groupName,
  participantCount,
  weekDay,
  dayPeriod,
}: ISendGroupReminder) =>
  sendMail({
    to,
    from: "Dispo App <dispo.wibn@gmail.com>",
    subject: `Retrouvez-vous avec le groupe « ${groupName} »`,
    text: `${participantCount} personnes du groupe « ${groupName} » sont disponibles la semaine prochaine le ${weekDay} ${dayPeriod} !`,
    html: `<strong>${participantCount} personnes</strong> du groupe <strong>« ${groupName} »</strong> sont disponibles la semaine prochaine le <strong>${weekDay} ${dayPeriod}</strong> !`,
  });

const dayPeriods = {
  M: "matin 🛌",
  A: "après-midi ☀️",
  E: "soir 🌙",
};

const weekDays = {
  MO: "lundi",
  TU: "mardi",
  WE: "mercredi",
  TH: "jeudi",
  FR: "vendredi",
  SA: "samedi",
  SU: "dimanche",
};

const sendReminder = async ({
  time,
  emails,
  groupName,
}: {
  time: Periods;
  emails: string[];
  groupName: string;
}) => {
  const [day, period] = time.split("-");
  await sendGroupReminder({
    to: emails.join(", "),
    groupName,
    participantCount: emails.length,
    weekDay: weekDays[day as keyof typeof weekDays],
    dayPeriod: dayPeriods[period as keyof typeof dayPeriods],
  });
};

export const checkGroupsForReminder = async () => {
  const groups = await getGroupsWithReminderNextWeek();
  console.info(
    `Found ${groups.length} groups with reminder next week: ${groups
      .map((g) => g.name)
      .join(", ")}`
  );

  await Promise.all(groups.map((g) => getBestTimeForGroupOrPostpone(g)));
};

const getBestTimeForGroupOrPostpone = async ({
  id,
  name,
  minParticipantsCount,
  periodicity,
  reminder,
}: Pick<
  Group,
  "id" | "name" | "minParticipantsCount" | "periodicity" | "reminder"
>) => {
  const result = await getBestTimeForGroup(id, minParticipantsCount);

  if (result) {
    try {
      await sendReminder({
        groupName: name,
        emails: result.participants,
        time: result.time,
      });
    } catch (e) {
      console.error(`Error while sending reminder for group ${name}`, e);
    }
    await postponeReminder({ id, days: periodicity, reminder });
    console.info(`Reminder sent for group ${name} and postone one month`);
  } else {
    await postponeReminder({ id, days: 7, reminder });
    console.info(`Postpone reminder for group ${name}`);
  }
};
