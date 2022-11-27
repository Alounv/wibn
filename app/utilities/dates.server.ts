import invariant from "tiny-invariant";

// https://weeknumber.com/how-to/javascript
const getWeekNumber = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    2 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

export const getNewDateWithAddedHours = (
  date: Readonly<Date>,
  hours: number
): Date => {
  const newDate = new Date(date);
  newDate.setHours(date.getHours() + hours);
  return newDate;
};

// https://stackoverflow.com/questions/16590500/calculate-date-from-week-number-in-javascript
export const getWeekLimits = ({
  week,
  year,
}: {
  week: number;
  year: number;
}): { start: Date; end: Date } => {
  const start = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = start.getDay();

  if (dayOfWeek <= 4) {
    start.setDate(start.getDate() - start.getDay() + 1);
  } else {
    start.setDate(start.getDate() + 8 - start.getDay());
  }

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
};

export const getWeek = (
  date: Readonly<Date>
): { week: number; year: number } => {
  const year = date.getFullYear();
  const week = getWeekNumber(date);

  return {
    week,
    year: week === 54 && date.getMonth() === 11 ? year - 1 : year,
  };
};

export const getCurrentWeek = (): { week: number; year: number } => {
  const now = new Date();
  return getWeek(now);
};

const locale = "fr-FR";

const format: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const getFormattedDate = (date: Date | null): string => {
  return date ? date.toLocaleDateString(locale, format) : "";
};

export const getWeeksData = ({
  year: stringYear,
  week: stringWeek,
}: {
  year: string | undefined;
  week: string | undefined;
}) => {
  invariant(stringWeek, "week not found");
  invariant(stringYear, "year not found");

  const week = Number(stringWeek);
  const year = Number(stringYear);

  const { start, end } = getWeekLimits({ week, year });

  const nextWeekMiddle = getNewDateWithAddedHours(start, 24 * 3);
  const nextWeek = getWeek(nextWeekMiddle);

  const previousWeekMiddle = getNewDateWithAddedHours(start, -24 * 3);
  const previousWeek = getWeek(previousWeekMiddle);

  const currentWeek = getCurrentWeek();
  return {
    start,
    end,
    previousWeek,
    nextWeek,
    currentWeek,
  };
};
