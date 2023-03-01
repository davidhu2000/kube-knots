import { formatDistance } from "date-fns";

export function formatDateString(date?: Date) {
  return date
    ? formatDistance(new Date(date), new Date(), {
        addSuffix: true,
      })
    : "--";
}
