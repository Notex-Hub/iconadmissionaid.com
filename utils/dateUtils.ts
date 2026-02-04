import moment from "moment";

/**
 * Safely format a date to avoid hydration mismatches.
 * This should be used in client components that render dates.
 * 
 * @param date - The date to format (string, Date, or moment object)
 * @param format - The moment.js format string (default: "MMM D, YYYY")
 * @param isMounted - Whether the component is mounted (client-side only)
 * @returns Formatted date string or empty string if not mounted
 */
export const formatDate = (
  date: string | Date | moment.Moment,
  format: string = "MMM D, YYYY",
  isMounted: boolean = true
): string => {
  if (!isMounted) return "";
  return moment(date).format(format);
};
