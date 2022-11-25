import {
  getNewDateWithAddedHours,
  getWeekLimits,
  getWeek,
  getCurrentWeek,
  getWeeksData,
} from "./dates.server";

describe("date utilities", () => {
  beforeAll(() => {
    vitest.useFakeTimers();
    vitest.setSystemTime(new Date("2021-01-01T00:00:00.000Z"));
  });

  describe("getNewDateWithAddedHours", () => {
    test("returns date with added hours", () => {
      const date = new Date("2021-04-04T03:00:00.000Z");
      const hoursToAdd = 3;

      const newDate = getNewDateWithAddedHours(date, hoursToAdd);

      expect(newDate).toStrictEqual(new Date("2021-04-04T06:00:00.000Z"));
    });

    test("returns date with added hours", () => {
      const date = new Date("2021-04-04T22:00:00.000Z");
      const hoursToAdd = 4;

      const newDate = getNewDateWithAddedHours(date, hoursToAdd);

      expect(newDate).toStrictEqual(new Date("2021-04-05T02:00:00.000Z"));
    });
  });

  describe("getWeekLimits", () => {
    test("returns week limits", () => {
      const week = 1;
      const year = 2023;

      const { start, end } = getWeekLimits({ week, year });

      expect(start).toStrictEqual(new Date("2023-01-02T00:00:00.000Z"));
      expect(end).toStrictEqual(new Date("2023-01-09T00:00:00.000Z"));
    });

    test("returns week limits", () => {
      const week = 2;
      const year = 2023;

      const { start, end } = getWeekLimits({ week, year });

      expect(start).toStrictEqual(new Date("2023-01-09T00:00:00.000Z"));
      expect(end).toStrictEqual(new Date("2023-01-16T00:00:00.000Z"));
    });
  });

  describe("getWeek", () => {
    test("returns week", () => {
      const date = new Date("2021-04-04T03:00:00.000Z");

      const { week, year } = getWeek(date);

      expect(week).toBe(14);
      expect(year).toBe(2021);
    });

    test("returns week even when fist of the year", () => {
      const date = new Date("2021-01-01T00:00:00.000Z");

      const { week, year } = getWeek(date);

      expect(week).toBe(54);
      expect(year).toBe(2020);
    });
  });

  describe("getCurrentWeek", () => {
    test("returns current week", () => {
      const { week, year } = getCurrentWeek();

      expect(week).toBe(54);
      expect(year).toBe(2020);
    });
  });

  describe("getWeeksData", () => {
    test("returns weeks data", () => {
      const year = "2023";
      const week = "1";

      const { start, end, previousWeek, nextWeek, currentWeek } = getWeeksData({
        year,
        week,
      });

      expect(start).toStrictEqual(new Date("2023-01-02T00:00:00.000Z"));
      expect(end).toStrictEqual(new Date("2023-01-09T00:00:00.000Z"));
      expect(currentWeek.year).toBe(2020);
      expect(currentWeek.week).toBe(54);
      expect(nextWeek.year).toBe(2023);
      expect(nextWeek.week).toBe(2);
      expect(previousWeek.year).toBe(2022);
      expect(previousWeek.week).toBe(53);
    });
  });
});
