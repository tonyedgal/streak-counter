import { formattedDate } from "./utils";

interface Streak {
  currentCount: number;
  startDate: string;
  lastLoginDate: string;
}

// used when storing in local storage
const KEY = "streak";

export function streakCounter(storage: Storage, date: Date): Streak {
  // check if streak exists in local storage
  const streakInLocalStorage = storage.getItem(KEY);
  if (streakInLocalStorage) {
    try {
      const streak = JSON.parse(streakInLocalStorage);
      const state = "increment";
      const SHOULD_INCREMENT = state === "increment";

      if (SHOULD_INCREMENT) {
        const updatedStreak = {
          ...streak,
          currentCount: streak.currentCount + 1,
          lastLoginDate: formattedDate(date),
        };

        return updatedStreak;
      }

      return streak;
    } catch (error) {
      console.error("Failed to parse streak from local storage");
    }
  }

  const streak = {
    currentCount: 1,
    startDate: formattedDate(date),
    lastLoginDate: formattedDate(date),
  };

  // store in local storage
  storage.setItem(KEY, JSON.stringify(streak));

  return streak;
}
