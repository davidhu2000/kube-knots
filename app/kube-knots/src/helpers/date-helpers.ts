import { formatDistance } from "date-fns";

export function formatDateString(date?: Date) {
  if (!date) {
    return "--";
  }

  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  });
}
