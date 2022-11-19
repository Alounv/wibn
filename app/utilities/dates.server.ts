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

export const getCurrentWeek = (): { week: number; year: number } => {
  const now = new Date();
  const year = now.getFullYear();
  const week = getWeek(now);
  return { week, year };
};
