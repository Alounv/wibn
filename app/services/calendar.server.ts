import type { OAuth2Client } from "google-auth-library";
import type { calendar_v3 } from "googleapis";
import { google } from "googleapis";
import { getUserToken } from "~/models/user.server";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ORIGIN } = process.env;

const getOauth2Client = async (
  userId: string
): Promise<OAuth2Client | undefined> => {
  const { refresh, access } = (await getUserToken(userId)) || {};

  if (!refresh && !access) {
    console.error("===> No refresh or access token for user", userId);
    return;
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${ORIGIN}/api/auth/google/callback`
  );
  oauth2Client.setCredentials({
    refresh_token: refresh,
    access_token: access,
  });
  return oauth2Client;
};

const getCalendar = (auth: OAuth2Client): calendar_v3.Calendar => {
  return google.calendar({ version: "v3", auth });
};

const getCalendarsIds = async (
  calendar: calendar_v3.Calendar
): Promise<string[]> => {
  const calendarList = await calendar.calendarList.list();
  const calendars = calendarList.data.items || [];
  return calendars.map((i) => i.id as string);
};

const getCalendarEvents = async (
  calendar: calendar_v3.Calendar,
  calendarsIds: string[],
  start: Readonly<Date>,
  end: Readonly<Date>
): Promise<calendar_v3.Schema$TimePeriod[]> => {
  const requestBody = {
    items: calendarsIds.map((id) => ({ id })),
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    timeZone: "Europe/Paris",
  };
  const { data = {} } = await calendar.freebusy.query({ requestBody });
  const calendars = Object.values(data.calendars || {});

  return calendars.flatMap((c) => c.busy || []);
};

const getEventsWithDates = (busyEvents: calendar_v3.Schema$TimePeriod[]) => {
  return busyEvents
    .filter((e) => e.start && e.end)
    .map((e) => ({
      start: new Date(e.start as string),
      end: new Date(e.end as string),
    }));
};

interface IGetUserEventsFromAuth {
  auth: OAuth2Client;
  start: Readonly<Date>;
  end: Readonly<Date>;
}

const getUserEventsFromAuth = async ({
  auth,
  start,
  end,
}: IGetUserEventsFromAuth) => {
  const calendar = getCalendar(auth);
  const calendarsIds = await getCalendarsIds(calendar);
  const calendarEvents = await getCalendarEvents(
    calendar,
    calendarsIds,
    start,
    end
  );
  return getEventsWithDates(calendarEvents);
};

interface IGetUserEvents extends Omit<IGetUserEventsFromAuth, "auth"> {
  userId: string;
}

export const getUserEvents = async ({ userId, start, end }: IGetUserEvents) => {
  const auth = await getOauth2Client(userId);
  if (!auth)
    return {
      error: "no google calendar authentication",
      events: [],
    };

  try {
    const events = await getUserEventsFromAuth({ auth, start, end });
    return { error: "", events };
  } catch (error) {
    return { error: (error as Error).message, events: [] };
  }
};

// makes no sense to test this function as it is just a wrapper around google api. We will use e2e to check this.
