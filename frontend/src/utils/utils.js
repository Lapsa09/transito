import { DateTime } from "luxon";

export const dateAndTime = (newDate) => {
  return {
    fecha: newDate.toLocaleString(),
    hora: newDate.toLocaleString(DateTime.TIME_24_SIMPLE),
  };
};
