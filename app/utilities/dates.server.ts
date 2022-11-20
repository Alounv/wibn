import invariant from "tiny-invariant";

// https://weeknumber.com/how-to/javascript
export const getWeek = (date: Date) => {
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
  start.setDate(start.getDate() + (1 - start.getDay()));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};

const getCurrentWeek = (): { week: number; year: number } => {
  const now = new Date();
  const year = now.getFullYear();
  const week = getWeek(now);
  return { week, year };
};

const locale = "fr-FR";

const format: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const getFormattedDate = (date: Date): string =>
  date.toLocaleDateString(locale, format);

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

  const previousWeek =
    week === 1 ? { week: 52, year: year - 1 } : { week: week - 1, year };

  const nextWeek =
    week === 52 ? { week: 1, year: year + 1 } : { week: week + 1, year };

  const currentWeek = getCurrentWeek();
  return {
    start,
    end,
    previousWeek,
    nextWeek,
    currentWeek,
  };
};
