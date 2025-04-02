import { DAY, HOUR, MIN, WEEK } from "./constants";

export type TimeDurationType = "MIN" | "HOUR" | "DAY" | "WEEK";

export const dateDisplay = (
  date: Date,
  resolution?: TimeDurationType,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }
) => {
  const now = Date.now();

  const diff = now - date.getTime();

  switch (true) {
    // case diff < SEC:
    //   return `now`
    case diff < MIN:
      return `now`;
    case diff < HOUR:
      const mins = Math.floor(diff / MIN);
      return `${mins} ${mins > 1 ? "minutes" : "minute"} ago.`;
    case diff < DAY:
      const hours = Math.floor(diff / HOUR);
      return `${hours} ${hours > 1 ? "hours" : "hour"} ago.`;
    case diff < WEEK:
      const weeks = Math.floor(diff / DAY);
      return `${weeks} ${weeks > 1 ? "days" : "day"} ago.`;
    default:
      return `${formatDate(date, options)}`;
  }
};

export const formatDate = (
  date: Date | number,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }
) => {
  const dateFormatter = Intl.DateTimeFormat("en-us", options);

  return dateFormatter.format(date);
};
