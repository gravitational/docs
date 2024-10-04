import { format } from "date-fns";

const date = new Date();

export const CURRENT_YEAR = date.getFullYear();

/*
  - formats date correctly, regardless of timezone
  - used on EventsBanner in the header.
*/
export const getParsedDate = (date: Date, dateFormat: string) => {
  const adjustedDate = new Date(
    // getTime() returns number of milliseconds between 1 January 1970 00:00:00 UTC and the given date
    date.getTime() +
      // getTimeZoneOffset returns the time zone difference, in minutes, from current locale to UTC
      // multiplying by '60' gives us the difference in seconds
      // multiplying by '1000' gives us the difference in milliseconds
      date.getTimezoneOffset() * 60 * 1000
  );

  return format(adjustedDate, dateFormat);
};
