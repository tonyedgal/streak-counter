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
      const streak = JSON.parse(streakInLocalStorage || "");
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
