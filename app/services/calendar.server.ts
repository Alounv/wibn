import { OAuth2Client } from "google-auth-library";
import { calendar_v3, google } from "googleapis";
import invariant from "tiny-invariant";
import { getUserToken } from "~/models/user.server";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ORIGIN } = process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${ORIGIN}/api/auth/google/callback`
);

const getOauth2Client = async (userId: string): Promise<OAuth2Client> => {
  const { refresh, access } = (await getUserToken(userId)) || {};
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

const getDateFromEventDate = (date: calendar_v3.Schema$EventDateTime): Date => {
  const stringDate = date.dateTime || date.date;
  invariant(stringDate, "date must be defined");
  return new Date(stringDate);
};

const getCalendarEvents = async (
  calendar: calendar_v3.Calendar,
  calendarsIds: string[],
  start: Date,
  end: Date
): Promise<calendar_v3.Schema$Event[]> => {
  const promises = calendarsIds.map(async (calendarId) => {
    const { data } = await calendar.events.list({
      calendarId: calendarId as string,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      timeZone: "Europe/Paris",
    });
    return data.items || [];
  });

  const results = await Promise.all(promises);

  return results.flat();
};

const getEventsWithDates = (calendarEvents: calendar_v3.Schema$Event[]) => {
  return calendarEvents.map((event) => {
    if (!event.start || !event.end) return null;
    return {
      start: getDateFromEventDate(event.start),
      end: getDateFromEventDate(event.end),
    };
  });
};

interface IGetUserEventsFromAuth {
  auth: OAuth2Client;
  start: Date;
  end: Date;
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
  return getUserEventsFromAuth({ auth, start, end });
};
