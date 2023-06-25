import { JSDOM } from "jsdom";
import { streakCounter } from "../src/index";
import { formattedDate } from "../src/utils";

describe("streakCounter", () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });

    mockLocalStorage = mockJSDom.window.localStorage;
  });

  afterEach(() => {
    mockLocalStorage.clear();
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
      return date.toLocaleDateString("en-US");
    }

    const dateFormatted = formattedDate(date);

    expect(streak.currentCount).toBe(1);
    expect(streak.lastLoginDate).toBe(dateFormatted);
  });

  it("should store the streak in localStorage", () => {
    const date = new Date();
    const key = "streak";

    streakCounter(mockLocalStorage, date);

    const streakAsString = mockLocalStorage.getItem(key);
    expect(streakAsString).not.toBeNull();
  });
});

describe("with a pre-populated streak", () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });
    mockLocalStorage = mockJSDom.window.localStorage;

    const date = new Date("12/12/2021");

    const streak = {
      currentCount: 1,
      startDate: formattedDate(date),
      lastLoginDate: formattedDate(date),
    };

    mockLocalStorage.setItem("streak", JSON.stringify(streak));
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it("should return a streak from localstorage", () => {
    const date = new Date();
    const streak = streakCounter(mockLocalStorage, date);

    // should match the dates used to set up the test
    expect(streak.startDate).toBe("12/12/2021");
  });

  it("should increment the streak", () => {
    // it should increment streak, because it is the day after
    // the streak started and a streak is days in a row
    const date = new Date("12/13/2021");
    const streak = streakCounter(mockLocalStorage, date);

    expect(streak.currentCount).toBe(2);
  });

  it("should not increase when login days are not consecutive", () => {
    // it should not increment because this is two days after
    const date = new Date("12/14/2021");
    const streak = streakCounter(mockLocalStorage, date);

    expect(streak.currentCount).toBe(1);
  });

  it("should save the incremented streak to localStorage", () => {
    const key = "streak";
    const date = new Date("12/13/2021");
    // Call it once so it updates the streak
    streakCounter(mockLocalStorage, date);

    const streakAsString = mockLocalStorage.getItem(key);
    // Normally you should wrap in try/catch in case the JSON is bad
    // but since we authored it, we can skip here
    const streak = JSON.parse(streakAsString || "");

    expect(streak.currentCount).toBe(2);
  });
});
