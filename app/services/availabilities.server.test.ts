import { getUserAvailabilities } from "./availabilities.server";

vi.mock("./calendar.server", () => ({
  getUserEvents: ({ userId }: { userId: string }) => {
    if (userId === "user3") {
      return {
        events: [
          {
            start: new Date("2022-12-20T10:00:00.000Z"),
            end: new Date("2022-12-20T14:00:00.000Z"),
          },
          {
            start: new Date("2022-12-22T19:00:00.000Z"),
            end: new Date("2022-12-22T20:00:00.000Z"),
          },
        ],
      };
    }
    return { events: [] };
  },
}));

vi.mock("~/models/user.server", () => ({
  getUserWithPeriods: (userId: string) => {
    if (userId === "user2") {
      return { periods: ["MO-M", "TU-A"] };
    }
    return { periods: [] };
  },
}));

describe("availabilities", () => {
  describe("getUserAvailabilities", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    test("returns all periods if no events and no fixed constraints", async () => {
      const start = new Date("2022-12-19T00:00:00.000Z");
      const end = new Date("2022-12-26T00:00:00.000Z");
      const userId = "user1";

      const { availabilities, error } = await getUserAvailabilities({
        userId,
        start,
        end,
      });

      expect(error).toBeUndefined();
      expect(availabilities).toHaveLength(21);
    });

    test("returns periods without user fixed constraints", async () => {
      const start = new Date("2022-12-19T00:00:00.000Z");
      const end = new Date("2022-12-26T00:00:00.000Z");
      const userId = "user2";

      const { availabilities, error } = await getUserAvailabilities({
        userId,
        start,
        end,
      });

      expect(error).toBeUndefined();
      expect(availabilities).toHaveLength(19);
      expect(availabilities).not.toContainEqual("MO-M");
      expect(availabilities).not.toContainEqual("TU-A");
    });

    test("returns periods without user fixed constraints and remove events", async () => {
      const start = new Date("2022-12-19T00:00:00.000Z");
      const end = new Date("2022-12-26T00:00:00.000Z");
      const userId = "user3";

      const { availabilities, error } = await getUserAvailabilities({
        userId,
        start,
        end,
      });

      expect(error).toBeUndefined();
      expect(availabilities).toHaveLength(18);

      expect(availabilities).toContainEqual("MO-E");
      expect(availabilities).not.toContainEqual("TU-M");
      expect(availabilities).not.toContainEqual("TU-A");
      expect(availabilities).toContainEqual("WE-M");

      expect(availabilities).toContainEqual("TH-M");
      expect(availabilities).not.toContainEqual("TH-E");
      expect(availabilities).toContainEqual("FR-M");
    });
  });
});
