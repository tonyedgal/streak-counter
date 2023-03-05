import { JSDOM } from "jsdom";
import { streakCounter } from "../src/index";

describe("streakCounter", () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });

    mockLocalStorage = mockJSDom.window.localStorage;
  });

  it("should return a streak object with currentCount, startDate and lastLoginDate", () => {
    const date = new Date();
    const streak = streakCounter(mockLocalStorage, date);

    expect(streak.hasOwnProperty("currentCount")).toBe(true);
    expect(streak.hasOwnProperty("startDate")).toBe(true);
    expect(streak.hasOwnProperty("lastLoginDate")).toBe(true);
  });

  it("should return a streak starting at 1 and keep track of lastLogindate", () => {
    const date = new Date();
    const streak = streakCounter(mockLocalStorage, date);

    function formattedDate(date: Date): string {
      // return date as 11/11/2021
      // other times it returns 11/11/2021, 12:00:00 AM
      // which is why we call the .split at the end
      return date.toLocaleDateString("en.US");
    }

    const dateFormatted = formattedDate(date);

    expect(streak.currentCount).toBe(1);
    expect(streak.lastLoginDate).toBe(dateFormatted);
  });
});
